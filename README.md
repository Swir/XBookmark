# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.8 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.24 — SNAPSHOT TRACE**
- **BETA rollback:** 10.23 Queue Watch / 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.24 BETA — SNAPSHOT TRACE

10.24 jest celowo diagnostyczna. Nie przyspiesza skanowania i nie zmienia jeszcze sposobu zapisu `159` w rdzeniu 10.22. Zachowuje Queue Watch z 10.23, ale dodaje dokładny ślad każdego przychodzącego pakietu `159` osobno dla połączenia.

### Co mierzy 10.24

Dla każdego `159` zapisuje:

- identyfikator połączenia,
- pokój i `channelId`,
- liczbę użytkowników w `users[]`,
- listę nicków,
- fingerprint całego snapshotu,
- czas nadejścia.

Jeżeli dwa różne połączenia w odstępie do 12 sekund zwrócą różne snapshoty, zdarzenie trafia do `divergences`.

To testuje hipotezę, że problem „jednego znajomego widzi, drugiego nie” nie wynika wyłącznie z szybkości kolejki, tylko z tego, że różne sockety/pokoje mogą zwracać różne `159`, a rdzeń 10.22 zapisuje ostatni snapshot globalnie.

## Flow znajomych — bez zmian

10.24 nadal używa:

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 → code 159 → rooms[]`

Queue Watch z 10.23 również pozostaje bez zmian. Nie ruszamy jeszcze arbitrażu snapshotów, dopóki diagnostyka nie pokaże, że różne połączenia faktycznie zwracają różne zestawy.

## Panel Znajomi — czysty

Główny branding pozostaje **SWIR MOD**. W panelu używane są proste nazwy typu **Znajomi**, **Pokoje**, **Odśwież**, **Dodaj**. Nie wracają badge'e APP/PC/SWIR/HONOUR ani techniczny nagłówek Friend Radar.

## MIX pisania — zamrożony

10.24 ładuje niezmieniony moduł MIX z 10.19. Mechanizm pisania nie jest częścią tego testu.

## Diagnostyka 10.24

```javascript
SWIR_SNAPSHOT_TRACE1024?.diagnostics?.()
SWIR_BETA1024?.diagnostics?.()
```

Najważniejsze pola:

- `connections` — wszystkie aktualnie wykryte połączenia,
- `events` — ostatnie snapshoty `159`,
- `divergences` — różne snapshoty z różnych połączeń w krótkim odstępie,
- `core` — diagnostyka 10.22,
- `queue` — diagnostyka 10.23.

## Launcher 4.8

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.24** — Snapshot Trace,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.20** — Identity Guard rollback,
- **BETA 10.19** — działający MIX 8/8 rollback,
- **BETA 10.18 / 10.17** — starsze porównawcze bety.

## Co sprawdzić rano

1. Zrób **Ctrl+F5**.
2. Otwórz launcher → **BETA → 10.24 BETA — SNAPSHOT TRACE**.
3. Otwórz **Znajomi** i zostaw panel przez kilka minut bez ciągłego klikania Odśwież.
4. Jeżeli jeden znajomy pojawi się, a drugi zniknie, uruchom:

```javascript
SWIR_SNAPSHOT_TRACE1024?.diagnostics?.()
```

Jeżeli `divergences` zawiera wpisy, kolejna sensowna beta powinna przejść z globalnego replace `159` na kontrolowany snapshot właściwego/oczekiwanego połączenia albo merge per-connection. Jeśli `divergences` pozostaje puste, następny krok powinien wrócić do analizy samej kolejki ACK/85/159.

---

**Aktualny układ: Launcher 4.8 • 10.17.2 STABLE • 10.24 BETA SNAPSHOT TRACE • 10.23 Queue Watch rollback • 10.19 working MIX rollback**
