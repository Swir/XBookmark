# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.4 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.20 — FRIEND IDENTITY GUARD**
- **BETA writing rollback:** **10.19 — COLOR-ALIGNED MIX**
- **BETA baseline:** **10.17 — APK EXACT ROOMS**

## 10.20 BETA — FRIEND IDENTITY GUARD

10.19 potwierdziła działanie MIX 8/8. W 10.20 kod pisania jest więc traktowany jako zamrożony i ładowany dokładnie z builda 10.19.

10.20 skupia się wyłącznie na ścieżce:

`nick → UserData/UserCardData → userId → code 8/subcode 4 → code 85 → code 159 → rooms[]`

### Co wykazała analiza oryginalnego klienta

Oryginalna ikonka telefonu użytkownika mobilnego nie jest tekstem nicka. CZATeria tworzy ją jako osobny element:

`.m-list-user-item-icon-mobile`

Prawdziwy login pozostaje w osobnym `span`. Natywny ContextMenu również dla kliknięcia w ikonę telefonu pobiera login z wiersza użytkownika, a nie z samej ikonki.

Znaleziono natomiast błąd legacy SWIR: własna pozycja „Dodaj do znajomych” próbowała odczytać `innerText` nagłówka ContextMenu. Natywny nagłówek ma tekst `Menu`, więc ta ścieżka mogła zapisywać błędną nazwę zamiast prawdziwego loginu.

### Friend Identity Guard 10.20

Guard uruchamia się **przed** Friends Core i:

- tworzy jednorazowy backup starej listy znajomych i cache ID,
- usuwa z identyfikatora wyłącznie znane zanieczyszczenia: `📱`, `📲`, `☎`, variation selector, zero-width, NBSP oraz końcowy `:`,
- scala duplikaty tego samego nicka,
- czyści legacy wpis `Menu` powstały przez stary context-menu bug,
- normalizuje klucze `swir_friend_identity_cache_97`,
- zachowuje natywne `getUserWithName()` jako pierwszą metodę,
- jeśli dokładne wyszukiwanie zawiedzie, porównuje czysty login z rzeczywistymi obiektami `UserData` na aktywnym połączeniu,
- poprawia dodawanie/usuwanie znajomego z menu kontekstowego tak, aby używać nicka klikniętej osoby,
- ukrywa natywną ikonkę mobile wizualnie, ale nie usuwa ani nie zmienia `UserData.isMobile()`,
- nie modyfikuje protokołu 10.17 Friends Core.

Backup migracji jest przechowywany lokalnie pod kluczem:

`swir_friend_guard_backup_1020`

### Diagnostyka

```javascript
SWIR_FRIEND_GUARD1020?.diagnostics?.()
SWIR_FRIENDS_PRIMARY1017?.diagnostics?.()
SWIR_ROOMS_PANEL1017?.diagnostics?.()
```

W Guardzie warto sprawdzić:

- `friends` — liczba czystych lokalnych znajomych,
- `migrated` — ile starych wpisów/cache zostało poprawionych,
- `patchedConnections` — ile połączeń ma fallback canonical lookup,
- `connections` — liczba wykrytych połączeń,
- `nativePhoneIcons` / `hiddenPhoneIcons` — liczba natywnych ikonek mobile i liczba ukrytych.

## MIX 8/8 — zamrożony z 10.19

10.20 nie zmienia mechanizmu pisania. Nadal działa pełna talia:

1. normalne,
2. B,
3. I,
4. U,
5. B+I,
6. B+U,
7. I+U,
8. B+I+U.

MIX działa tą samą architekturą co Color Writing — wrapper jest instalowany na każdym aktywnym pokoju/privie.

Diagnostyka:

```javascript
SWIR_MIX1019?.diagnostics?.()
```

## Friend Radar — protokół bez zmian

10.20 nadal korzysta z potwierdzonego mechanizmu:

`code 8 / subcode 4 + userId + username + isFriend=true`

oraz:

`code 85 → code 159 → users[].rooms[]`

Guard naprawia jedynie identyfikację nicka przed tym mechanizmem.

## Launcher 4.4

- **STABLE** — bez zmian,
- **BETA 10.20** — Friend Identity Guard,
- **BETA 10.19** — potwierdzone działające pisanie / rollback,
- **BETA 10.18** — starszy rollback,
- **BETA 10.17** — czysta baza Friend Radar.

## Jak testować 10.20

1. Zrób **Ctrl+F5**.
2. XBookmark → **BETA → 10.20 BETA — FRIEND IDENTITY GUARD**.
3. Otwórz Znajomych i kliknij **ODŚWIEŻ**.
4. Sprawdź osobę, która wcześniej miała natywną ikonkę telefonu/mobile.
5. Dodaj jednego znajomego z menu kontekstowego i sprawdź, czy do panelu trafia właściwy nick.
6. Sprawdź kilka globalnych lokalizacji `rooms[]`.
7. Dla pewności sprawdź MIX — powinien zachowywać się dokładnie jak w 10.19.

---

**Aktualny układ: Launcher 4.4 • 10.17.2 STABLE • 10.20 BETA FRIEND IDENTITY GUARD • 10.19 writing rollback • 10.17 Friends baseline**
