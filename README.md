# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj jedną linię zaczynającą się od `javascript:` do adresu zakładki.
3. Wejdź na `https://czateria.interia.pl/`, zrób pełne odświeżenie strony i kliknij zakładkę.

Loader pobiera aktualny SHA brancha `main` z GitHub API i ładuje dokładnie ten commit z jsDelivr, więc nie polega na cache `@main`.

## Architektura 9.6

- `swir.js` — bootstrap 9.6.
- `swir-prepatch-96.js` — bezpieczna bramka Friend Protocol ładowana **przed** rdzeniem.
- `swir-core.js` — sprawdzony rdzeń SWIR.
- `swir-patch-96.js` — pasywny Friend Radar, stabilne nicki i znacznik mobile.
- `version.json` — wersja/kanał.
- `bookmark-loader.txt` — SMART loader.

## Friend Radar 9.6 — PASSIVE

9.6 usuwa źródło niepotrzebnego ruchu sieciowego z 9.5.

- brak automatycznego `85` przy wejściu na czat,
- brak automatycznego `code 8` / APP Sync,
- brak bezpośredniego fallbacku `webSocket.send()` dla Friend Protocol,
- automatyczne pakiety friend-protocol ze starego rdzenia są blokowane przez prepatch,
- `📡` działa ręcznie i ma cooldown,
- `☁ APP` działa wyłącznie po kliknięciu użytkownika,
- wysyłka korzysta tylko z normalnego `Connection.send(...) === true`,
- odbieranie `159/163`, zbieranie ID z `183+132` i `184` nadal działa pasywnie,
- globalne pokoje znajomych APP pozostają zachowane.

Diagnostyka: `SWIR_RADAR_DEBUG96.diagnostics()`.

## Stabilne nicki 9.6

Kolorowany jest wyłącznie nick autora wiadomości `.m-msg-item-user-login` w oknie czatu.

- każdy nick ma stały jasny kolor,
- glow jest bardzo delikatny,
- brak animacji i migania,
- styl jest nadawany tylko raz nowemu elementowi wiadomości,
- lista osób, panel znajomych i inne części interfejsu nie dostają neonowych kolorów.

## Mobile badge

CZATeria udostępnia klientowi informację `isMobileUser`, dlatego SWIR może oznaczyć użytkownika mobilnego małą ikoną `📱` przy nicku autora wiadomości.

SWIR **nie wyświetla modelu telefonu**, ponieważ normalne dane użytkownika dostępne klientowi PC nie zawierają potwierdzonego pola typu model/producent urządzenia. Nie zgadujemy tej informacji.

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani innych ograniczeń serwera. Friend Radar korzysta z normalnych funkcji listy znajomych i w 9.6 celowo respektuje ograniczenia `Connection.send`.

## Aktualna wersja

SWIR 9.6 — PASSIVE FRIEND RADAR + STABLE CHAT NEON + MOBILE BADGE
