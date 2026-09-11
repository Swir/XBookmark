# SWIR Friend Radar — audyt niezawodności WEB + APK

## Stan audytu

Analiza dotyczy działającego silnika **Friend Radar 9.7**, używanego przez bazę 9.9/10.0/10.6, oraz zachowania protokołu potwierdzonego z APK CZATeria 2.6.3.

Celem nie jest obchodzenie ograniczeń serwera. Naprawa ma korzystać wyłącznie z normalnego protokołu klienta CZATerii i poprawić niezawodność tego, co już działa.

## Zweryfikowany protokół aplikacji

### Dodanie znajomego do APP

APK wysyła:

```text
code: 8
subcode: 4
userId: <numeryczne ID>
username: <nick>
isFriend: true
```

`subcode: 5` jest ścieżką usuwania.

### Pobranie globalnego stanu znajomych

APK wysyła:

```text
code: 85
```

i odbiera:

```text
code: 159
users[]
  id
  name
  rooms[]
```

APK wysyła `85` po uruchomieniu sesji i przy otwarciu widoku znajomych.

Webowy klient PC nie posiada własnego handlera `159`, dlatego SWIR przechwytuje tę odpowiedź.

## Skąd WEB zna userId

Klient może poznać `userId` z normalnych danych użytkownika:

- `183 cards[]` + `132 users[]`,
- `184` — pojedyncza karta użytkownika,
- obiekty `UserData` przez `getUcUserId()` w otwartych pokojach i privach.

Jeżeli klient nigdy nie widział użytkownika i nie ma go już na oficjalnej liście APP, nie ma uczciwego globalnego resolvera `nick -> userId` dla zwykłego konta. W takim przypadku Radar musi poczekać, aż klient pozna ID.

---

# Znalezione źródła niestabilności w Radarze 9.7

## 1. Fałszywe `SENT` przy zamkniętym WebSockecie — krytyczne

Natywna funkcja `CHNS.Connection.prototype.send()` sprawdza `webSocket.readyState`, ale po opuszczeniu bloku nadal może zakończyć się wartością `true`, nawet jeśli socket nie był `OPEN` i `webSocket.send()` nie został wykonany.

Radar 9.7 traktuje wynik `c.send(...) === true` jako dowód wysłania. To oznacza, że może zapisać `SENT` mimo że pakiet fizycznie nie został wysłany.

### Naprawa

Przed każdym pakietem Friend Protocol wybierać wyłącznie połączenie z:

```text
connection.webSocket.readyState === 1
```

Dopiero potem wywoływać `connection.send()`.

## 2. Kolizja timera `85`: 8 s kontra weryfikacja po 4,2 s — krytyczne

Radar 9.7 ogranicza `code 85` do jednego wysłania na 8 sekund.

Typowy scenariusz:

1. użytkownik otwiera panel Znajomi,
2. panel wysyła `85`,
3. po chwili użytkownik synchronizuje nick przez `8/4`,
4. Radar planuje kontrolne `85` po 4,2 s,
5. kontrolne `85` zostaje odrzucone przez własny limit 8 s,
6. nie ma kolejnej próby.

Efekt: serwer może już mieć znajomego, ale panel nadal pokazuje stary stan. Użytkownik widzi to jako „raz działa, raz nie”.

### Naprawa

Żądania `85` muszą trafiać do kolejki. Jeżeli limit czasowy blokuje żądanie, trzeba je wykonać po upływie limitu zamiast porzucać.

## 3. Jeden globalny limit `8/4` dla wszystkich nicków

Radar 9.7 ma jeden globalny `last8` i blokuje kolejne synchronizacje przez 5 sekund.

Kliknięcie synchronizacji drugiego znajomego w tym czasie może po prostu zwrócić `false`, bez czytelnego komunikatu.

### Naprawa

Zastosować kolejkę operacji albo stan `pending` per nick. Żadna świadoma akcja użytkownika nie może znikać bez informacji.

