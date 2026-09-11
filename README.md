# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.3 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.19 — COLOR-ALIGNED MIX**
- **BETA rollback:** 10.18
- **BETA baseline:** **10.17 APK EXACT ROOMS** — zamrożona wersja Friend Radaru potwierdzona jako działająca

## 10.19 BETA — dlaczego powstała

10.18 nadal nie zmieniała stylów MIX podczas realnego wysyłania. Analiza oryginalnego kodu CZATerii pokazała, że problem nie leżał w polach `bold / italic / underline`.

Natywny `Channel.sendMessage()` buduje pakiet z:

- `userMessageStyle.isBoldMsg()`,
- `userMessageStyle.isItalicMsg()`,
- `userMessageStyle.isUnderlineMsg()`.

Jednocześnie sprawdzone **Kolorowe pisanie** nie patchuje `CHNS.Channel.prototype.sendMessage`. Zamiast tego owija `sendMessage()` **na każdym istniejącym obiekcie pokoju/priva**. Ponieważ Color Writing robi to wcześniej, późniejsza zmiana prototypu mogła zostać całkowicie pominięta przez istniejące kanały.

### MIX 10.19

10.19 kopiuje architekturę działającego Color Writing:

1. pobiera aktualny kanał oraz wszystkie obiekty z `CHNS.channelManager.channels`,
2. owija `sendMessage()` bezpośrednio na każdym pokoju/privie,
3. przed wywołaniem istniejącego wrappera ustawia tymczasowo B/I/U,
4. istniejący Color Writing nadal może ustawić `msgColorId`,
5. natywny klient odczytuje jednocześnie kolor oraz B/I/U,
6. po synchronicznym wysłaniu poprzedni ręczny styl zostaje przywrócony.

MIX nadal wykorzystuje pełną losową talię 8/8:

- normalne,
- B,
- I,
- U,
- B+I,
- B+U,
- I+U,
- B+I+U.

Wszystkie osiem stylów jest używanych przed ponownym tasowaniem, bez powtórzenia tego samego stylu na granicy talii.

### Kolorowe pisanie — porządek w UI

W 10.19 zakładka **Kolorowe pisanie** zawiera tylko ustawienia koloru.

Stary blok **„Styl wiadomości”** z B/I/U jest ukryty. Style wiadomości należą teraz wyłącznie do zakładki **MIX pisania**. Blok jest ukrywany CSS-em zamiast ciągłego kasowania DOM, aby nie walczyć z obserwatorem legacy 10.6, który próbowałby go odtwarzać.

### Diagnostyka MIX 10.19

```javascript
SWIR_MIX1019?.diagnostics?.()
```

Najważniejsze pola:

- `enabled` — MIX włączony,
- `channels` — wykryte pokoje/privy,
- `wrapped` — ile kanałów ma realny wrapper 10.19,
- `next` — następny styl,
- `sendCount` — liczba wiadomości rzeczywiście wysłanych przez MIX.

Przy normalnej pracy `wrapped` powinno być równe `channels`, a `sendCount` powinien rosnąć po wysłaniu wiadomości.

## ICE

10.19 zachowuje poprawkę **ICE DARK TEXT** z 10.18:

- brak białych/prawie białych nicków,
- brak białego/prawie białego tekstu wiadomości,
- ciemne, czytelne mapowanie natywnych `data-col="0..11"`,
- pełne `opacity:1` i `visibility:visible` dla tekstu wiadomości i nicków.

Diagnostyka:

```javascript
SWIR_ICE1018?.audit?.()
```

Celem jest `whiteMessages: 0` i `whiteNicks: 0`.

## Friend Radar — bez zmian

10.19 nadal ładuje dokładnie zamrożony Friend Radar 10.17 z commita:

`627f38c79ca474f53b266c74fa2136c3f4df7c76`

Mechanizm Znajomych nie został zmieniony.

## Launcher 4.3

- **STABLE** — bez zmian,
- **BETA 10.19** — bieżący test MIX,
- **BETA 10.18** — rollback,
- **BETA 10.17** — czysta baza Friend Radar do porównania.

## Jak testować 10.19

1. **Ctrl+F5** na CZATerii.
2. XBookmark → **BETA → 10.19 BETA — COLOR-ALIGNED MIX**.
3. Otwórz **Kolorowe pisanie** — blok „Styl wiadomości” nie powinien być widoczny.
4. Ustaw np. tryb kolorów Rainbow albo Random.
5. Otwórz **MIX pisania**, włącz MIX 8/8.
6. Wyślij kilka zwykłych wiadomości. Kolor i B/I/U powinny działać jednocześnie.
7. Sprawdź `SWIR_MIX1019.diagnostics()` — `wrapped === channels`, a `sendCount` powinien rosnąć.
8. Sprawdź Znajomych — powinny działać identycznie jak w 10.17 Beta.

---

**Aktualny układ: Launcher 4.3 • 10.17.2 STABLE • 10.19 BETA COLOR-ALIGNED MIX • 10.18 rollback • 10.17 baseline**
