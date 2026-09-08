# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj jedną linię zaczynającą się od `javascript:` do adresu zakładki.
3. Wejdź na CZATerię, zrób pełne odświeżenie strony i kliknij zakładkę.

SMART loader pobiera aktualny SHA brancha `main` z GitHub API i ładuje dokładnie ten commit z jsDelivr, więc nie polega na cache `@main`.

## Architektura 9.7

- `swir.js` — bootstrap 9.7.
- `swir-prepatch-96.js` — bramka anty-flood dla Friend Protocol.
- `swir-core.js` — sprawdzony rdzeń SWIR.
- `swir-patch-96.js` — stabilne nicki na czacie + mobile badge + UI.
- `swir-radar-97.js` — przebudowany Friend Radar oparty o zweryfikowany flow APK.
- `FRIEND_RADAR_AUDIT_97.md` — opis audytu WEB + APK.
- `version.json` — wersja/kanał.
- `bookmark-loader.txt` — SMART loader.

## Friend Radar 9.7 — REBUILD

Audyt APK 2.6.3 wyjaśnił zachowanie poprzednich wersji: oficjalne dodanie znajomego wymaga numerycznego `userId`. Aplikacja mobilna nie posiada zwykłej globalnej ścieżki `sam nick -> userId`; szuka ID w znanych znajomych/wrogach oraz użytkownikach poznanych w otwartych pokojach i privach.

Dlatego SWIR 9.7:

- pasywnie zbiera `userId` z normalnego ruchu klienta (`183+132`, `184`) i z istniejących obiektów CHNS,
- zapamiętuje ID w trwałym cache,
- odbiera oficjalny stan APP przez `85 -> 159`, gdzie `159` zawiera `users[]` i `rooms[]`,
- przy znanym ID może wykonać normalne dodanie znajomego: `code 8`, `subcode 4`, `userId`, `username`, `isFriend:true`,
- nie wysyła Friend Protocol automatycznie przy samym wejściu na czat,
- nie używa bezpośredniego `webSocket.send()` jako obejścia,
- pokazuje jasno stany: APP / ID GOTOWE / CZEKA NA ID.

W praktyce: jeżeli klient kiedykolwiek pozna ID danego nicka w otwartym pokoju lub privie, SWIR może je zapamiętać i później użyć do oficjalnej synchronizacji APP. Po udanej synchronizacji `85 -> 159` może zwracać jego globalne pokoje.

Diagnostyka:

```javascript
SWIR_RADAR_DEBUG97.diagnostics()
```

## Stabilne nicki i mobile badge

Warstwa 9.6 pozostaje jako sprawdzony UI:
- kolorowany jest wyłącznie nick autora wiadomości,
- brak migania/animacji,
- glow jest delikatny,
- `📱` pojawia się tylko gdy CZATeria sama oznacza użytkownika jako mobilnego.

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani ograniczeń serwera. Uprzywilejowane `whereIsUser` pozostaje dostępne wyłącznie dla kont, które naprawdę mają odpowiednie uprawnienia.

## Aktualna wersja

SWIR 9.7 — FRIEND RADAR REBUILD + APK-ACCURATE ID CACHE
