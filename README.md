# XBookmark — SWIR MOD

**XBookmark** to bookmarklet dla CZATerii, który uruchamia **SWIR MOD** bez instalowania rozszerzenia przeglądarki. Po kliknięciu zakładki pojawia się launcher z wersjami **Stable** i **Beta**.

## Aktualny stan

- **Launcher:** 5.6
- **Stable:** 10.29
- **Beta:** 10.31
- Launcher pokazuje **3 ostatnie Stable + 3 ostatnie Beta**.

## Co dodaje SWIR MOD

- launcher Stable / Beta,
- panel znajomych i lokalizacje znajomych w pokojach,
- obsługę nicków ze znakami specjalnymi,
- odpowiedzi po nicku,
- MIX stylów pisania,
- motyw ICE z poprawioną czytelnością,
- diagnostykę Friends / ACK / snapshot,
- **Virtual Rooms w 10.31 Beta** — własne grupowe pokoje widoczne dla użytkowników SWIR 10.31+.

## Bookmarklet

Skopiuj cały kod poniżej jako **adres URL zakładki**:

```javascript
javascript:(async()=>{if(!/(^|\.)czateria\.interia\.pl$/i.test(location.hostname)){alert('SWIR: otworz CZATerie');return}const add=(u,f)=>{const s=document.createElement('script');s.src=u;s.onerror=f||(()=>alert('SWIR: blad pobierania'));document.head.appendChild(s)};const safe=()=>add('https://cdn.jsdelivr.net/gh/Swir/XBookmark@8ef1a5773f98780094c65042c2e622852ea6eb29/swir.js?v='+Date.now(),()=>alert('SWIR: nie udalo sie uruchomic nawet 9.9 SAFE FALLBACK'));try{const r=await fetch('https://api.github.com/repos/Swir/XBookmark/commits/main?x='+Date.now(),{cache:'no-store'}),j=await r.json(),h=j.sha;if(!h)throw Error('brak SHA');add('https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+h+'/swir.js?v='+Date.now(),safe)}catch(e){safe()}})()
```

## Jak uruchomić

1. Dodaj nową zakładkę w Chrome / Edge / Chromium.
2. Nazwij ją np. **SWIR MOD**.
3. W polu **URL / Adres** wklej kod bookmarkletu z sekcji wyżej.
4. Otwórz CZATerię i zaloguj się.
5. Kliknij zakładkę **SWIR MOD**.
6. W launcherze wybierz Stable albo Beta.

## Stable 10.29

Rekomendowana wersja do normalnego używania. Zawiera aktualny Friends flow, symbol-safe nick identity, snapshot merge, ACK Route Guard, MIX 8/8 oraz bazę motywu ICE.

## Beta 10.31 — Virtual Rooms

10.31 bazuje na 10.30 i dodaje **własne grupowe pokoje SWIR**.

Możesz:

- utworzyć własny pokój,
- zaprosić użytkownika po nicku,
- przyjąć albo odrzucić zaproszenie,
- prowadzić rozmowę grupową,
- zobaczyć listę członków,
- wyjść z pokoju,
- zamknąć pokój jako jego twórca.

Virtual Rooms są funkcją klienta SWIR — nie tworzą nowego oficjalnego pokoju na serwerze CZATerii. Każdy uczestnik powinien mieć uruchomione **SWIR 10.31+**.

Przy pierwszym zaproszeniu nick musi być widoczny w jednym z otwartych pokojów nadawcy albo być już dostępny przez aktywną rozmowę prywatną. Beta nie zgaduje trasy do niewidocznego nicka.

### Test 10.31

1. Na obu komputerach uruchom **10.31 BETA**.
2. Na pierwszym komputerze kliknij **POKÓJ+**.
3. Wybierz **Nowy pokój** i podaj nazwę.
4. Kliknij **Zaproś** i wpisz dokładny nick drugiej osoby.
5. Druga osoba zobaczy zaproszenie w **POKÓJ+**.
6. Po zaakceptowaniu wyślij wiadomość z obu stron.

## Najważniejsze pliki

- `bookmark-loader.txt` — bookmarklet,
- `swir.js` — entrypoint,
- `launcher.js` — launcher wersji,
- `version.json` — główny manifest,
- `versions.json` — katalog 3 Stable + 3 Beta,
- `swir-beta-1031.js` — bootstrap 10.31,
- `swir-rooms-1031.js` — Virtual Rooms,
- `swir-stable-1029.js` — rekomendowany Stable.

## Ważne

SWIR MOD działa w kontekście strony CZATerii. Zmiany po stronie serwisu mogą wymagać aktualizacji moda. Wersje historyczne są przypięte do konkretnych commitów SHA, dzięki czemu pozostają odtwarzalne.

---

**SWIR MOD / XBookmark**  
Bookmarklet launcher i rozszerzenia interfejsu dla CZATerii.
