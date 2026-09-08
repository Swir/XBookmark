# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka SWIR dla CZATerii.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj jedną linię `javascript:...` do adresu zakładki w Chrome.
3. Wejdź na CZATerię, odśwież stronę i kliknij zakładkę.
4. Zamiast automatycznie uruchamiać jeden MOD, pojawi się **SWIR XBOOKMARK LAUNCHER** z wyborem wersji.

SMART bookmark pobiera aktualny SHA `main` z GitHub API, a następnie ładuje dokładnie ten commit z jsDelivr. Sam bookmark nie wymaga zmiany przy kolejnych wydaniach.

## Launcher 1.0

Dostępne kanały:

- **10.0 BETA — NOTIFY EDITION** — najnowsze funkcje testowe,
- **9.9 RECOMMENDED** — zamrożona, polecana wersja,
- **9.8 STABLE** — poprzednia stabilna wersja,
- **9.7 STABLE** — Friend Radar Rebuild,
- **9.6 SAFE** — starsza spokojniejsza wersja.

Wersje 9.9–9.6 są przypięte do konkretnych commitów. Późniejsze zmiany na `main` nie zmienią ich kodu.

Katalog wersji: `versions.json`.

## 10.0 BETA — NOTIFY EDITION

Beta korzysta z zamrożonej bazy 9.9 i dokłada osobny moduł powiadomień. Dzięki temu eksperymentalny kod nie modyfikuje stabilnej 9.9.

Funkcje BETA:

- powiadomienie o nowym PRIV, gdy rozmowa nie jest aktywna albo karta jest w tle,
- licznik nieprzeczytanych na zakładce PRIV,
- powiadomienie, gdy znajomy APP pojawi się online,
- powiadomienie o zmianie pokoju znajomego,
- opcjonalne powiadomienie o przejściu offline,
- VIP — osobne wyróżnienie dla wybranych nicków,
- DND / Nie przeszkadzać,
- powiadomienia Chrome/Windows po ręcznym nadaniu zgody,
- dźwięk lokalny,
- alert o utracie i odzyskaniu połączenia,
- historia ostatnich powiadomień w MOD,
- przycisk testu powiadomień,
- Auto Radar co 60 sekund — używa wyłącznie normalnego `Connection.send()` Radaru i respektuje jego cooldown.

Powiadomienia systemowe wymagają kliknięcia przycisku `🔔 Uprawnienie` w MOD. Skrypt nie prosi o zgodę automatycznie.

## Zamrożone wersje

| Wersja | Kanał | Commit |
|---|---|---|
| 9.9 | RECOMMENDED | `8ef1a5773f98780094c65042c2e622852ea6eb29` |
| 9.8 | STABLE | `bf0ae7562016d82699baf834664b0945320102ba` |
| 9.7 | STABLE | `868963711b94d373eee7d6cc1a7444da3c89ef45` |
| 9.6 | SAFE | `9c4528f269d931f483989dd4dff591bb2a93fa31` |

## Friend Radar

Działający silnik Radaru pozostaje w 9.9/10.0 oparty o `swir-radar-97.js`. Nie przebudowujemy go w 10.0 BETA.

Oficjalny flow znajomego wykorzystuje znane `userId`, normalne dodanie APP oraz odpowiedź `85 -> 159` z `rooms[]`. Nie ma bezpośredniego fallbacku `webSocket.send()`.

Diagnostyka:

```javascript
SWIR_RADAR_DEBUG97.diagnostics()
```

Powiadomienia BETA:

```javascript
SWIR_NOTIFY100.settings()
SWIR_NOTIFY100.notifyTest()
SWIR_NOTIFY100.logs()
```

## Pliki

- `swir.js` — wejście do Launchera,
- `launcher.js` — UI wyboru wersji,
- `versions.json` — katalog wersji i przypięte commity,
- `swir-beta-10.js` — bootstrap 10.0 BETA na bazie zamrożonej 9.9,
- `swir-notify-100-beta.js` — Notification Center 10.0,
- `swir-core.js` — rdzeń historyczny,
- `swir-prepatch-96.js` — bramka anty-flood,
- `swir-radar-97.js` — działający Friend Radar,
- `swir-ui-99.js` — UI stabilnej 9.9,
- `bookmark-loader.txt` — stały SMART bookmark.

## Bezpieczeństwo

SWIR nie nadaje admin/honour, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów. Moduły Friend Radar i Notify korzystają z normalnych funkcji klienta.

## Aktualny układ

**Launcher 1.0 • 9.9 RECOMMENDED • 10.0 BETA NOTIFY EDITION**
