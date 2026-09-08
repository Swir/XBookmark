# SWIR Friend Radar 9.7 — audyt WEB + APK 2.6.3

## Dlaczego poprzednie wersje działały dopiero po spotkaniu użytkownika w pokoju

APK nie ma globalnej funkcji `nick -> userId` dostępnej dla zwykłego użytkownika. W wewnętrznym resolverze aplikacja szuka ID kolejno w:

1. oficjalnych znajomych,
2. oficjalnych wrogach,
3. użytkownikach poznanych w otwartych pokojach,
4. użytkownikach poznanych w otwartych privach,
5. w przeciwnym razie zwraca `0`.

To wyjaśnia obserwację z testów: gdy SWIR zobaczył użytkownika w tym samym pokoju, klient poznał jego numeryczne `userId`. Dopiero wtedy można było wykonać normalną akcję dodania do APP.

## Zweryfikowany flow aplikacji

### Dodanie znajomego

APK tworzy pakiet:

```text
code: 8
subcode: 4
userId: <numeryczne ID>
username: <nick>
isFriend: true
```

`subcode: 5` jest ścieżką usuwania.

### Pobranie globalnego stanu znajomych

Aplikacja wysyła:

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

Dopiero użytkownik obecny na oficjalnej liście APP może być zwracany w `159` z globalnym `rooms[]`.

## Skąd web zna userId

Klient web poznaje `uid` z normalnych danych użytkownika. Najważniejsze ścieżki:

- `183 cards[]` + `132 users[]` — tablice są parowane indeksami,
- `184` — pojedyncza aktualizacja karty użytkownika,
- istniejące obiekty `UserData` przez `getUcUserId()` w otwartych pokojach/privach.

## Wniosek

Nie da się uczciwie zagwarantować globalnego Radaru dla zupełnie nieznanego lokalnego nicka, którego konto nie ma w APP i którego klient nigdy nie widział, ponieważ brakuje wymaganego `userId`.

Nie używamy uprzywilejowanego `whereIsUser` dla zwykłych kont i nie obchodzimy ograniczeń serwera.

## Co robi SWIR 9.7

- pasywnie przechwytuje `183+132`, `184` i `159`,
- zapamiętuje poznane `userId` w trwałym cache,
- skanuje normalne obiekty użytkowników ze wszystkich otwartych połączeń,
- pokazuje dla znajomego stan `APP`, `GOTOWY (ID znane)` albo `CZEKA NA ID`,
- po świadomym dodaniu lokalnego znajomego może zsynchronizować go do APP, gdy ID jest znane,
- ręczny `☁` wysyła dokładnie jeden normalny pakiet `code 8/subcode 4`,
- po udanej próbie wykonuje pojedynczą weryfikację `85 -> 159`,
- nie wysyła friend-protocol automatycznie przy samym wejściu na czat,
- nie używa bezpośredniego `webSocket.send()` jako obejścia.

Diagnostyka:

```javascript
SWIR_RADAR_DEBUG97.diagnostics()
```
