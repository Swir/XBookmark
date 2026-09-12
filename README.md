# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 5.0 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.26 — ACK ROUTE TRACE**
- **BETA rollback:** 10.25 Snapshot Merge / 10.24 Snapshot Trace / 10.23 Queue Watch / 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.26 BETA — ACK ROUTE TRACE

10.26 schodzi krok niżej niż Snapshot Merge. Rdzeń 10.22 po odebraniu ACK `8/4` nie wiąże jawnie późniejszego `85` z socketem, który ten ACK dostarczył. `85` jest wysyłane przez wybór `primaryConn()`. Przy wielu pokojach może to prowadzić do sytuacji, w której ACK przychodzi z jednego połączenia, a odpytywanie `85 → 159` idzie innym socketem.

Ta beta **nie zmienia jeszcze routingu ani timingów**. Jest celowo diagnostyczna: zapisuje źródło każdego ACK `8/4`, następne wychodzące `85` i oznacza `ROUTE_MISMATCH`, gdy oba zdarzenia dotyczą różnych socketów.

### Co mierzymy

- socket i pokój, z którego przyszedł ACK `8/4`,
- socket i pokój, którym wysłano kolejne `85`,
- odstęp czasu między ACK i `85`,
- zgodność `sameAsAck`,
- przypadki `ROUTE_MISMATCH`.

10.25 Snapshot Merge pozostaje aktywny, więc częściowe `159` nadal nie powinny kasować świeżych danych z innych połączeń. Queue Watch 10.23 i ACK Core 10.22 pozostają bez zmiany timingów.

## Flow znajomych

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 → code 159 → rooms[]`

Hipoteza 10.26: problem może występować **pomiędzy ACK i 85**, gdy oba etapy nie są wykonywane na tym samym połączeniu.

## Panel Znajomi — czysty

Główny branding pozostaje **SWIR MOD**. W panelu używane są proste nazwy typu **Znajomi**, **Pokoje**, **Odśwież**, **Dodaj**. Nie wracają badge'e APP/PC/SWIR/HONOUR ani techniczny nagłówek Friend Radar.

## MIX pisania — zamrożony

10.26 ładuje niezmieniony moduł MIX z 10.19. Mechanizm pisania nie jest częścią testu.

## Diagnostyka 10.26

```javascript
SWIR_ACK_ROUTE_TRACE1026?.diagnostics?.()
SWIR_BETA1026?.diagnostics?.()
```

Najważniejsze pola:

- `mismatches` — ACK i późniejsze `85` na różnych socketach,
- `recent85` — ostatnie wysłania `85` z informacją `sameAsAck`,
- `lastAck` — ostatni ACK wraz z pokojem/socketem,
- `snapshot` / `merge` — diagnostyka 10.24/10.25,
- `friends` / `queue` — stan ACK Core i Queue Watch.

## Launcher 5.0

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.26** — ACK Route Trace,
- **BETA 10.25** — Snapshot Merge rollback,
- **BETA 10.24** — Snapshot Trace rollback,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.19** — działający MIX 8/8 rollback.

## Co sprawdzić rano

1. Zrób **Ctrl+F5**.
2. Otwórz launcher → **BETA → 10.26 BETA — ACK ROUTE TRACE**.
3. Otwórz **Znajomi** i zostaw panel kilka minut bez ciągłego klikania Odśwież.
4. Testuj szczególnie przy kilku otwartych pokojach i kilku znajomych.
5. Jeśli znowu jednego znajomego wykryje, a drugiego nie, uruchom:

```javascript
SWIR_ACK_ROUTE_TRACE1026?.diagnostics?.()
```

Jeśli `mismatches` nie jest puste, następna beta powinna już zrobić odizolowaną zmianę routingu: zapamiętać `ackConnection` dla aktywnego joba i wysłać `85` dokładnie tym samym połączeniem zamiast przez ogólne `primaryConn()`.

---

**Aktualny układ: Launcher 5.0 • 10.17.2 STABLE • 10.26 BETA ACK ROUTE TRACE • 10.25 Snapshot Merge rollback • 10.24 Snapshot Trace rollback • 10.23 Queue Watch rollback • 10.19 working MIX rollback**
