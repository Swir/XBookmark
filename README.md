# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.2 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.18 — MIX FIX + ICE DARK TEXT**
- **BETA baseline:** **10.17 APK EXACT ROOMS** — zamrożona wersja potwierdzona jako działająca
- Friend Radar 10.18 korzysta dokładnie z tego samego zamrożonego core 10.17.

## 10.18 BETA

Ta wersja służy wyłącznie do testowania dwóch poprawek. Kod Friend Radaru nie jest modyfikowany.

### MIX 8/8 — single hook

Stary moduł Writing 10.6 posiada własny instalator `sendMessage()`. Poprzednia nakładka MIX mogła zostać ponownie owinięta przez legacy hook i oba mechanizmy zaczynały ze sobą konkurować.

10.18:

- wyłącza legacy MIX 10.6,
- instaluje jeden nadrzędny hook `sendMessage`,
- oznacza go również jako zgodny z `__swirMix106`, dzięki czemu stary instalator nie owija go ponownie,
- używa wszystkich 8 natywnych kombinacji B / I / U:
  1. normalne,
  2. B,
  3. I,
  4. U,
  5. B+I,
  6. B+U,
  7. I+U,
  8. B+I+U,
- wszystkie 8 kombinacji występuje przed ponownym tasowaniem,
- ręczny styl jest przywracany po wysłaniu wiadomości.

Diagnostyka MIX:

```javascript
SWIR_MIX1018?.diagnostics?.()
```

Pole `hooked` powinno mieć wartość `true`. `sendCount` zwiększa się po wiadomościach wysłanych z aktywnym MIX-em.

### ICE — DARK TEXT

10.18 korzysta z prawdziwego elementu wiadomości CZATerii `.m-msg-item-user-message` i natywnego `data-col="0..11"`.

Zasada motywu Ice w tej becie:

- **brak białego lub prawie białego tekstu wiadomości**,
- **brak białych lub prawie białych nicków**,
- 12 kolorów wiadomości jest mapowanych na ciemne, kontrastowe kolory,
- dzieci wiadomości dziedziczą kolor rodzica zamiast wracać do bieli,
- nicki dostają ciemną paletę wyłącznie wizualnie; tekst i struktura nicka nie są zmieniane,
- po wyjściu z Ice poprzedni kolor nicka jest przywracany,
- listy użytkowników, pola tekstowe i panel MOD mają kontrast odpowiedni do jasnego tła.

Diagnostyka Ice:

```javascript
SWIR_ICE1018?.audit?.()
```

Najważniejsze pola to `whiteMessages` oraz `whiteNicks` — celem jest `0` i `0`.

## Friend Radar — bez zmian

10.18 ładuje dokładnie zamrożony, potwierdzony stan:

`627f38c79ca474f53b266c74fa2136c3f4df7c76`

Mechanizm pozostaje:

`code 8 / subcode 4 + userId + username + isFriend=true`

oraz:

`code 85 → code 159 → users[].rooms[]`

## Launcher 4.2

Launcher ma dwie zakładki:

- **STABLE** — 10.17.2 Recommended + rollbacki,
- **BETA** — 10.18 MIX FIX + ICE DARK TEXT oraz czysta 10.17 APK EXACT ROOMS do porównania.

## Jak testować 10.18

1. Zrób **Ctrl+F5** na CZATerii.
2. Uruchom XBookmark.
3. Wybierz **BETA → 10.18 BETA — MIX FIX + ICE DARK TEXT**.
4. Otwórz MIX, włącz go i wyślij kilka wiadomości — powinny zmieniać B/I/U według talii 8/8.
5. Włącz **Ice Light** i sprawdź nicki oraz tekst wiadomości — nie powinien być biały.
6. Sprawdź Znajomych — mają działać identycznie jak w czystej 10.17 Beta.

Jeżeli chcesz porównać sam Friend Radar bez nakładek, wybierz **BETA → 10.17 BETA — APK EXACT ROOMS**.

---

**Aktualny układ: Launcher 4.2 • 10.17.2 STABLE • 10.18 BETA MIX FIX + ICE DARK TEXT • 10.17 BETA baseline**
