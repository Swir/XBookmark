# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 3.5
- **BETA:** 10.17 — PRIMARY ROOMS
- **STABLE / recommended:** 9.9.2
- **10.16:** rollback Rooms Only
- **10.12:** BROKEN / PAUSED
- **10.6:** zamrożona baza UI / nicków / pisania

## Cel 10.17 — PRIMARY ROOMS

Panel Znajomych nadal odpowiada tylko na jedno pytanie: **na jakich pokojach znajduje się znajomy?**

Najważniejsza zmiana 10.17 nie dotyczy wyglądu panelu, tylko transportu Friend Protocol.

Analiza oryginalnego Android APK CZATeria 2.6.3 potwierdziła format dodawania znajomego:

`code 8 / subcode 4 + userId + username + isFriend=true`

Czyli poprzednie bety miały właściwy format pakietu. Podejrzenie przeniosło się na **wybór połączenia**, przez które pakiet był wysyłany.

### Primary Transport

10.17 działa tak:

1. wysyła zwykłe `code 85`,
2. przechwytuje odpowiedź `code 159`,
3. zapamiętuje połączenie, na którym faktycznie przyszła odpowiedź 159,
4. to samo przypięte połączenie wykorzystuje do `code 8 / subcode 4`,
5. po dodaniu znajomego tym samym połączeniem wysyła ponownie `85`,
6. dopiero obecność użytkownika w nowym `159` oznacza potwierdzoną synchronizację,
7. lokalizacja jest wyświetlana z `159.rooms[]`.

Stary Radar 9.7 pozostaje częścią zamrożonej bazy 10.6, ale w 10.17 jego własne pakiety `8/4` i `85` są izolowane. Dzięki temu stary i nowy silnik nie wysyłają równocześnie konkurencyjnych żądań.

## Bez APP / PC / telefonu

Typ urządzenia nie jest potrzebny do działania Radaru. Panel 10.17 nie pokazuje badge `APP`, `PC`, `SWIR` ani telefonu.

Dla każdego znajomego wyświetlamy:

- `Pokoje: ...` — pełne dane z `159.rooms[]`,
- `Widoczny teraz: ...` — wyłącznie lokalnie zaobserwowany pokój, gdy serwer nie potwierdził jeszcze pełnego wyniku,
- informację o oczekiwaniu, jeśli nie mamy jeszcze lokalizacji.

## Nick Integrity

10.17 zachowuje poprawkę z 10.14:

- natywny nick w rozmowie ma czysty tekst `Nick:`,
- brak SWIR-owych telefonów, emoji i badge wewnątrz elementu nicka,
- kolor nicka może być poprawiany tylko CSS-em,
- kliknięcie nicka pozostaje kompatybilne z oryginalnym klientem CZATerii.

## Jak testować

1. Zrób **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **BETA → 10.17 BETA — PRIMARY ROOMS**.
4. Otwórz **Znajomi**.
5. Kliknij **ODŚWIEŻ** i odczekaj kilka sekund.
6. Najważniejszy test: sprawdź znajomego, który korzysta z aplikacji mobilnej i wcześniej był widoczny tylko w jednym wspólnym pokoju.

## Diagnostyka

W konsoli można uruchomić:

```javascript
SWIR_FRIENDS_PRIMARY1017?.diagnostics?.()
SWIR_FRIENDS_PRIMARY1017?.jobs?.()
SWIR_FRIENDS_PRIMARY1017?.primary?.()
SWIR_ROOMS_PANEL1017?.diagnostics?.()
```

Najważniejsze pola to `primary`, `idSource`, `state`, `attempts` i `rooms`.

## Kanały

| Wersja | Status | Opis |
|---|---|---|
| 10.17 | CURRENT BETA | Primary Transport: jeden potwierdzony transport dla 8/4 oraz 85→159; panel tylko pokoje |
| 10.16 | ROLLBACK | Rooms Only + Global Rooms Core 10.15 |
| 10.15 | ROLLBACK | Global Rooms Core + stary panel 9.7 |
| 10.14 | ROLLBACK | Nick Integrity + Friends Core |
| 10.13 | ROLLBACK | Clean Recovery |
| 10.12 | BROKEN / PAUSED | regresja UI |
| 10.11 | ROLLBACK | UI Safe + Phone Clean |
| 10.10 | PAUSED | regresja klikalności MOD |
| 10.9 | ROLLBACK | Friends Clean |
| 10.6 | FROZEN | baza 10.17 |
| 9.9.2 | STABLE RECOMMENDED | sprawdzona wersja stabilna |

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora i nie używa uprzywilejowanego `whereIsUser`. Globalne pokoje pochodzą z normalnego mechanizmu znajomych `85 → 159`.

---

**Aktualny układ: Launcher 3.5 • 10.17 BETA PRIMARY ROOMS • 9.9.2 STABLE RECOMMENDED**
