# XBookmark — SWIR Cloud Loader

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj całą jedną linię zaczynającą się od `javascript:`.
3. Utwórz zakładkę w przeglądarce i w polu adres/URL wklej tę linię.
4. Wejdź na `https://czateria.interia.pl/` i kliknij zakładkę.

Loader pobiera aktualny `swir.js` z tego repozytorium. Przy kolejnych aktualizacjach wystarczy podmienić `swir.js` — zakładki w Chrome nie trzeba zmieniać.

## Pliki

- `swir.js` — aktualny kod SWIR uruchamiany przez loader.
- `version.json` — aktualna wersja i kanał.
- `bookmark-loader.txt` — krótki bookmark do zapisania w Chrome.

## Bezpieczeństwo

Loader uruchamia kod tylko na domenie `czateria.interia.pl`. Repozytorium jest źródłem wykonywanego kodu, dlatego dostęp do zapisu powinien pozostać ograniczony do zaufanego właściciela.

## Aktualna wersja

SWIR 9.2 — COLOR LAB + IMAGE DIAGNOSTICS
