# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 3.3
- **BETA:** 10.15 — GLOBAL ROOMS
- **STABLE / recommended:** 9.9.2
- **10.14:** rollback Nick Integrity + Friends Core
- **10.12:** BROKEN / PAUSED
- **10.6:** zamrożona baza UI / nicków / pisania

## Cel 10.15 — GLOBAL ROOMS

Najważniejsza zasada tej wersji: status **mobile/APKA lub PC nie zmienia sposobu obsługi znajomego**.

Każdy lokalny znajomy z poznanym `userId` przechodzi tą samą normalną ścieżką protokołu:

`code 8 / subcode 4` → `code 85` → `code 159` → `rooms[]`

To właśnie `rooms[]` z odpowiedzi serwera jest źródłem globalnej lokalizacji znajomego.

### Dlaczego wcześniejsze wersje myliły sytuację

Oryginalny czat sam oznacza, czy użytkownik korzysta z aplikacji/mobile. To jest tylko informacja o kliencie użytkownika.

SWIR miał drugi, niezależny stan: czy dany nick znajduje się już na **serwerowej liście znajomych**. Jeśli nick był tylko lokalnym `SWIR`, Radar znał głównie pokoje, które nasz klient sam aktualnie widział. Dlatego osoba mobile mogła wyglądać tak, jakby znajdowała się wyłącznie w pokoju, w którym jesteśmy razem.

10.15 próbuje doprowadzić każdego znanego znajomego — również mobile — do potwierdzonego stanu serwerowego. Dopiero wtedy Radar korzysta z `159.rooms[]`.

### Ważne ograniczenie

SWIR pokazuje **dokładnie te pokoje, które serwer zwróci w `rooms[]`**. Nie używamy uprzywilejowanego `whereIsUser` i nie obchodzimy ograniczeń serwera. Jeśli serwer zwróci kilka pokoi — pokażemy wszystkie. Jeśli dla konkretnej osoby zwróci jeden — SWIR nie wymyśla pozostałych.

## Nick Integrity

10.15 zachowuje poprawkę z 10.14:

- natywny nick w rozmowie ma czysty tekst `Nick:`,
- brak SWIR-owych telefonów, emoji i badge wewnątrz elementu nicka,
- kolor może być poprawiany tylko CSS-em,
- kliknięcie nicka ma pozostać kompatybilne z oryginalnym klientem CZATerii.

## Jak testować

1. Wykonaj **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **BETA → 10.15 BETA — GLOBAL ROOMS**.
4. Otwórz panel Znajomi.
5. Sprawdź osoby oznaczone przez oryginalny czat jako mobile/APKA, które wcześniej były tylko `SWIR`.

Po synchronizacji powinny pojawić się w serwerowym stanie i Radar powinien używać ich `rooms[]`.

## Diagnostyka

```javascript
SWIR_FRIENDS_GLOBAL1015?.diagnostics?.()
SWIR_FRIENDS_GLOBAL1015?.jobs?.()
```

Dla konkretnego testu najważniejsze są pola `state`, `attempts` i `rooms`.

Ręczne uruchomienie synchronizacji wszystkich znanych lokalnych znajomych:

```javascript
SWIR_FRIENDS_GLOBAL1015?.syncAll?.()
```

## Kanały

| Wersja | Status | Opis |
|---|---|---|
| 10.15 | CURRENT BETA | Global Rooms: wszyscy znajomi, także mobile, przez 8/4 → 85 → 159 |
| 10.14 | ROLLBACK | Nick Integrity + Friends Core |
| 10.13 | ROLLBACK | Clean Recovery |
| 10.12 | BROKEN / PAUSED | regresja UI |
| 10.11 | ROLLBACK | UI Safe + Phone Clean |
| 10.10 | PAUSED | regresja klikalności MOD |
| 10.9 | ROLLBACK | Friends Clean |
| 10.6 | FROZEN | baza 10.15 |
| 9.9.2 | STABLE RECOMMENDED | sprawdzona wersja stabilna |

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów CZATerii. Globalne pokoje pochodzą wyłącznie z normalnego mechanizmu znajomych `85 → 159`.

---

**Aktualny układ: Launcher 3.3 • 10.15 BETA GLOBAL ROOMS • 9.9.2 STABLE RECOMMENDED**
