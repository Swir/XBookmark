# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj całą jedną linię zaczynającą się od `javascript:`.
3. Utwórz zakładkę w przeglądarce i w polu adres/URL wklej tę linię.
4. Wejdź na `https://czateria.interia.pl/`, odśwież stronę i kliknij zakładkę.

Loader pyta GitHub API o aktualny SHA brancha `main`, a następnie ładuje dokładnie ten commit z jsDelivr. Dzięki temu nie polega na cache `@main`.

## Architektura 9.5

- `swir.js` — mały bootstrap cloud 9.5.
- `swir-core.js` — sprawdzony rdzeń SWIR 9.2.
- `swir-patch-95.js` — Friend Radar REAL SYNC + neon tylko na nickach autorów wiadomości + poprawka MOD UI.
- `version.json` — aktualna wersja i kanał.
- `bookmark-loader.txt` — smart loader przypinający aktualny commit.

## Friend Radar 9.5 — REAL SYNC

Najważniejsza poprawka 9.5 usuwa błąd z poprzedniej wersji: `Connection.send()` jest teraz uznawane za udane tylko przy dokładnym `=== true`. Wcześniej `undefined !== false` mogło błędnie wyglądać jak poprawna wysyłka.

Radar 9.5:
- przechwytuje odpowiedzi `159` i `163`,
- łapie ID użytkowników z normalnego ruchu klienta: `183 cards[]` + `132 users[]` sparowane indeksami,
- łapie pojedyncze ID z `184 userName + uid`,
- zbiera ID również z istniejących list użytkowników klienta,
- zapisuje ID w `swir_friend_identity_cache`,
- synchronizuje lokalnych znajomych SWIR z normalną listą APP dopiero, gdy ma ich prawidłowe ID,
- używa zweryfikowanej akcji aplikacji: `code:8`, `subcode:4`, `userId`, `username`, `isFriend:true`,
- po dodaniu ponawia `85 → 159` kilka razy,
- zachowuje przycisk `☁ APP` jako ręczną synchronizację,
- ma diagnostykę `SWIR_RADAR_DEBUG95.diagnostics()`.

Analiza APK 2.6.3 potwierdziła:
- `code 8 / subcode 4` = dodanie użytkownika do listy friend/enemy,
- `isFriend:true` = znajomy,
- `code 8 / subcode 5` = usunięcie z listy.

Jeśli serwer zaakceptuje dodanie, znajomy powinien zmienić się z `SWIR` na `APP + SWIR`, a `159` może wtedy zwracać jego pokoje globalnie. Jeżeli konto lub serwer nie udostępnia tej informacji, SWIR tego nie obchodzi przez uprawnienia administracyjne.

## Nicki 9.5

Neon jest teraz celowo ograniczony tylko do nicku autora wiadomości w oknie czatu:
- selektor `.m-msg-item-user-login` wewnątrz panelu wiadomości,
- każdy nick ma własny jasny, stały kolor,
- glow jest delikatny,
- lista osób, panel Znajomi, MOD, tematy i inne elementy nie są kolorowane.

## MOD UI 9.5

Nagłówek panelu został uporządkowany do jednej linii:
`SWIR // Czateria MOD by Swir v9.5`

Usunięto duplikujący pseudo-napis i pozostawiono badge `GAMING UI`.

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani ograniczeń serwera. Globalny Radar korzysta z normalnej listy znajomych aplikacji; `whereIsUser` pozostaje ograniczone do kont, które naprawdę mają odpowiednie uprawnienia.

## Aktualna wersja

SWIR 9.5 — FRIEND RADAR REAL SYNC + CHAT-ONLY NEON NICKS + UI FIX
