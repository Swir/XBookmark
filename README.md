# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.1 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.17 APK EXACT ROOMS** — zamrożona wersja potwierdzona w teście jako działająca
- Nieudane stare bety nie są już pokazywane w launcherze, ale pozostają w historii repo.

## SWIR 10.17.2 STABLE

Najważniejsza zasada tej wersji: **Friend Radar nie został przepisany ani zmieniony.** Stable ładuje dokładnie zamrożony stan 10.17 z commita:

`627f38c79ca474f53b266c74fa2136c3f4df7c76`

To jest wersja APK Exact Rooms, która została potwierdzona jako działająca.

### Friend Radar — APK EXACT

Mechanizm pozostaje bez zmian:

`code 8 / subcode 4 + userId + username + isFriend=true`

oraz:

`code 85 → code 159 → users[].rooms[]`

Panel pokazuje tylko lokalizację znajomego. Nie używa statusów APP/PC/SWIR jako informacji o urządzeniu i nie dodaje telefonu ani emoji do nicków.

## MIX pisania 8/8

MIX korzysta z pełnych ośmiu kombinacji B / I / U:

1. Normalne
2. B
3. I
4. U
5. B+I
6. B+U
7. I+U
8. B+I+U

Style działają jak potasowana talia: wszystkie osiem pojawia się przed kolejnym tasowaniem, bez natychmiastowego powtórzenia na granicy talii.

## ICE v2

ICE v2 jest **wyłącznie nakładką wizualną** i nie dotyka Friends Core, WebSocketów ani protokołu.

Poprawiono:

- zbyt biały i zlewający się wygląd,
- czytelność tekstu wiadomości,
- opacity elementów wiadomości,
- 12 natywnych kolorów wiadomości,
- zakładki pokoju,
- listę użytkowników i pokoi,
- panel MOD,
- pola tekstowe,
- Friend Radar,
- kontrast aktywnych zakładek i nagłówków.

W panelu MOD Stable nadpisuje również stary napis `10.6 BETA` na aktualne `v10.17.2 / STABLE`.

## Launcher 4.1

Launcher ponownie ma dwie osobne zakładki:

- **STABLE** — 10.17.2 Recommended, 10.17.1 rollback, 9.9.2 rollback,
- **BETA** — zamrożona **10.17 BETA APK EXACT ROOMS**.

## Jak testować 10.17.2

1. Zrób **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **STABLE → 10.17.2 STABLE — RECOMMENDED**.
4. Sprawdź **Znajomi** — powinny zachowywać się identycznie jak działająca 10.17 Beta.
5. Włącz **MIX 8/8**.
6. Przełącz motyw na **Ice Light** i sprawdź czytelność czatu oraz panelu MOD.

Jeżeli chcesz porównać sam Friend Radar bez nowych nakładek, wybierz **BETA → 10.17 BETA — APK EXACT ROOMS**.

## Diagnostyka

```javascript
SWIR_FRIENDS_PRIMARY1017?.diagnostics?.()
SWIR_ROOMS_PANEL1017?.diagnostics?.()
SWIR_MIX_STABLE10171?.deck?.()
SWIR_MIX_STABLE10171?.next?.()
SWIR_ICE_STABLE10172?.refresh?.()
```

---

**Aktualny układ: Launcher 4.1 • 10.17.2 STABLE RECOMMENDED • 10.17 BETA APK EXACT ROOMS**
