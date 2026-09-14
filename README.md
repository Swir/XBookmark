# XBookmark — SWIR MOD

XBookmark to bookmarklet uruchamiający **SWIR MOD** na stronie CZATeria. Projekt dodaje własny launcher wersji oraz dodatkowe funkcje do interfejsu czatu bez instalowania rozszerzenia przeglądarki.

Aktualny kanał główny:

- **Launcher:** 5.4
- **Rekomendowany Stable:** 10.29
- **Najnowsza Beta w launcherze:** 10.28
- Launcher pokazuje zawsze **3 ostatnie wersje Stable** i **3 ostatnie wersje Beta**.

## Do czego służy XBookmark

Po uruchomieniu bookmarkletu na CZATerii ładowany jest launcher SWIR MOD. Z niego możesz wybrać wersję Stable lub Beta.

Najważniejsze elementy obecnej wersji obejmują:

- własny launcher Stable / Beta,
- panel znajomych i wykrywanie pokojów, w których aktualnie znajdują się znajomi,
- bezpieczniejsze rozpoznawanie nicków zawierających znaki specjalne,
- obsługę odpowiedzi po nicku,
- mechanizmy synchronizacji listy znajomych i pokojów,
- MIX stylów pisania,
- motyw ICE,
- diagnostykę połączeń i mechanizmy ACK / snapshot wykorzystywane przez nowsze wersje.

Projekt działa wyłącznie jako modyfikacja interfejsu strony po stronie przeglądarki. Nie wymaga instalowania osobnego programu.

## Bookmarklet — kod do zakładki

Skopiuj **cały kod poniżej w jednej linii** i wklej go jako adres URL zakładki:

```javascript
javascript:(async()=>{if(!/(^|\.)czateria\.interia\.pl$/i.test(location.hostname)){alert('SWIR: otworz CZATerie');return}const add=(u,f)=>{const s=document.createElement('script');s.src=u;s.onerror=f||(()=>alert('SWIR: blad pobierania'));document.head.appendChild(s)};const safe=()=>add('https://cdn.jsdelivr.net/gh/Swir/XBookmark@8ef1a5773f98780094c65042c2e622852ea6eb29/swir.js?v='+Date.now(),()=>alert('SWIR: nie udalo sie uruchomic nawet 9.9 SAFE FALLBACK'));try{const r=await fetch('https://api.github.com/repos/Swir/XBookmark/commits/main?x='+Date.now(),{cache:'no-store'}),j=await r.json(),h=j.sha;if(!h)throw Error('brak SHA');add('https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+h+'/swir.js?v='+Date.now(),safe)}catch(e){safe()}})()
```

## Jak uruchomić

### Chrome / Edge / Chromium

1. Otwórz menedżer zakładek albo pasek zakładek.
2. Dodaj nową zakładkę.
3. Nazwij ją np. **SWIR MOD**.
4. W polu **URL / Adres** wklej cały kod bookmarkletu z sekcji wyżej.
5. Zapisz zakładkę.
6. Wejdź na **CZATeria Interia** i zaloguj się do czatu.
7. Kliknij zakładkę **SWIR MOD**.
8. Pojawi się launcher, z którego wybierasz wersję Stable lub Beta.

> Ważne: bookmarklet uruchamiaj dopiero po wejściu na CZATerię. Jeśli klikniesz go na innej stronie, pojawi się komunikat `SWIR: otworz CZATerie`.

## Stable i Beta

### Stable

Kanał Stable jest przeznaczony do normalnego używania. Obecnie rekomendowana jest wersja **10.29 STABLE**.

10.29 zawiera m.in.:

- symbol-safe nickname identity,
- ACK-aware Friends flow,
- bounded friend queue,
- per-connection snapshot merge,
- per-socket ACK Route Guard,
- czysty panel znajomych,
- MIX 8/8,
- ICE z ciemnym tekstem.

### Beta

Kanał Beta służy do testowania nowszych zmian przed przeniesieniem ich do Stable.

W launcherze zachowywane są tylko **3 ostatnie wersje Beta**, aby repo i interfejs pozostawały czytelne.

## Jak działa loader

Bookmarklet:

1. sprawdza aktualny commit gałęzi `main`,
2. ładuje `swir.js` przypięty do konkretnego SHA,
3. `swir.js` uruchamia `launcher.js`,
4. launcher pozwala wybrać konkretną wersję,
5. wybrane buildy korzystają z zamrożonych commitów SHA, dzięki czemu starsze Stable/Beta pozostają odtwarzalne.

Jeżeli pobranie aktualnej wersji się nie powiedzie, bookmarklet posiada awaryjny fallback do wcześniejszej wersji bazowej.

## Najważniejsze pliki

- `bookmark-loader.txt` — kod bookmarkletu,
- `swir.js` — entrypoint launchera,
- `launcher.js` — interfejs wyboru wersji,
- `version.json` — główny manifest bieżących kanałów,
- `versions.json` — katalog wersji widocznych w launcherze,
- `swir-stable-*.js` — zachowane wersje Stable,
- `swir-beta-*.js` — zachowane wersje Beta.

## Bezpieczeństwo wersji

Starsze buildy używane przez launcher są przypinane do konkretnych commitów SHA. Dzięki temu późniejsze porządki na gałęzi `main` nie zmieniają kodu wcześniej zamrożonych wersji.

---

**SWIR MOD / XBookmark**  
Bookmarklet launcher dla CZATerii z kanałami Stable i Beta.