## 4. Stary `code 159` pozostaje w localStorage bez TTL

Stan `swir_friend_server_state_97` jest trwały i nie posiada realnego mechanizmu wygaśnięcia.

Po nowej sesji Radar może przez pewien czas prezentować stary stan APP jako aktualny, jeżeli nowe `85 -> 159` jeszcze nie zostało poprawnie wykonane.

Starszy patch 9.3 posiadał mechanizm świeżości (`FRESH = 150000`), którego 9.7 już nie używa.

### Naprawa

Stan serwera ma być oznaczony jako świeży tylko przez ograniczony czas, np. 150 sekund. Po starcie nowej sesji panel powinien wymusić świeże `85`.

## 5. Przechwytywanie odpowiedzi tylko przez `processMessage`

9.7 opakowuje `connection.processMessage`. Przy reconnectach i zmianach połączeń powstaje okno czasowe, w którym nowa odpowiedź może przyjść zanim nowe połączenie zostanie zahookowane przez skan co ~1,9 s.

Starszy patch 9.3 stosował dwa źródła przechwytywania:

- `processMessage`,
- `webSocket.addEventListener('message', ...)`.

### Naprawa

Nowy Radar powinien instalować listener bezpośrednio na każdym aktywnym WebSockecie przed wysłaniem `85`, a `processMessage` traktować jako dodatkowe zabezpieczenie.

## 6. Wybór połączenia nie gwarantuje aktywnego socketa

`req85()` korzysta z pierwszego elementu `conns()`. `connFor(n)` może również wrócić do połączenia zapamiętanego przez stary `channelId`.

Po reconnectach lub zamknięciu pokoju taki obiekt może nadal istnieć, ale jego socket może już nie być używalny.

### Naprawa

Każdy wybór połączenia musi filtrować `readyState === 1`. Dla synchronizacji nicka preferować aktywne połączenie, które aktualnie zna użytkownika; dopiero potem aktywne połączenie główne.

## 7. `SENT` nie oznacza `CONFIRMED`

Obecny log prób zapisuje `SENT` natychmiast po lokalnym `send()`. To oznacza tylko próbę wysłania, nie potwierdzenie przez `159`.

### Naprawa

Wprowadzić stan per nick:

```text
READY -> SENDING -> VERIFYING -> CONFIRMED
                         \-> FAILED / TIMEOUT
```

Dopiero obecność użytkownika w świeżej odpowiedzi `159` daje `CONFIRMED`.

---

# Plan SWIR 10.12 BETA — FRIENDS RELIABILITY

10.12 powinna bazować na zamrożonej, działającej 10.11 i modyfikować wyłącznie warstwę Znajomych.

Plan:

1. wybór wyłącznie otwartego WebSocketa (`readyState === 1`),
2. podwójny capture `159`: WebSocket listener + `processMessage`,
3. kolejka `85` — żadne żądanie weryfikacji nie może zostać zgubione przez throttle,
4. kolejka synchronizacji wielu nicków zamiast jednego globalnego `last8`,
5. świeżość `159` z TTL i wymuszone odświeżenie po nowej sesji,
6. stan per nick: READY / SENDING / VERIFYING / CONFIRMED / FAILED,
7. po `8/4` kontrolne `85` wykonywane dopiero wtedy, gdy może realnie zostać wysłane,
8. czytelna diagnostyka: liczba aktywnych socketów, ostatnie `85`, ostatnie `159`, wiek stanu, pending queue i ostatni błąd,
9. brak automatycznego wysyłania friend-protocol tylko dlatego, że użytkownik wszedł do pokoju,
10. brak zmian MIX, Ice, nicków i pozostałego panelu MOD.

## Zasada bezpieczeństwa rozwoju

10.11 pozostaje punktem kontrolnym. Naprawa Radaru powinna wejść jako osobna 10.12 BETA i mieć własny rollback. Nie nadpisujemy zamrożonych 10.0, 10.6 ani 10.11.
