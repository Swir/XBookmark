# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

XBookmark uruchamia launcher z kanałami **STABLE** i **BETA**, dzięki czemu można testować nowe poprawki bez nadpisywania sprawdzonych wersji.

## Aktualny stan

- **Launcher:** 3.1
- **BETA:** 10.13 — CLEAN RECOVERY
- **STABLE / recommended:** 9.9.2
- **10.12:** BROKEN / PAUSED po regresji mrugania UI i ikon
- **10.11:** zamrożony rollback UI SAFE + PHONE CLEAN
- **10.6:** zamrożony oryginał UI / nicki / pisanie
- **10.0:** zamrożony punkt odniesienia dla Friend Radaru

## Co robi 10.13

10.13 ładuje bezpośrednio zamrożone **10.6** i nakłada tylko `swir-clean-recovery-1013.js`.

Najważniejsze zasady:

- **nie ładuje 10.12** ani `swir-friends-1012.js`,
- usuwa SWIR-owe znaczniki telefonu i mobile badge z natywnych nicków w rozmowie,
- usuwa telefon z badge w panelu Friend Radar,
- czyści wyłącznie tymczasowy stan `swir_friend_reliability_1012`,
- zachowuje `czateria_znajomi`, cache `userId` i stan serwera,
- nie zmienia treści wiadomości wpisanych przez użytkowników,
- nie dodaje żadnych nowych emoji ani ikon do nicków.

Celem 10.13 jest odzyskanie spokojnej, stabilnej bazy bez mrugania i bez pozostałości po eksperymencie 10.12.

## Dlaczego 10.12 została wycofana

10.12 próbowała automatyzować PC/SWIR → APP i weryfikację 85 → 159, ale w praktyce doprowadziła do regresji interfejsu: częstych przebudów panelu, mrugania oraz ponownego pojawiania się ikon. Zamiast dokładać kolejne poprawki na tę warstwę, została zamrożona i oznaczona jako **BROKEN / PAUSED**.

## Jak używać

1. Otwórz `bookmark-loader.txt`.
2. Skopiuj linię `javascript:...` do adresu zakładki w Chrome/Edge.
3. Wejdź na CZATerię i odśwież stronę.
4. Kliknij zakładkę XBookmark.
5. W Launcherze wybierz **BETA → 10.13 BETA — CLEAN RECOVERY**.

SMART loader pobiera aktualny commit `main` z GitHub API, a następnie ładuje przypięte pliki przez jsDelivr. Dzięki temu bookmarka nie trzeba ręcznie zmieniać po każdej aktualizacji.

## Kanały

### BETA

| Wersja | Status | Opis |
|---|---|---|
| 10.13 | CURRENT | Clean Recovery: czyste 10.6 + usuwanie SWIR-owych badge/telefonów z nicków |
| 10.12 | BROKEN / PAUSED | mruganie UI i niestabilny panel Znajomych |
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
| 10.12 | `237754b0149bccf8d12c46526c4a74b234c27170` |
| 10.11 | `799dea8c4870a41219057f4cc555b270a5bb858d` |
| 10.6 | `9f6124e32f6a50520f4e9da6c7d504b4dc91d163` |
| 10.0 | `0ed4f9710a435444b8299a03cf6181785c3c66e6` |
| 9.9.2 | `c16d6ec57b9063cd9c731f501e5c0cc14adb5c60` |
| 9.9 | `8ef1a5773f98780094c65042c2e622852ea6eb29` |
| 9.8 | `bf0ae7562016d82699baf834664b0945320102ba` |
| 9.7 | `868963711b94d373eee7d6cc1a7444da3c89ef45` |
| 9.6 | `9c4528f269d931f483989dd4dff591bb2a93fa31` |

## Diagnostyka 10.13

```javascript
SWIR_CLEAN_RECOVERY1013?.diagnostics?.()
```

Powinno pokazać `leftPhoneInNativeNicks: 0`, `leftPhoneBadgesInRadar: 0` oraz `reliability1012State: null`.

## Zasada rozwoju

Nowe poprawki trafiają najpierw do BETA. Nie ruszamy kilku krytycznych modułów jednocześnie. Każda większa zmiana ma osobny rollback, a wersja STABLE pozostaje przypięta do sprawdzonego commita.

## Bezpieczeństwo

SWIR nie nadaje uprawnień administratora, nie omija CAPTCHA, antyspamu, banów ani serwerowych filtrów CZATerii.

---

**Aktualny układ: Launcher 3.1 • 10.13 BETA CLEAN RECOVERY • 9.9.2 STABLE RECOMMENDED**
