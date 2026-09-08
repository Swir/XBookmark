# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj jedną linię `javascript:...` do adresu zakładki w Chrome.
3. Wejdź na CZATerię, odśwież stronę i kliknij zakładkę.
4. Otworzy się **SWIR XBOOKMARK LAUNCHER**.

SMART bookmark pobiera aktualny SHA `main` z GitHub API i ładuje dokładnie ten commit z jsDelivr. Bookmark nie wymaga zmiany przy kolejnych wydaniach.

## Launcher 1.2

Launcher ma dwa kanały:

- **STABLE** — wersje sprawdzone i przypięte do konkretnych commitów,
- **BETA** — nowe funkcje do testowania przed przeniesieniem do STABLE.

### BETA

- **10.1 BETA — CLEAN UI + COLOR TAB** — aktualna beta,
- **10.0 BETA** — zamrożona poprzednia beta.

### STABLE

- **9.9 RECOMMENDED**,
- **9.8 STABLE**,
- **9.7 STABLE**,
- **9.6 SAFE**.

## SWIR 10.1 BETA

10.1 korzysta z zamrożonej bazy 9.9 i nie przebudowuje działającego Friend Radaru.

Zmiany:

- całkowicie usunięty Image Lab z interfejsu,
- osobna zakładka **🌈 Kolorowe pisanie**,
- osobne zakładki MOD: Główne, Kolorowe pisanie, Motywy, Znajomi, Powiadomienia, Narzędzia,
- szybkie akcje: Znajomi, DND, test powiadomień, następny motyw,
- profile ustawień: Gaming, Cichy, Jasny,
- zapamiętywanie ostatniej zakładki i wyszukiwarka ustawień,
- Friend Radar 9.7 pozostaje bez zmian.

## Powiadomienia BETA

- nowy PRIV,
- licznik nieprzeczytanych,
- znajomy online,
- zmiana pokoju,
- VIP,
- DND,
- Chrome/Windows po ręcznym nadaniu zgody,
- reconnect,
- historia powiadomień,
- test powiadomień.

## Zamrożone wersje

| Wersja | Kanał | Commit |
|---|---|---|
| 10.0 | BETA | `0ed4f9710a435444b8299a03cf6181785c3c66e6` |
| 9.9 | RECOMMENDED | `8ef1a5773f98780094c65042c2e622852ea6eb29` |
| 9.8 | STABLE | `bf0ae7562016d82699baf834664b0945320102ba` |
| 9.7 | STABLE | `868963711b94d373eee7d6cc1a7444da3c89ef45` |
| 9.6 | SAFE | `9c4528f269d931f483989dd4dff591bb2a93fa31` |

## Diagnostyka

Friend Radar:

```javascript
SWIR_RADAR_DEBUG97.diagnostics()
```

Powiadomienia:

```javascript
SWIR_NOTIFY100.settings()
SWIR_NOTIFY100.notifyTest()
SWIR_NOTIFY100.logs()
```

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów.

## Aktualny układ

**Launcher 1.2 • 9.9 RECOMMENDED • 10.1 BETA CLEAN UI + COLOR TAB**
