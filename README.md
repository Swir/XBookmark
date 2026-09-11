# XBookmark — SWIR Version Launcher

Centralne repozytorium bookmarka **SWIR dla CZATerii**.

## Aktualny stan

- **Launcher:** 4.5 — **STABLE + BETA**
- **STABLE / recommended:** **10.17.2**
- **BETA:** **10.21 — HONOUR PATH PROBE**
- **BETA rollback:** 10.20 Friend Identity Guard
- **BETA writing rollback:** 10.19 Color-Aligned MIX
- **BETA baseline:** 10.17 APK Exact Rooms

## 10.21 BETA — HONOUR PATH PROBE

Ta wersja powstała do sprawdzenia hipotezy, czy użytkownicy znajdujący się w innych natywnych listach CZATerii — np. honour/admin — są rozwiązywani przez klienta inaczej niż zwykli użytkownicy.

10.21 **nie zmienia rangi ani uprawnień użytkownika**. Nie ustawia `isHonour()`, `isAdmin()` ani `perm`. Zamiast tego skanuje prawdziwe obiekty `UserData` i porównuje ich ścieżkę identyfikacji.

### Co robi probe

Dla każdego lokalnego znajomego przeszukuje natywne źródła:

- `adminsList`,
- `honoursList`,
- `registeredList`,
- `ordinaryList`,
- `closestList`,
- `userSet`,
- `getUsers()`.

Jeżeli znajdzie dokładnie ten sam canonical nick, odczytuje z prawdziwego `UserData/UserCardData`:

- `UID`,
- `isMobile()`,
- `isHonour()`,
- `isAdmin()`,
- `isRegistered()`,
- `hasPrivs()`,
- `isHiddenAdmin()` jeśli istnieje.

Realny UID jest zapisywany do istniejącego, zaufanego cache jako źródło `CHNS-user`, po czym uruchamiana jest normalna, potwierdzona ścieżka Friend Radaru:

`UID → code 8/subcode 4 → code 85 → code 159 → rooms[]`

Nie ma żadnego specjalnego pakietu „honour”. Celem wersji jest porównanie, czy problem siedzi w identyfikacji `UserData`, a nie w samym `rooms[]`.

### Panel i diagnostyka

Po otwarciu Znajomych 10.21 dodaje mały blok **HONOUR PATH PROBE** z przyciskiem **SKANUJ**.

Pełna diagnostyka:

```javascript
SWIR_HONOUR_PROBE1021?.diagnostics?.()
```

Najważniejsze pola:

- `uid` — rzeczywisty UID znaleziony w UserData,
- `mobile` — natywne `isMobile()`,
- `honour` — natywne `isHonour()`,
- `admin` — natywne `isAdmin()`,
- `registered` — stan rejestracji,
- `privs` — czy użytkownik ma aktywne privy,
- `lists` — w których natywnych listach został znaleziony,
- `localRooms` — pokoje widziane lokalnie,
- `server` — pokoje z `159.rooms[]`,
- `status` — np. `SERVER_OK`, `SEEDED_NATIVE_UID`, `NATIVE_WITHOUT_UID`, `UID_CONFLICT`, `NO_NATIVE_USER`.

Można też zebrać wszystko naraz:

```javascript
SWIR_BETA1021?.diagnostics?.()
```

## Pisanie / MIX

10.21 nie zmienia działającego MIX-u z 10.19. Nadal działa pełna talia 8/8:

- normalne,
- B,
- I,
- U,
- B+I,
- B+U,
- I+U,
- B+I+U.

## Friend Identity Guard

10.21 dziedziczy 10.20, więc nadal działa:

- canonical nick,
- usuwanie zakłóceń typu phone marker/zero-width/NBSP z identyfikatora,
- poprawione dodawanie znajomego z context menu,
- fallback `getUserWithName()` po prawdziwych obiektach `UserData`,
- backup starej listy/cache przed migracją.

## Launcher 4.5

- **STABLE** — bez zmian,
- **BETA 10.21** — Honour Path Probe,
- **BETA 10.20** — Friend Identity Guard rollback,
- **BETA 10.19** — działający MIX rollback,
- **BETA 10.17** — czysta baza Friend Radar.

## Jak testować 10.21

1. **Ctrl+F5** na CZATerii.
2. XBookmark → **BETA → 10.21 BETA — HONOUR PATH PROBE**.
3. Otwórz **Znajomi**.
4. Kliknij **SKANUJ** w bloku Honour Path Probe.
5. Odczekaj kilka sekund i kliknij **ODŚWIEŻ** w Radarze.
6. Sprawdź szczególnie użytkownika mobile, którego wcześniej nie dało się poprawnie zlokalizować.
7. W razie problemu uruchom `SWIR_BETA1021.diagnostics()` i porównaj `mobile / honour / privs / UID / server rooms`.

---

**Aktualny układ: Launcher 4.5 • 10.17.2 STABLE • 10.21 BETA HONOUR PATH PROBE • 10.20 rollback • 10.19 writing rollback • 10.17 Friends baseline**
