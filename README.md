# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

XBookmark uruchamia launcher z kanałami **STABLE** i **BETA**, dzięki czemu można testować nowe poprawki bez nadpisywania sprawdzonych wersji.

## Aktualny stan

- **Launcher:** 3.0
- **BETA:** 10.12 — FRIENDS RELIABILITY
- **STABLE / recommended:** 9.9.2
- **10.11:** zamrożony rollback UI SAFE + PHONE CLEAN
- **10.10:** wstrzymana po regresji klikalności panelu MOD
- **10.6:** zamrożony oryginał UI / nicki / pisanie
- **10.0:** zamrożony punkt odniesienia dla Friend Radaru

## Co poprawia 10.12

10.12 ładuje zamrożone **10.11** i nakłada tylko jedną izolowaną warstwę: `swir-friends-1012.js`.

Najważniejsze zmiany:

- **PC / SWIR → APP** działa przez kontrolowaną kolejkę zamiast jednorazowej próby,
- pakiety Friends są wysyłane tylko przez połączenie z `WebSocket.readyState === OPEN`,
- `code 159` jest przechwytywany bezpośrednio z WebSocketa,
- po `code 8 / subcode 4` SWIR czeka na `85 → 159` i dopiero wtedy oznacza znajomego jako **CONFIRMED**,
- jeśli socket jest zamknięty lub serwer nie potwierdzi relacji, zadanie trafia do retry zamiast znikać,
- stany są rozróżnione: `QUEUED`, `WAIT_ID`, `WAIT_SOCKET`, `VERIFYING`, `CONFIRMED`, `ERROR`,
- panel wyjaśnia różnicę: **APP = globalne rooms[]**, **PC = tylko lokalnie widoczny użytkownik**,
- ręczny przycisk **PC→APP** wrzuca znanych lokalnych znajomych do bezpiecznej kolejki synchronizacji,
- MIX, Ice i ogólne UI MOD pozostają nietknięte.

## Dlaczego wcześniej działało tylko „w połowie”

Friend Radar 9.7 miał kilka warunków wyścigu:

- mógł uznać `Connection.send()` za sukces, mimo że socket nie był już otwarty,
- po dodaniu znajomego weryfikacja `85` mogła zostać zablokowana przez własny cooldown,
- brakowało kolejki retry,
- zapisany `159` nie miał jasnego statusu świeżości,
- użytkownik `PC/SWIR` był lokalnie widoczny, ale dopóki nie został potwierdzony jako `APP`, nie miał globalnego `rooms[]`.

10.12 naprawia właśnie tę ścieżkę bez przebudowywania reszty moda.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj linię `javascript:...` do adresu zakładki w Chrome/Edge.
3. Wejdź na CZATerię i odśwież stronę.
4. Kliknij zakładkę XBookmark.
5. W Launcherze wybierz **BETA → 10.12 BETA — FRIENDS RELIABILITY**.

SMART loader pobiera aktualny commit `main` z GitHub API, a następnie ładuje przypięte pliki przez jsDelivr. Dzięki temu bookmarka nie trzeba ręcznie zmieniać po każdej aktualizacji.

## Kanały

### BETA

| Wersja | Status | Opis |
|---|---|---|
| 10.12 | CURRENT | Friends Reliability: PC/SWIR → APP + retry + 159 CONFIRMED |
| 10.11 | ROLLBACK | UI SAFE + PHONE CLEAN |
| 10.10 | PAUSED | regresja klikalności MOD |
| 10.9 | ROLLBACK | Friends Clean control |
| 10.8 | ROLLBACK | eksperyment bridge Friends |
| 10.7 | ROLLBACK | clean rebase |
| 10.6 | FROZEN ORIGINAL | baza UI / nicki / pisanie |
| 10.0 | FROZEN | punkt odniesienia dla Znajomych |

### STABLE

| Wersja | Status |
|---|---|
| 9.9.2 | RECOMMENDED |
| 9.9.1 | ROLLBACK |
| 9.9 | ROLLBACK |
| 9.8 | STABLE |
| 9.7 | STABLE |
| 9.6 | SAFE |

## Najważniejsze zamrożone referencje

| Wersja | Commit |
|---|---|
| 10.11 | `799dea8c4870a41219057f4cc555b270a5bb858d` |
| 10.6 | `9f6124e32f6a50520f4e9da6c7d504b4dc91d163` |
| 10.0 | `0ed4f9710a435444b8299a03cf6181785c3c66e6` |
| 9.9.2 | `c16d6ec57b9063cd9c731f501e5c0cc14adb5c60` |
| 9.9 | `8ef1a5773f98780094c65042c2e622852ea6eb29` |
| 9.8 | `bf0ae7562016d82699baf834664b0945320102ba` |
| 9.7 | `868963711b94d373eee7d6cc1a7444da3c89ef45` |
| 9.6 | `9c4528f269d931f483989dd4dff591bb2a93fa31` |

## Diagnostyka

Friend Radar 9.7:

```javascript
SWIR_RADAR_DEBUG97?.diagnostics?.()
```

10.12 Friends Reliability:

```javascript
SWIR_FRIENDS1012?.diagnostics?.()
SWIR_FRIENDS1012?.jobs?.()
```

Wymuszenie bezpiecznej synchronizacji wszystkich znanych PC/SWIR:

```javascript
SWIR_FRIENDS1012?.syncAll?.()
```

## Zasada rozwoju

Nowe poprawki trafiają najpierw do BETA. Nie ruszamy kilku krytycznych modułów jednocześnie. Każda większa zmiana ma osobny rollback, a wersja STABLE pozostaje przypięta do sprawdzonego commita.

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów CZATerii. Globalne pokoje znajomych pochodzą z normalnego mechanizmu APP Friends `85 → 159`.

---

**Aktualny układ: Launcher 3.0 • 10.12 BETA FRIENDS RELIABILITY • 9.9.2 STABLE RECOMMENDED**
