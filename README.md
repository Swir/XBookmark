# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

XBookmark uruchamia launcher z kanałami **STABLE** i **BETA**, dzięki czemu można testować nowe poprawki bez nadpisywania sprawdzonych wersji.

## Aktualny stan

- **Launcher:** 2.9
- **BETA:** 10.11 — UI SAFE + PHONE CLEAN
- **STABLE / recommended:** 9.9.2
- **10.10:** wstrzymana po regresji klikalności panelu MOD
- **10.6:** zamrożony oryginał używany jako baza 10.11
- **10.0:** zamrożony punkt odniesienia dla Friend Radaru

## Co poprawia 10.11

10.11 ładuje zamrożone **10.6** i nakłada tylko jedną małą, izolowaną poprawkę.

- usuwa znacznik telefonu dodawany przez SWIR przy nickach w rozmowie,
- nie usuwa emotki telefonu wpisanej normalnie przez użytkownika w treści wiadomości,
- nie ładuje warstw MIX / Ice / reply z 10.10,
- nie zmienia działania Znajomych ani Friend Radaru,
- zachowuje 10.6 jako bezpieczny punkt rollback.

Poprawka telefonu znajduje się w `swir-phone-clean-1011.js`.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj linię `javascript:...` do adresu zakładki w Chrome/Edge.
3. Wejdź na CZATerię i odśwież stronę.
4. Kliknij zakładkę XBookmark.
5. W Launcherze wybierz **BETA → 10.11 BETA** albo wersję STABLE.

SMART loader pobiera aktualny commit `main` z GitHub API, a następnie ładuje przypięte pliki przez jsDelivr. Dzięki temu bookmarka nie trzeba ręcznie zmieniać po każdej aktualizacji.

## Kanały

### BETA

| Wersja | Status | Opis |
|---|---|---|
| 10.11 | CURRENT | UI SAFE + PHONE CLEAN |
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
| 10.6 | `9f6124e32f6a50520f4e9da6c7d504b4dc91d163` |
| 10.0 | `0ed4f9710a435444b8299a03cf6181785c3c66e6` |
| 9.9.2 | `c16d6ec57b9063cd9c731f501e5c0cc14adb5c60` |
| 9.9 | `8ef1a5773f98780094c65042c2e622852ea6eb29` |
| 9.8 | `bf0ae7562016d82699baf834664b0945320102ba` |
| 9.7 | `868963711b94d373eee7d6cc1a7444da3c89ef45` |
| 9.6 | `9c4528f269d931f483989dd4dff591bb2a93fa31` |

## Diagnostyka

Friend Radar:

```javascript
SWIR_RADAR_DEBUG97?.diagnostics?.()
```

10.11 Phone Clean:

```javascript
SWIR_PHONE_CLEAN1011?.diagnostics?.()
```

## Zasada rozwoju

Nowe poprawki trafiają najpierw do BETA. Nie ruszamy kilku krytycznych modułów jednocześnie. Każda większa zmiana powinna mieć osobny rollback, a wersja STABLE pozostaje przypięta do sprawdzonego commita.

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów CZATerii.

---

**Aktualny układ: Launcher 2.9 • 10.11 BETA UI SAFE + PHONE CLEAN • 9.9.2 STABLE RECOMMENDED**
