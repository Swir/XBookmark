# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.0 — STABLE ONLY
- **STABLE / recommended:** **10.17.1**
- Publiczny launcher nie pokazuje już kanału BETA.
- Starsze buildy beta pozostają wyłącznie w historii/repo jako zaplecze techniczne do rollbacku i analizy.

## SWIR 10.17.1 STABLE

10.17.1 powstała z działającej 10.17 APK EXACT ROOMS i zachowuje poprawiony Friend Radar bez zmian w jego działającym protokole.

### Friend Radar — APK EXACT

Friend Radar odpowiada na jedno pytanie: **na jakich pokojach znajduje się znajomy?**

Mechanizm został odwzorowany po analizie oryginalnego Android APK CZATeria 2.6.3:

`code 8 / subcode 4 + userId + username + isFriend=true`

oraz:

`code 85 → code 159 → users[].rooms[]`

- UID nowej relacji pochodzi z aktualnego `UserData/UserCard`, a nie ze starego, nieograniczonego cache.
- Pakiety idą przez pierwsze otwarte połączenie sesji.
- Globalne pokoje są uznawane dopiero po świeżym `159` w bieżącej sesji.
- Panel pokazuje tylko lokalizację: `Pokoje: ...` albo lokalny fallback `Widoczny teraz: ...`.
- Brak statusów `APP`, `PC`, `SWIR` i brak telefonów/emoji dodawanych do nicków.
- Panel nie jest cyklicznie przebudowywany, więc nie powinien mrugać.

## MIX pisania 8/8

MIX korzysta z pełnego zestawu natywnych kombinacji `msgIsBold / msgIsItalic / msgIsUnderline`:

1. Normalne
2. Pogrubione — B
3. Kursywa — I
4. Podkreślone — U
5. Pogrubione + kursywa — B+I
6. Pogrubione + podkreślone — B+U
7. Kursywa + podkreślone — I+U
8. Pogrubione + kursywa + podkreślone — B+I+U

MIX działa jak **losowa talia 8 stylów**: każda kombinacja występuje raz przed kolejnym przetasowaniem. Pierwszy styl nowej talii nie może być taki sam jak ostatni poprzedniej, więc nie ma natychmiastowego powtórzenia na granicy talii. Ręczny styl użytkownika jest przywracany po wysłaniu wiadomości.

## ICE Color Rework

Motyw **Ice Light** został przebudowany, ponieważ poprzednia wersja była zbyt biała i elementy zlewały się ze sobą.

10.17.1 dodaje:

- niebieskie nagłówki i aktywne zakładki,
- oddzielone kolorystycznie panele i listy,
- kontrastowe pola tekstowe i przyciski,
- kolorowy Friend Radar,
- naprzemienne delikatne tła w listach,
- przywrócone czytelne mapowanie **12 kolorów wiadomości** zamiast wymuszania jednego koloru na całym czacie.

## Nick Integrity

- Natywny nick w rozmowie pozostaje czystym `Nick:`.
- SWIR nie dodaje telefonu ani emoji do elementu nicka.
- Kolor nicka jest modyfikowany wyłącznie wizualnie przez CSS.
- Klikanie nicków pozostaje kompatybilne z oryginalnym klientem CZATerii.

## Jak uruchomić

1. Zrób **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. W Launcherze 4.0 wybierz **SWIR 10.17.1 — RECOMMENDED**.

## Diagnostyka

Friend Radar:

```javascript
SWIR_FRIENDS_PRIMARY1017?.diagnostics?.()
SWIR_FRIENDS_PRIMARY1017?.jobs?.()
SWIR_ROOMS_PANEL1017?.diagnostics?.()
```

MIX:

```javascript
SWIR_MIX_STABLE10171?.deck?.()
SWIR_MIX_STABLE10171?.next?.()
```

## Publiczne wersje

| Wersja | Status | Opis |
|---|---|---|
| **10.17.1** | **STABLE RECOMMENDED** | APK Exact Rooms + MIX 8/8 + ICE Color Rework |
| 9.9.2 | ROLLBACK | poprzedni recommended Stable |
| 9.9.1 | ROLLBACK | starszy Stable |
| 9.9 / 9.8 / 9.7 / 9.6 | ARCHIVE | historyczne wersje stabilne |

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora i nie używa uprzywilejowanego `whereIsUser`. Globalne pokoje pochodzą z normalnego mechanizmu znajomych `85 → 159`.

---

**Aktualny układ: Launcher 4.0 STABLE ONLY • SWIR 10.17.1 STABLE RECOMMENDED**
