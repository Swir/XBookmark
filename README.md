# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj całą jedną linię zaczynającą się od `javascript:`.
3. Utwórz zakładkę w przeglądarce i w polu adres/URL wklej tę linię.
4. Wejdź na `https://czateria.interia.pl/` i kliknij zakładkę.

Loader pobiera aktualny `swir.js` z tego repozytorium. Zakładki w Chrome nie trzeba zmieniać przy kolejnych aktualizacjach.

## Architektura 9.3

- `swir.js` — mały bootstrap cloud.
- `swir-core.js` — sprawdzony rdzeń SWIR 9.2.
- `friend-radar-patch.js` — poprawka Friend Radar 9.3.
- `version.json` — wersja i kanał.
- `bookmark-loader.txt` — krótki bookmark.

## Friend Radar 9.3

- dodatkowy nasłuch odpowiedzi 159 bezpośrednio na WebSocket,
- automatyczne odświeżenie 85→159 po zmianie pokoju,
- globalne rooms[] dla oficjalnych znajomych APP,
- diagnostyka `SWIR_RADAR_DEBUG.diagnostics()`,
- rozróżnienie APP oraz SWIR ONLY.

Uwaga: znajomy dodany wyłącznie lokalnie do listy SWIR nie staje się automatycznie znajomym konta na serwerze. Globalne `rooms[]` z odpowiedzi 159 są dostępne dla pozycji zwróconych przez serwer jako znajomi APP. Lokalny `SWIR ONLY` może być wykryty tylko w pokojach otwartych w kliencie.

## Bezpieczeństwo

Loader uruchamia kod tylko na domenie `czateria.interia.pl`. Friend Radar korzysta z normalnego żądania stanu znajomych aplikacji 85→159 i nie nadaje uprawnień admin/honour.

## Aktualna wersja

SWIR 9.3 — FRIEND RADAR FIX + GLOBAL APP STATE + DIAGNOSTICS
