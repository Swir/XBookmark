# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj całą jedną linię zaczynającą się od `javascript:`.
3. Utwórz zakładkę w przeglądarce i w polu adres/URL wklej tę linię.
4. Wejdź na `https://czateria.interia.pl/` i kliknij zakładkę.

Od wersji 9.4 loader pyta publiczne GitHub API o aktualny SHA brancha `main`, a następnie ładuje dokładnie ten commit z jsDelivr. Dzięki temu nie powinien już dostawać starego `@main` z cache CDN.

## Architektura 9.4

- `swir.js` — mały bootstrap cloud.
- `swir-core.js` — sprawdzony rdzeń SWIR 9.2.
- `swir-patch-94.js` — Friend Radar APP Sync + neonowe nicki + poprawki MOD UI.
- `version.json` — aktualna wersja i kanał.
- `bookmark-loader.txt` — smart loader przypinający aktualny commit.

## Friend Radar 9.4

- dodatkowy nasłuch odpowiedzi 159 przez `processMessage` i WebSocket,
- automatyczne odświeżenie 85→159 po zmianie pokoju,
- zapamiętywanie `rooms[]` i ID użytkowników,
- rozróżnienie `APP` i `SWIR`,
- nowy przycisk `☁ APP` w panelu znajomych,
- `☁ APP` używa normalnej funkcji aplikacji mobilnej: `code:8`, `subcode:4`, `isFriend:true`, a potem odświeża `85→159`,
- diagnostyka: `SWIR_RADAR_DEBUG.diagnostics()`.

Analiza APK 2.6.3 potwierdziła:
- `code 8 / subcode 4` = dodanie użytkownika do listy friend/enemy,
- `isFriend:true` = znajomy,
- `code 8 / subcode 5` = usunięcie z listy.

Żeby lokalny `SWIR ONLY` dostał globalne pokoje z `159`, musi zostać zsynchronizowany z normalną listą APP. SWIR zapamiętuje ID użytkownika, kiedy ten pojawi się w którymś otwartym pokoju. Synchronizacja jest wykonywana dopiero po kliknięciu `☁ APP`.

## Neon UI 9.4

- jasna gamingowa paleta nicków,
- każdy nick dostaje stały kolor wyliczony z nazwy,
- bez ciemnych granatowych nicków,
- neonowy glow na czacie i liście osób,
- poprawiony nagłówek MOD,
- motywy Cyber / Matrix / Ocean / Amber mają czytelne kolorowe przyciski z nazwami zamiast pustych pól.

## Bezpieczeństwo

Loader uruchamia kod tylko na domenie `czateria.interia.pl`. Friend Radar korzysta z normalnych funkcji listy znajomych aplikacji i nie nadaje uprawnień admin/honour.

## Aktualna wersja

SWIR 9.4 — FRIEND APP SYNC + NEON NICKS + UI POLISH
