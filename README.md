# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 3.4
- **BETA:** 10.16 — ROOMS ONLY
- **STABLE / recommended:** 9.9.2
- **10.15:** rollback Global Rooms
- **10.12:** BROKEN / PAUSED
- **10.6:** zamrożona baza UI / nicków / pisania

## Cel 10.16 — ROOMS ONLY

Panel Znajomych odpowiada teraz tylko na jedno pytanie: **na jakich pokojach znajduje się znajomy?**

Usunęliśmy z widoku mylące oznaczenia `APP`, `PC`, `SWIR` oraz status mobile/telefon. Nie mają one wpływu na sposób synchronizacji i nie są potrzebne do odczytu lokalizacji.

Dla każdego znajomego:

- najpierw preferujemy pełne dane serwerowe z `code 159 → rooms[]`,
- jeśli pełnego rekordu serwerowego jeszcze nie ma, pokazujemy wyłącznie pokoje faktycznie widziane przez otwarte połączenia/cache,
- w tle Global Rooms Core nadal próbuje zsynchronizować znajomego normalną ścieżką `code 8 / subcode 4 → code 85 → code 159`,
- jeśli serwer zwróci kilka pokoi, pokazujemy wszystkie,
- jeśli serwer zwróci jeden pokój, pokazujemy jeden — SWIR nie dopisuje lokalizacji, których serwer nie podał.

## Dlaczego poprzedni panel był mylący

Friend Radar 9.7 używał badge `APP` jako oznaczenia **rekordu z serwerowej listy znajomych**, a nie jako informacji o tym, czy dana osoba faktycznie korzysta z aplikacji mobilnej. Jednocześnie `PC` oznaczało lokalną obserwację pokoju. Przez to panel wyglądał tak, jakby status urządzenia był odwrócony.

10.16 usuwa całe to rozróżnienie z interfejsu.

## Nick Integrity

10.16 zachowuje poprawkę z 10.14:

- natywny nick w rozmowie ma czysty tekst `Nick:`,
- brak SWIR-owych telefonów, emoji i badge wewnątrz elementu nicka,
- kolor nicka może być poprawiany tylko CSS-em,
- kliknięcie nicka pozostaje kompatybilne z oryginalnym klientem CZATerii.

## Jak testować

1. Wykonaj **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **BETA → 10.16 BETA — ROOMS ONLY**.
4. Otwórz panel Znajomi.
5. Kliknij **ODŚWIEŻ** i odczekaj kilka sekund.

Panel powinien pokazywać tylko nick oraz:

- `Pokoje: ...` — gdy mamy pełne `159.rooms[]`,
- `Widoczny teraz: ...` — gdy mamy tylko lokalną obserwację,
- `Brak aktualnej lokalizacji — czekam na dane serwera` — gdy nie mamy jeszcze żadnych danych.

## Diagnostyka

```javascript
SWIR_ROOMS_PANEL1016?.diagnostics?.()
SWIR_FRIENDS_GLOBAL1015?.diagnostics?.()
SWIR_FRIENDS_GLOBAL1015?.jobs?.()
```

## Kanały

| Wersja | Status | Opis |
|---|---|---|
| 10.16 | CURRENT BETA | Rooms Only: nick → pokoje, bez APP/PC/SWIR/mobile |
| 10.15 | ROLLBACK | Global Rooms Core + stary panel 9.7 |
| 10.14 | ROLLBACK | Nick Integrity + Friends Core |
| 10.13 | ROLLBACK | Clean Recovery |
| 10.12 | BROKEN / PAUSED | regresja UI |
| 10.11 | ROLLBACK | UI Safe + Phone Clean |
| 10.10 | PAUSED | regresja klikalności MOD |
| 10.9 | ROLLBACK | Friends Clean |
| 10.6 | FROZEN | baza 10.16 |
| 9.9.2 | STABLE RECOMMENDED | sprawdzona wersja stabilna |

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora i nie używa uprzywilejowanego `whereIsUser`. Globalne pokoje pochodzą z normalnego mechanizmu znajomych `85 → 159`.

---

**Aktualny układ: Launcher 3.4 • 10.16 BETA ROOMS ONLY • 9.9.2 STABLE RECOMMENDED**
