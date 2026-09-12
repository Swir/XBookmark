# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 5.2 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.28 — ACK ROUTE GUARD**
- **BETA rollback:** 10.27 ACK Route Pin / 10.26 ACK Route Trace / 10.25 Snapshot Merge / 10.24 Snapshot Trace / 10.23 Queue Watch / 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.28 BETA — ACK ROUTE GUARD

10.28 poprawia słaby punkt 10.27. Tam routing opierał się na jednym globalnym `lastAck`, więc przy kilku aktywnych WebSocketach ostatni odebrany ACK mógł pochodzić z innego połączenia niż aktualny job. W takim przypadku `85` mogło zostać przypięte do złego socketu.

10.28 przechowuje świeże ACK **per socket**. Gdy wychodzi `85`:

- jeśli źródłowy socket sam ma świeży ACK — pakiet zostaje na nim,
- jeśli istnieje dokładnie jeden świeży ACK na innym otwartym socketcie — `85` jest kierowane tam,
- jeśli istnieje kilka świeżych kandydatów — 10.28 **nie zgaduje** i zapisuje `ROUTE_AMBIGUOUS`, pozostawiając dotychczasową trasę,
- stare/zamknięte ACK są automatycznie wyrzucane po 12 s.

To jest celowo wąska poprawka: **bez zmian timingów, kolejki, formatów pakietów i Snapshot Merge**.

## Flow znajomych

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → per-socket route guard → code 85 → code 159 → rooms[]`

Hipoteza 10.28: część losowych braków wynikała nie tylko z użycia `primaryConn()`, ale również z tego, że globalny ostatni ACK nie był bezpieczny przy wielu socketach.

## Co pozostaje bez zmian

- ACK Core 10.22 i jego czasy `WAIT_ACK / ACKED / WAIT_159`,
- Queue Watch 10.23,
- Snapshot Trace 10.24,
- Snapshot Merge 10.25 z TTL 15 s,
- działający MIX 10.19,
- STABLE 10.17.2,
- brak Honour Probe.

## Panel Znajomi

Główny branding pozostaje **SWIR MOD**. Panel używa prostych nazw typu **Znajomi**, **Pokoje**, **Odśwież**, **Dodaj**. Bez APP/PC/SWIR/HONOUR i bez zbędnych technicznych badge'ów.

## Diagnostyka 10.28

```javascript
SWIR_ACK_ROUTE_GUARD1028?.diagnostics?.()
SWIR_ACK_ROUTE_TRACE1026?.diagnostics?.()
SWIR_BETA1028?.diagnostics?.()
```

Najważniejsze pola:

- `routeGuard.redirects` — liczba bezpiecznych przekierowań `85`,
- `routeGuard.passes` — `85` już wysyłane właściwym socketem,
- `routeGuard.ambiguous` — przypadki z kilkoma świeżymi ACK,
- `routeGuard.ambiguities` — szczegóły kandydatów i ich pokoje/nicki,
- `routeGuard.freshAcks` — aktualne ACK per socket,
- `routeTrace.mismatches` — niezależna kontrola diagnostyczna,
- `snapshot` / `merge` — zachowanie `159`,
- `friends` / `queue` — stan ACK Core i kolejki.

## Launcher 5.2

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.28** — ACK Route Guard,
- **BETA 10.27** — ACK Route Pin rollback,
- **BETA 10.26** — ACK Route Trace rollback,
- **BETA 10.25** — Snapshot Merge rollback,
- **BETA 10.24** — Snapshot Trace rollback,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.19** — działający MIX 8/8 rollback.

## Co sprawdzić rano

1. Zrób **Ctrl+F5**.
2. Otwórz launcher → **BETA → 10.28 BETA — ACK ROUTE GUARD**.
3. Otwórz **Znajomi** i zostaw panel kilka minut bez ciągłego klikania Odśwież.
4. Testuj przy kilku pokojach i kilku znajomych.
5. Sprawdź, czy znajomi nie znikają po wykryciu kolejnej osoby i czy pokoje pozostają stabilne.
6. Jeśli problem wystąpi, uruchom:

```javascript
SWIR_BETA1028?.diagnostics?.()
```

Jeśli `routeGuard.ambiguous > 0`, kolejny krok powinien powiązać ACK z konkretnym aktywnym jobem/nickiem zamiast wybierać wyłącznie po socketach. Jeśli routing jest czysty, a znajomy nadal znika, dalsza analiza powinna skupić się na korelacji konkretnego `159` z aktywnym jobem i właściwym połączeniem.

---

**Aktualny układ: Launcher 5.2 • 10.17.2 STABLE • 10.28 BETA ACK ROUTE GUARD • 10.27 Route Pin rollback • 10.26 Route Trace rollback • 10.25 Snapshot Merge rollback • 10.23 Queue Watch rollback • 10.19 working MIX rollback**
