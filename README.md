# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.6 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.22 — FRIEND ACK SYNC**
- **BETA rollback:** 10.20 Friend Identity Guard
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **BETA baseline:** 10.17 APK Exact Rooms
- **10.21 Honour Probe:** usunięty z aktywnych wersji po nieudanym teście

## 10.22 BETA — FRIEND ACK SYNC

10.22 powstała po ponownej analizie oryginalnego APK CZATeria 2.6.3. Najważniejsza zmiana nie dotyczy wyglądu, ikon telefonu ani rang użytkownika — dotyczy **kolejności protokołu znajomych**.

### Co było nie tak

Poprzedni Friends Core działał w uproszczeniu tak:

`wyślij 8/4 → odczekaj stałe ~2,8 s → wyślij 85 → czekaj na 159`

APK działa inaczej. Po wysłaniu pakietu dodania znajomego:

`code 8 / subcode 4 / userId / username / isFriend=true`

aplikacja czeka na **zwrotny pakiet `code 8 / subcode 4` z backendu**. Dopiero ten pakiet potwierdza, że relacja znajomego została przyjęta. W Androidzie obsługa tego ACK aktualizuje wewnętrzny `friendsEnemiesState` i emituje zdarzenie nowego znajomego.

Dopiero potem zapytanie:

`code 85`

ma zwrócić pełny snapshot:

`code 159 → users[].rooms[]`.

Webowa CZATeria nie ma normalnej obsługi `case 8` dla tej funkcji, więc serwerowy ACK był przez klienta web ignorowany. SWIR również go wcześniej nie wykorzystywał.

### Nowy flow 10.22

10.22 odwzorowuje kolejność APK:

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 → code 159 → rooms[]`

Nie zgadujemy już czasu potrzebnego backendowi.

Friend Core ma teraz czytelne stany diagnostyczne:

- `WAIT_ACK` — wysłano dodanie znajomego i czekamy na potwierdzenie serwera,
- `ACKED` — backend potwierdził relację,
- `WAIT_159` — po ACK pobierany jest snapshot znajomych,
- `CONFIRMED` — użytkownik istnieje w aktualnym `159`,
- `NO_ACK` — po ograniczonej liczbie prób backend nie odesłał potwierdzenia 8/4,
- `ACK_NO_159` — backend potwierdził relację, ale użytkownik nadal nie pojawia się w `159`,
- `WAIT_ID` — brak aktualnego UID użytkownika,
- `ID_CONFLICT` — wykryto różne UID i SWIR nie wysyła ryzykownego żądania.

Po ACK 10.22 wykonuje ograniczone ponowienia `85`, zamiast spamować backend.

## Panel Znajomych

Panel pozostaje **ROOMS ONLY**. Interesują nas wyłącznie lokalizacje:

- `Pokoje: ...` — pełne dane z serwerowego `159.rooms[]`,
- `Brak aktywnego pokoju` — użytkownik istnieje w świeżym `159`, ale jego `rooms[]` jest pusty,
- `Widoczny teraz: ...` — jedynie lokalna obserwacja podczas oczekiwania na serwer.

Nie pokazujemy statusów `APP`, `PC`, `SWIR` ani `HONOUR` jako informacji o lokalizacji.

## Honour / mobile

Test 10.21 wykazał, że dokładanie ścieżki honour nie rozwiązuje problemu i pogarsza zachowanie. **10.21 został usunięty z aktywnego launchera i katalogu wersji.**

10.22:

- nie zmienia `perm`,
- nie emuluje `isHonour()` ani `isAdmin()`,
- nie używa uprzywilejowanego `whereIsUser`,
- traktuje natywną ikonkę telefonu wyłącznie jako element UI, nie część loginu.

Przy starcie 10.22 usuwa wyłącznie pozostałości eksperymentu 10.21: storage Honour Probe oraz rekordy cache jawnie oznaczone `probe1021:true`. Poprawne UID z kart użytkowników i `159` zostają zachowane.

## MIX pisania — zamrożony

10.22 nie przebudowuje działającego mechanizmu pisania. Ładuje dokładnie moduł MIX z 10.19, który został potwierdzony testem.

MIX nadal używa pełnej talii 8/8:

1. normalne,
2. B,
3. I,
4. U,
5. B+I,
6. B+U,
7. I+U,
8. B+I+U.

## Diagnostyka 10.22

```javascript
SWIR_FRIENDS_ACK1022?.diagnostics?.()
SWIR_ROOMS_PANEL1022?.diagnostics?.()
SWIR_BETA1022?.diagnostics?.()
```

Najbardziej interesujący jest stan konkretnego znajomego:

- `WAIT_ACK → ACKED → WAIT_159 → CONFIRMED` oznacza prawidłowy pełny flow,
- `NO_ACK` oznacza, że backend nie potwierdził `8/4`,
- `ACK_NO_159` rozdziela problem: relacja została potwierdzona, ale snapshot `159` nadal jej nie zawiera.

## Launcher 4.6

- **STABLE** — bez zmian,
- **BETA 10.22** — Friend ACK Sync,
- **BETA 10.20** — Identity Guard rollback,
- **BETA 10.19** — działający MIX 8/8 rollback,
- **BETA 10.18** — starszy rollback,
- **BETA 10.17** — czysta baza Friend Radar,
- **10.21** — usunięty z aktywnego katalogu.

## Test 10.22

1. Zrób **Ctrl+F5** na CZATerii.
2. XBookmark → **BETA → 10.22 BETA — FRIEND ACK SYNC**.
3. Otwórz **Znajomi** i kliknij **ODŚWIEŻ**.
4. Sprawdź szczególnie osobę, która wcześniej pojawiała się tylko jako lokalnie widoczna.
5. Obserwuj komunikat przy nicku — panel pokaże, czy czekamy na ACK, czy backend już potwierdził relację i pobieramy `159`.
6. MIX powinien zachowywać się dokładnie jak w 10.19.

---

**Aktualny układ: Launcher 4.6 • 10.17.2 STABLE • 10.22 BETA FRIEND ACK SYNC • 10.20 rollback • 10.19 working MIX rollback • 10.17 Friends baseline**
