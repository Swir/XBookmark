# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR MOD dla CZATerii**.

## Aktualny stan

- **Launcher:** 5.3 — STABLE + BETA
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.29 — SYMBOL SAFE NICKS**
- **BETA immediate rollback:** **10.28 — ACK ROUTE GUARD**
- **BETA writing rollback:** **10.19 — potwierdzony działający MIX 8/8**
- **Honour Probe:** usunięty i nie jest ładowany

## 10.29 BETA — SYMBOL SAFE NICKS

10.28 została zgłoszona jako ogólnie działająca, ale test ujawnił ważny błąd tożsamości użytkownika: nick zawierający `:` mógł być ucinany w wiadomości, przestać działać po kliknięciu/odpowiedzi i potencjalnie nie zgadzać się z wpisem używanym przez Friend Radar.

### Znaleziona przyczyna

Stary Nick Integrity odczytywał tekst loginu z wiadomości i wykonywał logikę równoważną:

```javascript
const pos = raw.indexOf(':');
if (pos >= 0) raw = raw.slice(0, pos);
```

To było błędne założenie. Dla prawdziwego nicka:

```text
ABC:XYZ
```

SWIR potrafił uznać, że login to tylko:

```text
ABC
```

Dodatkowo starsze warstwy Friends Core, panelu Znajomych i Snapshot Merge usuwały końcowy `:` podczas normalizacji. Oznaczało to, że nick kończący się dwukropkiem również mógł być traktowany jako inna osoba.

### Zasada 10.29

**Znaki nicka są częścią tożsamości.**

10.29 nie usuwa z loginu `:`, `.`, `-`, nawiasów ani innych prawidłowych znaków interpunkcyjnych. Normalizowane są wyłącznie rzeczy, które nie są loginem, takie jak znane znaczniki telefonu i niewidzialne znaki techniczne.

W wiadomości CZATeria renderuje login jako:

```text
DOKŁADNY_NICK + ": "
```

Dlatego Nick Integrity 10.29 usuwa podczas odczytu DOM **wyłącznie jeden ostatni dwukropek będący separatorem interfejsu**. Nie dzieli tekstu po pierwszym dwukropku.

Przykłady:

- `ABC:XYZ: ` → nick `ABC:XYZ`
- `ABC:: ` → nick `ABC:`
- `ABC-XYZ: ` → nick `ABC-XYZ`

### Friends / lokalizacja

Ta sama zasada obowiązuje od początku do końca Friend Radaru:

`dokładny nick → UserData → UID → 8/4 username → ACK → 85 → 159.name → rooms[]`

10.29 zachowuje pełny nick w:

- lokalnej liście Znajomych,
- wyszukiwaniu `UserData`,
- cache UID,
- polu `username` pakietu `8/4`,
- przychodzącym ACK `8/4`,
- kluczach użytkowników z `159`,
- Snapshot Merge,
- panelu Znajomi.

Symbol-safe Friends Core zachowuje również blokadę starych pakietów Friend Radaru z bazowego 9.7/10.6, aby dawny timer nie wysyłał równolegle własnego `8/4` lub `85`.

## Co 10.29 zachowuje z 10.28

Mechanika routingu, nad którą pracowaliśmy wcześniej, pozostaje:

`UID → 8/4 → ACK 8/4 → ACK Route Guard → 85 → 159 → rooms[]`

Pozostają również:

- bounded Queue Watch,
- śledzenie wielu połączeń,
- świeży merge `159` per połączenie z TTL 15 s,
- per-socket ACK Route Guard 10.28,
- prosty panel **Znajomi / Odśwież / Dodaj**,
- działający MIX 8/8 z 10.19,
- ICE dark text,
- brak Honour Probe.

## Diagnostyka 10.29

```javascript
SWIR_NICK_INTEGRITY1029?.diagnostics?.()
SWIR_FRIENDS_SYMBOL1029?.diagnostics?.()
SWIR_BETA1029?.diagnostics?.()
```

`SWIR_NICK_INTEGRITY1029.diagnostics()` pokazuje m.in. liczbę nicków zawierających `:`. Friends diagnostics pokazuje `symbolFriends`, pełne nicki, UID, stan kolejki oraz rooms[].

## Jak testować 10.29

1. Zrób **Ctrl+F5**.
2. XBookmark → **BETA → 10.29 BETA — SYMBOL SAFE NICKS**.
3. Znajdź osobę z `:` w środku lub na końcu nicka.
4. Sprawdź, czy przy wiadomości widać **cały nick**.
5. Kliknij nick i sprawdź odpowiedź / natywne menu.
6. Dodaj tę osobę do **Znajomych** pełnym nickiem.
7. Kliknij **Odśwież** i sprawdź jej pokoje.
8. Jeżeli masz możliwość, sprawdź też nick z innym nietypowym znakiem.

Jeśli znajomy z takim nickiem został dodany w starej wersji już po ucięciu nazwy, usuń ten błędny wpis i dodaj go ponownie w 10.29 — utraconego fragmentu nicka nie da się pewnie odtworzyć z samego starego wpisu.

## Launcher 5.3

- **STABLE 10.17.2** — bez zmian,
- **BETA 10.29** — Symbol Safe Nicks,
- **BETA 10.28** — ACK Route Guard / immediate rollback,
- **BETA 10.27** — ACK Route Pin rollback,
- **BETA 10.26** — ACK Route Trace rollback,
- **BETA 10.25** — Snapshot Merge rollback,
- **BETA 10.24** — Snapshot Trace rollback,
- **BETA 10.23** — Queue Watch rollback,
- **BETA 10.22** — ACK Sync rollback,
- **BETA 10.19** — working MIX 8/8 rollback.

---

**Aktualny układ: Launcher 5.3 • 10.17.2 STABLE • 10.29 BETA SYMBOL SAFE NICKS • 10.28 immediate rollback • 10.19 working MIX rollback**
