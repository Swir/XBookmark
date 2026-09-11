# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.7 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.23 — QUEUE WATCH**
- **BETA rollback:** 10.22 Friend ACK Sync
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **BETA baseline:** 10.17 APK Exact Rooms
- **Honour Probe:** usunięty i nie jest ładowany

## 10.23 BETA — QUEUE WATCH

10.23 nie zmienia formatu pakietów i nie przebudowuje działającego flow 10.22. Zamiast kolejnej dużej zmiany protokołu dodaje izolowany scheduler i diagnostykę, żeby rozdzielić dwie możliwe przyczyny problemu „jednego znajomego widzi, drugiego nie”.

### Hipoteza A — kolejka zatrzymuje część znajomych

10.22 ma jeden aktywny job naraz. Po stanie `NO_ACK` albo `ACK_NO_159` dany znajomy nie jest już automatycznie podejmowany ponownie, dopóki użytkownik ręcznie nie odświeży/synchronizuje listy.

10.23 dodaje bezpieczny **Queue Watch**:

- nie przerywa aktywnych stanów `WAIT_ACK`, `ACKED`, `WAIT_159`,
- retry wykonuje tylko dla terminalnych `NO_ACK` i `ACK_NO_159`,
- zawsze tylko jeden znajomy naraz,
- maksymalnie 2 dodatkowe cykle na znajomego,
- `NO_ACK`: cooldown 30 s,
- `ACK_NO_159`: cooldown 18 s,
- przy nierozwiązanych jobach może wykonać niskoczęstotliwościowe odświeżenie `85` co najmniej co 15 s.

Nie ma agresywnego skanowania ani spamu żądaniami.

### Hipoteza B — snapshot 159 jest nadpisywany

10.22 nasłuchuje pakietów `159` na otwartych połączeniach. Jeśli różne połączenia zwracają różne zestawy `users[]`, późniejszy snapshot może zmniejszyć aktualny stan i sprawiać wrażenie, że wcześniej wykryty znajomy „zniknął”.

10.23 jeszcze nie zmienia tego zachowania na ślepo. Zamiast tego zapisuje każde wykryte zmniejszenie `serverFriends` jako **snapshot-drop** z czasem, połączeniem i aktywnym jobem. To pozwoli po teście stwierdzić, czy kolejna wersja powinna przejść na snapshot per-connection / expected-primary zamiast globalnego replace.

## Panel Znajomi — uproszczony

Zgodnie z założeniem branding jest teraz spokojniejszy. Główny branding to **SWIR MOD**, a panel znajomych używa prostych nazw:

- **Znajomi**,
- **Odśwież**,
- **Dodaj**,
- nick,
- lokalizacja/pokoje.

Usunięte są zbędne etykiety `APP`, `PC`, `SWIR`, `HONOUR` oraz techniczny nagłówek „FRIEND RADAR — POKOJE”. Logika danych pozostaje oddzielona od wyglądu.

## Flow znajomych — bez zmian względem 10.22

10.23 nadal używa:

`UID → send 8/4 → WAIT_ACK → incoming ACK 8/4 → code 85 → code 159 → rooms[]`

Najważniejsze stany:

- `WAIT_ACK` — czekamy na serwerowe potwierdzenie 8/4,
- `ACKED` — backend potwierdził relację,
- `WAIT_159` — pobierany snapshot znajomych,
- `CONFIRMED` — użytkownik jest w świeżym 159,
- `NO_ACK` — brak potwierdzenia,
- `ACK_NO_159` — relacja potwierdzona, ale brak wpisu w 159,
- `WAIT_ID` — brak aktualnego UID,
- `ID_CONFLICT` — różne UID, brak ryzykownego żądania.

## MIX pisania — zamrożony

10.23 ładuje niezmieniony moduł MIX z 10.19. Nie dotykamy mechanizmu pisania podczas testów Friend Radaru.

MIX nadal używa pełnej talii 8/8:

1. normalne,
2. B,
3. I,
4. U,
5. B+I,
6. B+U,
7. I+U,
8. B+I+U.

## Diagnostyka 10.23

```javascript
SWIR_FRIENDS_ACK1022?.diagnostics?.()
SWIR_QUEUE1023?.diagnostics?.()
SWIR_ROOMS_PANEL1023?.diagnostics?.()
SWIR_BETA1023?.diagnostics?.()
```

Najważniejsze pola w `SWIR_QUEUE1023.diagnostics()`:

- `decision` — co scheduler robi teraz,
- `retries` — licznik i cooldown retry per nick,
- `snapshotDrops` — wykryte spadki liczby znajomych w świeżych snapshotach 159,
- `history` — ostatnie decyzje schedulera.

## Launcher 4.7

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.23** — Queue Watch + czysty panel Znajomi,
- **BETA 10.22** — bezpośredni rollback ACK Sync,
- **BETA 10.20** — Identity Guard rollback,
- **BETA 10.19** — działający MIX 8/8 rollback,
- **BETA 10.18** — starszy rollback,
- **BETA 10.17** — czysta baza Friend Radar.

## Co sprawdzić w 10.23

1. Zrób **Ctrl+F5** na CZATerii.
2. XBookmark → **BETA → 10.23 BETA — QUEUE WATCH**.
3. Otwórz **Znajomi**.
4. Zostaw panel przez kilka minut bez ciągłego klikania Odśwież.
5. Sprawdź, czy znajomi wcześniej pomijani pojawiają się po automatycznym retry.
6. Jeżeli jeden pojawia się, a drugi znika, uruchom w konsoli:

```javascript
SWIR_QUEUE1023?.diagnostics?.()
```

Jeżeli `snapshotDrops` nie jest pusty, następny krok to izolacja `159` do właściwego połączenia zamiast dalszego przyspieszania skanowania.

---

**Aktualny układ: Launcher 4.7 • 10.17.2 STABLE • 10.23 BETA QUEUE WATCH • 10.22 ACK rollback • 10.19 working MIX rollback**
