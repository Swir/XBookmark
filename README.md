# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.9 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.25 — SNAPSHOT MERGE**
- **BETA rollback:** 10.24 Snapshot Trace / 10.23 Queue Watch / 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.25 BETA — SNAPSHOT MERGE

10.25 atakuje konkretny problem wykryty w architekturze 10.22: każdy przychodzący pakiet `159` był zapisywany jako jeden globalny `users`, więc późniejszy, mniejszy snapshot z innego socketu/pokoju mógł usunąć znajomego widzianego chwilę wcześniej na innym połączeniu.

Nowa beta **nie zmienia** protokołu ACK, kolejki ani timingów. Zamiast tego utrzymuje osobny ostatni snapshot `159` dla każdego połączenia i składa wynik tylko ze świeżych źródeł.

### Zasady merge

- każdy socket ma własny snapshot,
- snapshot jest ważny maksymalnie **15 sekund**,
- stare źródła są automatycznie usuwane,
- użytkownicy z aktywnych snapshotów są łączeni zamiast wzajemnie się kasować,
- `rooms[]` tego samego użytkownika są scalane,
- ID jest zachowywane z dostępnego świeżego źródła,
- 10.24 Snapshot Trace nadal działa równolegle jako diagnostyka.

To jest celowo ostrożny kompromis: merge ma zatrzymać znikanie znajomych po nadejściu częściowego `159`, ale TTL ogranicza ryzyko trzymania starego statusu z martwego połączenia.

## Flow znajomych — bez zmian

10.25 nadal używa dokładnie tego samego rdzenia 10.22:

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 → code 159 → rooms[]`

Queue Watch z 10.23 również pozostaje bez zmian. Nie przyspieszamy skanowania i nie dokładamy równoległych prób.

## Panel Znajomi — czysty

Główny branding pozostaje **SWIR MOD**. W panelu używane są proste nazwy typu **Znajomi**, **Pokoje**, **Odśwież**, **Dodaj**. Nie wracają badge'e APP/PC/SWIR/HONOUR ani techniczny nagłówek Friend Radar.

## MIX pisania — zamrożony

10.25 ładuje niezmieniony moduł MIX z 10.19. Mechanizm pisania nie jest częścią tego testu.

## Diagnostyka 10.25

```javascript
SWIR_SNAPSHOT_MERGE1025?.diagnostics?.()
SWIR_SNAPSHOT_TRACE1024?.diagnostics?.()
SWIR_BETA1025?.diagnostics?.()
```

Najważniejsze pola merge:

- `sources` — świeże snapshoty użyte do złożenia wyniku,
- `mergedCount` — liczba znajomych po scaleniu,
- `mergedUsers` — wynik z połączonym `rooms[]`,
- `decision` — czy merge rozszerzył, zmniejszył czy utrzymał snapshot,
- `trace.divergences` — różne `159` obserwowane na różnych połączeniach,
- `core` / `queue` — stan istniejącego ACK Core i Queue Watch.

## Launcher 4.9

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.25** — Snapshot Merge,
- **BETA 10.24** — Snapshot Trace rollback,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.20** — Identity Guard rollback,
- **BETA 10.19** — działający MIX 8/8 rollback,
- **BETA 10.18 / 10.17** — starsze porównawcze bety.

## Co sprawdzić rano

1. Zrób **Ctrl+F5**.
2. Otwórz launcher → **BETA → 10.25 BETA — SNAPSHOT MERGE**.
3. Otwórz **Znajomi** i zostaw panel przez kilka minut bez ciągłego klikania Odśwież.
4. Sprawdź przede wszystkim przypadek, w którym wcześniej jeden znajomy był widoczny, a po wykryciu drugiego pierwszy znikał.
5. Jeśli problem nadal wystąpi, uruchom:

```javascript
SWIR_SNAPSHOT_MERGE1025?.diagnostics?.()
```

Jeśli `sources` pokazuje kilka aktywnych połączeń, a `mergedUsers` nadal nie zawiera któregoś znajomego, następny krok powinien zejść niżej: sprawdzić, czy ten znajomy w ogóle trafia do któregokolwiek `159`, czy problem powstaje wcześniej na etapie ACK/UID/85.

---

**Aktualny układ: Launcher 4.9 • 10.17.2 STABLE • 10.25 BETA SNAPSHOT MERGE • 10.24 Snapshot Trace rollback • 10.23 Queue Watch rollback • 10.19 working MIX rollback**
