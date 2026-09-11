# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 3.6
- **BETA:** 10.17 — APK EXACT ROOMS
- **STABLE / recommended:** 9.9.2
- **10.16:** rollback Rooms Only
- **10.12:** BROKEN / PAUSED
- **10.6:** zamrożona baza UI / nicków / pisania

## Cel 10.17 — APK EXACT ROOMS

Friend Radar ma odpowiadać tylko na jedno pytanie: **na jakich pokojach znajduje się znajomy?**

10.17 została poprawiona po bezpośredniej analizie oryginalnego Android APK CZATeria 2.6.3. Potwierdziliśmy format dodawania znajomego:

`code 8 / subcode 4 + userId + username + isFriend=true`

oraz globalny snapshot znajomych:

`code 85 → code 159 → users[].rooms[]`

### Co 10.17 robi teraz tak jak APK

- ID znajomego najpierw bierze ze świeżego `159`, jeśli relacja już istnieje.
- Dla nowej relacji bierze aktualny UID z `UserData/UserCard` osoby widzianej w otwartym pokoju lub privie.
- Stary cache może być użyty tylko krótko i tylko z zaufanego źródła; nie wysyłamy wielokrotnie starego ID w ciemno.
- `8/4` i `85` idą przez pierwsze otwarte połączenie sesji, co odpowiada wyborowi pierwszego połączenia `NORMAL` w aplikacji Android.
- Wysyłka następuje tylko przy `WebSocket.readyState === OPEN`.
- Po starcie kasowany jest stary snapshot 10.17; globalne pokoje są uznawane dopiero po **świeżej odpowiedzi 159 w bieżącej sesji**.
- Stary Radar 9.7 nie może równolegle wysyłać konkurencyjnych `8/4` i `85`.

## Panel Znajomi

Panel nie pokazuje już statusów `APP`, `PC`, `SWIR` ani telefonu. Typ urządzenia nie ma znaczenia dla Radaru.

Dla znajomego wyświetlane jest:

- `Pokoje: ...` — świeże serwerowe `159.rooms[]`,
- `Widoczny teraz: ...` — tylko pokój faktycznie widziany przez bieżącego klienta, gdy nie mamy jeszcze wyniku serwerowego,
- informacja o oczekiwaniu na ID/serwer, jeśli danych jeszcze nie ma.

Panel nie jest już przebudowywany cyklicznie co kilka sekund, więc nie powinien mrugać.

## Nick Integrity

10.17 zachowuje poprawkę 10.14:

- natywny nick w rozmowie pozostaje czystym `Nick:`,
- brak telefonów, emoji i badge dodawanych przez SWIR do nicka,
- kolor zmieniany jest wyłącznie CSS-em,
- kliknięcie nicka pozostaje zgodne z oryginalnym klientem CZATerii.

## Jak testować

1. Zrób **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **BETA → 10.17 BETA — APK EXACT ROOMS**.
4. Otwórz **Znajomi** i kliknij **ODŚWIEŻ**.
5. Najważniejszy test: osoba korzystająca z aplikacji mobilnej, którą widzisz w pokoju. Po zdobyciu jej aktualnego UID SWIR wysyła oficjalny `8/4`, a następnie weryfikuje relację przez `85 → 159`.

## Diagnostyka

```javascript
SWIR_FRIENDS_PRIMARY1017?.diagnostics?.()
SWIR_FRIENDS_PRIMARY1017?.jobs?.()
SWIR_FRIENDS_PRIMARY1017?.resolveId?.("NICK")
SWIR_ROOMS_PANEL1017?.diagnostics?.()
```

Najważniejsze pola to `idSource`, `state`, `attempts`, `serverFresh` i `rooms`.

## Kanały

| Wersja | Status | Opis |
|---|---|---|
| 10.17 | CURRENT BETA | APK Exact Rooms: APK-owy UID/transport + świeże 159.rooms[] |
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

SWIR nie nadaje uprawnień administratora i nie używa uprzywilejowanego `whereIsUser`. Globalne pokoje pochodzą wyłącznie z normalnego mechanizmu znajomych `85 → 159`.

---

**Aktualny układ: Launcher 3.6 • 10.17 BETA APK EXACT ROOMS • 9.9.2 STABLE RECOMMENDED**
