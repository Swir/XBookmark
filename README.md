# XBookmark — SWIR MOD

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 5.4
- **Rekomendowana wersja:** **10.29 STABLE**
- **Najnowsza BETA:** **10.28 — ACK ROUTE GUARD**
- Launcher pokazuje dokładnie **3 wersje STABLE** i **3 wersje BETA**.

## 10.29 STABLE — SYMBOL SAFE NICKS + ACK ROUTE GUARD

10.29 STABLE łączy poprawki identyfikacji nicków, Friend Radaru, routingu ACK oraz synchronizacji `rooms[]`.

### Naprawione nicki ze znakami specjalnymi

Dwukropek i pozostałe prawidłowe znaki są traktowane jako część loginu. Nick nie jest dzielony po pierwszym `:` i nie jest skracany podczas obsługi wiadomości, odpowiedzi ani listy Znajomych.

Przykłady:

```text
ABC:XYZ:  → ABC:XYZ
ABC::      → ABC:
ABC-XYZ:   → ABC-XYZ
```

Usuwany jest wyłącznie jeden końcowy dwukropek dodawany przez interfejs CZATerii jako separator loginu od wiadomości.

### Spójna tożsamość Friend Radaru

Pełny nick jest zachowywany w całym łańcuchu:

```text
dokładny nick → UserData → UID → 8/4 username → ACK → 85 → 159.name → rooms[]
```

Dotyczy to:

- lokalnej listy Znajomych,
- wyszukiwania `UserData`,
- cache UID,
- pola `username` pakietu `8/4`,
- przychodzącego ACK `8/4`,
- kluczy użytkowników w `159`,
- Snapshot Merge,
- panelu Znajomi.

### ACK Route Guard

Routing `code 85` korzysta ze świeżych ACK przypisanych do konkretnych socketów. Gdy istnieje dokładnie jeden właściwy kandydat, zapytanie jest kierowane na jego połączenie. Przy kilku równoczesnych kandydatach mechanizm nie zgaduje trasy.

### Snapshot Merge

Świeże odpowiedzi `159` są scalane per połączenie przez ograniczony czas. Zapobiega to sytuacji, w której częściowy snapshot z jednego socketu nadpisuje pełniejsze dane o znajomych z innego połączenia.

### Kolejka Friends

Synchronizacja znajomych działa sekwencyjnie z ograniczonym retry dla stanów `NO_ACK` oraz `ACK_NO_159`. Format pakietów i kolejność `8/4 → ACK → 85 → 159` pozostają kontrolowane przez aktualny Friends Core.

### Interfejs

Panel zachowuje prosty układ:

- **Znajomi**
- **Pokoje**
- **Odśwież**
- **Dodaj**

Główny branding pozostaje **SWIR MOD**. Dodatkowe techniczne oznaczenia APP/PC/SWIR/HONOUR nie są wyświetlane.

### Pisanie i motyw

10.29 STABLE zawiera:

- MIX 8/8,
- Color Writing,
- ICE dark text,
- ochronę natywnej struktury nicków.

## Wersje w Launcherze 5.4

### STABLE

1. **10.29 STABLE — RECOMMENDED** — symbol-safe nicki, ACK Route Guard, Snapshot Merge, Friends/rooms[], MIX 8/8.
2. **10.17.2 STABLE** — APK Exact Friends, MIX 8/8, ICE v2, ochrona natywnego kształtu nicków.
3. **10.17.1 STABLE** — APK Exact Rooms, MIX 8/8, przebudowane kolory ICE.

### BETA

1. **10.28 BETA — ACK ROUTE GUARD** — routing `85` oparty o świeże ACK per socket.
2. **10.27 BETA — ACK ROUTE PIN** — przypięcie `85` do socketu z ostatnim świeżym ACK.
3. **10.26 BETA — ACK ROUTE TRACE** — diagnostyka trasy `ACK 8/4 → 85` per połączenie.

## Diagnostyka 10.29

```javascript
SWIR_NICK_INTEGRITY1029?.diagnostics?.()
SWIR_FRIENDS_SYMBOL1029?.diagnostics?.()
SWIR_STABLE1029?.diagnostics?.()
```

Najważniejsze elementy diagnostyki obejmują pełne nicki, UID, stan kolejki, `rooms[]`, routing ACK oraz dane Snapshot Merge.

## Architektura 10.29

```text
10.6 UI base
  ↓
Symbol-Safe Nick Integrity
  ↓
Symbol-Safe Friends Core
  ↓
ACK Route Guard
  ↓
Bounded Friends Queue
  ↓
Per-connection 159 Snapshot Merge
  ↓
Clean Friends Panel
  ↓
MIX 8/8 + ICE dark text
```

---

**SWIR MOD • Launcher 5.4 • 10.29 STABLE • 10.28 / 10.27 / 10.26 BETA**
