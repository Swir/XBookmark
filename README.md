# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 5.1 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.27 — ACK ROUTE PIN**
- **BETA rollback:** 10.26 ACK Route Trace / 10.25 Snapshot Merge / 10.24 Snapshot Trace / 10.23 Queue Watch / 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.27 BETA — ACK ROUTE PIN

10.27 robi pierwszą odizolowaną poprawkę po diagnostyce 10.26. Rdzeń 10.22 po odebraniu ACK `8/4` przechodzi do `85 → 159`, ale jego `request85()` wybiera `primaryConn()`. Przy kilku pokojach oznacza to, że ACK może przyjść jednym socketem, a `85` zostać wysłane innym.

10.27 **nie zmienia timingów, kolejki ani formatu pakietów**. Dodaje wąski router: po świeżym ACK `8/4` kod `85` jest kierowany na dokładnie ten WebSocket, który dostarczył ACK. Jeśli ten socket jest już zamknięty albo ACK jest starszy niż 20 sekund, moduł nie wymusza trasy i pozostawia dotychczasowe zachowanie.

### Co pozostaje bez zmian

- ACK Core 10.22 i jego czasy `WAIT_ACK / ACKED / WAIT_159`,
- Queue Watch 10.23,
- Snapshot Trace 10.24,
- Snapshot Merge 10.25 z TTL 15 s,
- działający MIX 10.19,
- STABLE 10.17.2,
- brak Honour Probe.

## Flow znajomych

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 na tym samym socketcie → code 159 → rooms[]`

Hipoteza 10.27: część brakujących znajomych wynika z rozdzielenia etapów ACK i `85` pomiędzy różne aktywne połączenia/pokoje.

## Panel Znajomi — czysty

Główny branding pozostaje **SWIR MOD**. W panelu używane są proste nazwy typu **Znajomi**, **Pokoje**, **Odśwież**, **Dodaj**. Nie wracają badge'e APP/PC/SWIR/HONOUR ani techniczny nagłówek Friend Radar.

## MIX pisania — zamrożony

10.27 ładuje niezmieniony moduł MIX z 10.19. Mechanizm pisania nie jest częścią testu.

## Diagnostyka 10.27

```javascript
SWIR_ACK_ROUTE_PIN1027?.diagnostics?.()
SWIR_ACK_ROUTE_TRACE1026?.diagnostics?.()
SWIR_BETA1027?.diagnostics?.()
```

Najważniejsze pola:

- `routePin.pins` / `pins` — rzeczywiste przekierowania `85` na socket ACK,
- `routePin.fallbacks` / `fallbacks` — przypadki, gdy pin nie został użyty, bo ACK był stary lub socket zamknięty,
- `routePin.redirects` — liczba skorygowanych tras,
- `routeTrace.mismatches` — kontrola diagnostyczna z 10.26,
- `snapshot` / `merge` — diagnostyka 10.24/10.25,
- `friends` / `queue` — stan ACK Core i Queue Watch.

## Launcher 5.1

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.27** — ACK Route Pin,
- **BETA 10.26** — ACK Route Trace rollback,
- **BETA 10.25** — Snapshot Merge rollback,
- **BETA 10.24** — Snapshot Trace rollback,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.19** — działający MIX 8/8 rollback.

## Co sprawdzić rano

1. Zrób **Ctrl+F5**.
2. Otwórz launcher → **BETA → 10.27 BETA — ACK ROUTE PIN**.
3. Otwórz **Znajomi** i zostaw panel kilka minut bez ciągłego klikania Odśwież.
4. Testuj szczególnie przy kilku otwartych pokojach i kilku znajomych.
5. Sprawdź, czy wykrycie kolejnego znajomego przestało gubić poprzedniego i czy lokalizacje/pokoje są stabilniejsze.
6. Jeśli nadal któregoś znajomego nie wykryje, uruchom:

```javascript
SWIR_BETA1027?.diagnostics?.()
```

Jeżeli `routePin.redirects > 0`, ale problem nadal występuje, kolejny krok powinien skupić się nie na tempie skanowania, tylko na korelacji konkretnego aktywnego joba z odpowiadającym mu `159` oraz na tym, czy `159` z właściwego socketu rzeczywiście zawiera szukanego użytkownika.

---

**Aktualny układ: Launcher 5.1 • 10.17.2 STABLE • 10.27 BETA ACK ROUTE PIN • 10.26 Route Trace rollback • 10.25 Snapshot Merge rollback • 10.24 Snapshot Trace rollback • 10.23 Queue Watch rollback • 10.19 working MIX rollback**
