# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 3.2
- **BETA:** 10.14 — NICK INTEGRITY + FRIENDS CORE
- **STABLE / recommended:** 9.9.2
- **10.13:** rollback CLEAN RECOVERY
- **10.12:** BROKEN / PAUSED
- **10.6:** zamrożona baza UI / nicków / pisania
- **10.0:** zamrożony punkt odniesienia dla Znajomych

## Co naprawia 10.14

### Nick Integrity

CZATeria rozpoznaje nick z wiadomości bardzo restrykcyjnie. Oryginalny klient oczekuje elementu z dokładną klasą `m-msg-item-user-login` i tekstem w postaci `Nick:`. Dodatkowe dzieci, badge lub emoji mogą zepsuć rozpoznanie i wywołać komunikat, że użytkownik opuścił pokój.

10.14 przed kliknięciem i prawym kliknięciem normalizuje nick do natywnej postaci:

- dokładna klasa `m-msg-item-user-login`,
- czysty tekst `Nick: `,
- brak SWIR-owych emoji, telefonów i badge wewnątrz nicka,
- kolor nicka może być poprawiany wyłącznie przez CSS — bez zmiany tekstu i struktury DOM.

### Friends Core

10.14 nie przebudowuje panelu Znajomych i nie dodaje do niego żadnych nowych statusów ani ikon. Naprawa działa w tle:

- używa tylko połączeń z otwartym WebSocketem,
- synchronizacja działa jako `code 8 / subcode 4`,
- stan APP jest odświeżany przez `code 85`,
- potwierdzenie następuje dopiero po `code 159`,
- niepotwierdzone operacje są ponawiane maksymalnie kilka razy,
- panel Friend Radar pozostaje wizualnie taki sam jak w bazie 10.6.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj linię `javascript:...` do adresu zakładki w Chrome/Edge.
3. Wejdź na CZATerię i wykonaj pełne odświeżenie strony.
4. Kliknij zakładkę XBookmark.
5. Wybierz **BETA → 10.14 BETA — NICK INTEGRITY + FRIENDS CORE**.

Przy przechodzeniu z wcześniejszej bety wykonaj **Ctrl+F5**, aby stare timery i skrypty nie pozostały w pamięci strony.

## Kanały

| Wersja | Status | Opis |
|---|---|---|
| 10.14 | CURRENT BETA | Nick Integrity + Friends Core |
| 10.13 | ROLLBACK | Clean Recovery |
| 10.12 | BROKEN / PAUSED | mruganie i regresja panelu Znajomych |
| 10.11 | ROLLBACK | UI Safe + Phone Clean |
| 10.10 | PAUSED | regresja klikalności MOD |
| 10.9 | ROLLBACK | Friends Clean control |
| 10.6 | FROZEN | baza 10.14 |
| 10.0 | FROZEN | punkt odniesienia Friends |
| 9.9.2 | STABLE RECOMMENDED | sprawdzona wersja stabilna |

## Diagnostyka 10.14

Nicki:

```javascript
SWIR_NICK_INTEGRITY1014?.diagnostics?.()
```

Pole `badNativeShape` powinno wynosić `0`.

Znajomi:

```javascript
SWIR_FRIENDS_CORE1014?.diagnostics?.()
SWIR_FRIENDS_CORE1014?.jobs?.()
```

Ręczna synchronizacja znanych znajomych PC/SWIR:

```javascript
SWIR_FRIENDS_CORE1014?.syncMissing?.()
```

## Zamrożone referencje

- 10.13: `2ffa29ee9d5a52484a3b938103728a013e2d774c`
- 10.12: `237754b0149bccf8d12c46526c4a74b234c27170`
- 10.6: `9f6124e32f6a50520f4e9da6c7d504b4dc91d163`
- 10.0: `0ed4f9710a435444b8299a03cf6181785c3c66e6`
- 9.9.2: `c16d6ec57b9063cd9c731f501e5c0cc14adb5c60`

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów CZATerii.

---

**Aktualny układ: Launcher 3.2 • 10.14 BETA • 9.9.2 STABLE RECOMMENDED**
