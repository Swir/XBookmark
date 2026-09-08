# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj jedną linię zaczynającą się od `javascript:` do adresu zakładki.
3. Wejdź na CZATerię, zrób pełne odświeżenie strony i kliknij zakładkę.

SMART loader pobiera aktualny SHA brancha `main` z GitHub API i ładuje dokładnie ten commit z jsDelivr.

## SWIR 9.8

9.8 zostawia silnik Friend Radar 9.7 i poprawia warstwę obsługi/UI:

- stabilne pole `Dodaj nick do znajomych SWIR` — nie jest już kasowane przez cykliczny render Radaru,
- naprawiona opcja prawego przycisku myszy `Dodaj/Usuń ze znajomych SWIR`,
- po dodaniu z menu kontekstowego Radar od razu skanuje cache ID i może wykonać normalny APP Sync, jeżeli `userId` jest znane,
- czysty nagłówek MOD: `SWIR // Czateria MOD by Swir v9.8`, bez duplikujących się napisów,
- 5 zapamiętywanych motywów całego czatu:
  - Gaming Neon,
  - Steel Gray — jaśniejsze, szarawe okno wiadomości,
  - Matrix,
  - Ocean,
  - Violet,
- neon pozostaje tylko na nickach autorów wiadomości,
- `📱` pozostaje tylko dla użytkowników faktycznie oznaczonych przez CZATerię jako mobile.

## Architektura

- `swir.js` — bootstrap 9.8,
- `swir-prepatch-96.js` — bramka anty-flood dla starego rdzenia,
- `swir-core.js` — rdzeń SWIR,
- `swir-ui-98.js` — UI/UX, motywy, stabilne pole znajomych i prawy klik,
- `swir-radar-97.js` — przebudowany Friend Radar oparty o flow APK,
- `FRIEND_RADAR_AUDIT_97.md` — audyt WEB + APK,
- `version.json` — bieżąca wersja,
- `bookmark-loader.txt` — SMART loader.

## Friend Radar — ważne

Oficjalne dodanie znajomego wymaga numerycznego `userId`. SWIR zapamiętuje ID osób poznanych przez normalny ruch klienta i po znanym ID może użyć zwykłego `code 8 / subcode 4`, a potem `85 -> 159` do odczytu `rooms[]` znajomych APP.

Diagnostyka Radaru:

```javascript
SWIR_RADAR_DEBUG97.diagnostics()
```

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani innych ograniczeń serwera.

## Aktualna wersja

SWIR 9.8 — UI + FRIEND UX + 5 THEMES + CLEAN MOD HEADER
