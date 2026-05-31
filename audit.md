# Audyt projektu StudySprint — analiza zaliczeniowa

Dokument zestawia obecny stan projektu z kryteriami oceny (React Native / Expo)
i wskazuje, **co jeszcze trzeba dorobić, aby projekt został zaliczony**.

Legenda:

- ✅ **Spełnione**
- 🟡 **Częściowo** (jest podstawa, brakuje elementu wymaganego przez „dodatkowe kryterium")
- ❌ **Brakuje** (do uzupełnienia, blokuje zaliczenie kryterium)

---

## ⛔ Wymagania wstępne (bez tego projekt NIE jest oceniany)

| Wymaganie                                           | Status | Uwagi                                                                                                                                                                                   |
| --------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kod w repozytorium Git z sensowną historią commitów | ❌     | **Folder nie jest repozytorium Git** (`git status` → „not a git repository"). Trzeba zainicjować repo, wrzucić na GitHub/GitLab i robić commity etapami, a nie jednym „initial commit". |
| README z instrukcją uruchomienia                    | ✅     | Dawny szablon „Sample Snack app" został zastąpiony właściwym README.                                                                                                                    |
| Projekt uruchamia się bez błędów w Expo Go / EAS    | 🟡     | Kod wygląda na poprawny, ale **uruchomienie trzeba realnie zweryfikować** (`npm start`) i zrobić screenshoty.                                                                           |

> **Najpilniejsze:** inicjalizacja Git + push na GitHub. Bez tego praca nie podlega ocenie.
>
> ```bash
> git init
> git add .
> git commit -m "Inicjalizacja projektu StudySprint"
> # ... kolejne commity tematyczne ...
> git remote add origin <URL>
> git push -u origin main
> ```

---

## 📋 KRYTERIA BAZOWE (na ocenę do 4.0)

### 1. Architektura aplikacji — 🟡

- **Jest:** czysty podział na warstwy — logika biznesowa w `src/logic/`, prezentacja w `src/screens/` i `src/components/`, dostęp do danych w `src/utils/storage.js`. To realizacja wzorca „prezentacyjne + logika".
- **Brakuje:** brak globalnego zarządzania stanem (Context / Redux / Zustand). Dane są przeładowywane z AsyncStorage przy każdym wejściu na ekran (`useFocusEffect`). Powiązane z kryterium 11.
- **Do zrobienia:** wprowadzić Context API (lub Zustand) jako jedno źródło prawdy dla przedmiotów/zadań/sesji oraz przygotować się do **ustnego wyjaśnienia wyboru wzorca**.

### 2. Obsługa rozmiarów i orientacji ekranu — 🟡

- **Jest:** intensywne użycie Flexbox (`flex`, `flexDirection`, `justifyContent`), `SafeAreaProvider`, jednostki względne (`flex: 1`).
- **Brakuje:** aplikacja zablokowana w pionie (`"orientation": "portrait"`), brak `useWindowDimensions`/`Dimensions`, miejscami sztywne wymiary (np. `timer` fontSize 80).
- **Do zrobienia:** dodać obsługę orientacji poziomej (lub świadomie uzasadnić blokadę) i przynajmniej w jednym miejscu użyć `useWindowDimensions` dla skalowania.

### 3. Jakość kodu — ✅

- **Jest:** kod czytelny, spójny styl, sensowne nazwy.
- **Skonfigurowane:** ESLint 9 (flat config, preset `eslint-config-expo`) + Prettier zintegrowany przez `eslint-plugin-prettier`. Pliki: `eslint.config.js`, `.prettierrc`, `.prettierignore`. Skrypty w `package.json`: `lint`, `lint:fix`, `format`. Globale Jest zadeklarowane dla testów.
- **Status:** cały kod sformatowany Prettierem, `npm run lint` przechodzi bez błędów (exit 0), 35 testów nadal zielonych.
- **Użycie:**
  ```bash
  npm run lint      # sprawdzenie
  npm run lint:fix  # auto-naprawa
  npm run format    # formatowanie Prettierem
  ```

### 4. Testy — ✅

- **Jest:** ~35 testów jednostkowych w `__tests__/` pokrywających realną logikę (CRUD zadań/przedmiotów, filtrowanie i sortowanie, walidację, formatowanie czasu, statystyki). Spełnia minimum 8–10.
- **Opcjonalnie na plus:** dodać test komponentu z React Native Testing Library (np. `TaskForm`) — kryterium wspomina o testach komponentów/hooków.

### 5. Dokumentacja kodu i projektu — 🟡

- **Jest:** nowe README (instrukcja uruchomienia < 5 min, technologie, funkcje, struktura, opis architektury).
- **Brakuje:** **screenshoty/GIF-y** z aplikacji (placeholder „TODO" w README) oraz komentarze „DLACZEGO" przy kluczowych fragmentach (np. dlaczego `useFocusEffect`, dlaczego `isBreakRef` w timerze).
- **Do zrobienia:** dograć zrzuty ekranu i dodać kilka komentarzy wyjaśniających decyzje.

### 6. Integracja z natywnymi funkcjami urządzenia — ❌

- **Jest:** tylko **jedna** funkcja — lokalne przechowywanie danych (AsyncStorage).
- **Brakuje:** kryterium wymaga **co najmniej dwóch** funkcji natywnych + **obsługi uprawnień (w tym odmowy)**. Brak jakiejkolwiek biblioteki natywnej poza async-storage.
- **Do zrobienia:** dodać min. jedną–dwie z poniższych (dobrze pasują do aplikacji do nauki):
  - `expo-notifications` — lokalne powiadomienie po zakończeniu sesji Pomodoro (z obsługą braku zgody),
  - `expo-haptics` — wibracja przy starcie/końcu timera, ukończeniu zadania,
  - opcjonalnie `expo-secure-store` (powiązane z kryterium 14).
  - **Pamiętać o obsłudze odmowy uprawnień** (komunikat dla użytkownika).

### 7. Zarządzanie operacjami asynchronicznymi — 🟡

- **Jest:** `async/await` przy zapisie/odczycie storage, `try/catch` w `storage.js`.
- **Brakuje:** brak stanów `loading`/`error` w UI — użytkownik nie widzi ładowania ani komunikatu o błędzie; błędy są tylko `console.warn`.
- **Do zrobienia:** dodać stany ładowania (np. `ActivityIndicator` przy wejściu na ekran) i komunikaty błędu z opcją ponowienia.

### 8. Nawigacja między ekranami — ❌

- **Jest:** Bottom Tabs (jeden typ) z 5 ekranami.
- **Brakuje:** kryterium wymaga **min. dwóch typów nawigacji** (np. tabs + stack lub tabs + modal) **oraz przekazywania parametrów** między ekranami. Obecnie edycja odbywa się w `Modal` w obrębie ekranu — to nie jest osobny typ nawigacji ani przekazywanie parametrów przez router.
- **Do zrobienia:** dodać Stack Navigator (np. lista zadań → ekran szczegółów zadania z `route.params`), zagnieżdżony w tabach. Daje to drugi typ nawigacji + parametry.

### 9. Wydajność aplikacji — 🟡

- **Jest:** długie listy renderowane przez `FlatList` (Przedmioty, Zadania, Statystyki), `useFocusEffect(useCallback(...))`.
- **Brakuje:** brak `React.memo`/`useMemo`/`useCallback` w gorących miejscach — np. `filterAndSortTasks` przeliczane przy każdym renderze, `renderItem` tworzony na nowo.
- **Do zrobienia:** owinąć `filteredTasks` w `useMemo`, `renderItem`/handlery w `useCallback`, rozważyć `React.memo` na elemencie listy — i umieć to opisać.

### 10. Styl i UI/UX — 🟡

- **Jest:** spójna kolorystyka (`#4a90e2`), spacing, czytelny układ.
- **Brakuje:** te same kolory/wartości są **zduplikowane** w wielu plikach. Kryterium wymaga biblioteki UI **albo** własnego pliku `theme/constants`.
- **Do zrobienia:** wydzielić `src/theme/colors.js` (i np. `spacing.js`) i używać w stylach zamiast hardkodowanych wartości.

### 11. Obsługa stanu aplikacji — ❌

- **Jest:** stan lokalny przez `useState` (poprawnie dla modali, formularzy).
- **Brakuje:** brak **globalnego** stanu (Context / Redux / Zustand). Współdzielenie danych między ekranami realizowane przez ponowny odczyt z AsyncStorage — to obejście, nie zarządzanie stanem globalnym.
- **Do zrobienia:** wprowadzić Context API lub Zustand dla przedmiotów/zadań/sesji; umieć **uzasadnić, co jest stanem globalnym, a co lokalnym** (kluczowe kryterium powiązane z #1).

### 12. Obsługa błędów i sytuacji wyjątkowych — ❌

- **Jest:** walidacja danych wejściowych (puste nazwy), `try/catch` w storage.
- **Brakuje:** brak **Error Boundary** (błędy renderowania), brak **NetInfo**, brak komunikatów błędu z opcją „spróbuj ponownie".
- **Do zrobienia:** dodać komponent Error Boundary owijający aplikację oraz (jeśli pojawi się sieć — kryterium C) sprawdzanie połączenia przez `@react-native-community/netinfo`.

### 13. Tryb offline (podstawowy) — ✅

- **Jest:** aplikacja działa w całości offline — wszystkie dane (przedmioty, zadania, sesje) trzymane lokalnie w AsyncStorage i dostępne bez sieci oraz po restarcie. Kryterium bazowe spełnione z natury projektu.

### 14. Bezpieczeństwo — 🟡

- **Jest:** brak kluczy API w kodzie, brak danych wrażliwych, walidacja wejścia, komunikacja sieciowa nie występuje.
- **Brakuje / do opisania:** brak pliku `.env` i `expo-secure-store` (na razie nie ma czego chronić). Jeśli dojdzie logowanie/API (kryteria B/C), token **musi** trafić do SecureStore, a klucze do zmiennych środowiskowych.
- **Do zrobienia:** w dokumentacji opisać zastosowane zasady bezpieczeństwa; przy rozszerzeniach użyć SecureStore + `.env` (już jest w `.gitignore`).

### 15. Deployment i budowanie (EAS) — ❌

- **Jest:** `app.json` z nazwą, ikoną, splash screenem i adaptive icon (Android).
- **Brakuje:** **brak `eas.json`**, brak udokumentowanego procesu budowania, brak działającego buildu. Trzeba też **potwierdzić, że ikona jest własna**, a nie domyślna Expo.
- **Do zrobienia:**
  ```bash
  npm install -g eas-cli
  eas login
  eas build:configure
  eas build --platform android --profile preview   # → .apk
  ```
  Wynik (link/`.apk`) i kroki opisać w README. Podmienić domyślną ikonę na własną, jeśli jeszcze nie jest.

---

## 🚀 KRYTERIA ROZSZERZONE (na ocenę 5.0 – 6.0)

> Wymagane **wszystkie** kryteria bazowe (1–15) **oraz** kryteria rozszerzone.
> Obecnie żadne rozszerzone nie jest spełnione.

| Kryterium                             | Status | Co trzeba zrobić                                                                                                                                                                              |
| ------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Backend i baza danych**          | ❌     | Podłączyć Firebase/Supabase, przenieść dane do chmury, CRUD z loading/error, trwałość po reinstalacji.                                                                                        |
| **B. Autoryzacja i uwierzytelnianie** | ❌     | Rejestracja/logowanie, min. 2 metody (np. email + Google), sesja + auto-login, token w SecureStore, ekrany chronione.                                                                         |
| **C. Integracja z zewnętrznym API**   | ❌     | Dodać sensowne publiczne API (np. cytaty motywacyjne, kalendarz, AI), klucz w `.env`, obsługa loading/error/rate-limit.                                                                       |
| **D. Zaawansowany UX**                | 🟡     | Najbliżej celu. Wystarczą **2 z 4**: animacje (Reanimated/Lottie), gesty (swipe-to-delete na zadaniach), haptic feedback (`expo-haptics`), offline sync. Haptyka + swipe to najszybsza droga. |

---

## ✅ Podsumowanie — priorytetowa lista „do zaliczenia (do 4.0)"

Kolejność od najpilniejszych:

1. **Git + GitHub** — zainicjować repo i wrzucić z sensowną historią commitów _(wymóg wstępny — blokuje ocenę)_.
2. **Druga funkcja natywna + uprawnienia** (kryt. 6) — np. `expo-notifications` i/lub `expo-haptics` z obsługą odmowy.
3. **Drugi typ nawigacji + parametry** (kryt. 8) — Stack ze szczegółami zadania zagnieżdżony w tabach.
4. **Globalny stan: Context/Zustand** (kryt. 11 + 1) — jedno źródło prawdy zamiast przeładowań z AsyncStorage.
5. **Error Boundary** (kryt. 12).
6. **Stany loading/error w UI** (kryt. 7).
7. **Plik theme/constants** (kryt. 10) — wydzielić kolory/spacing.
8. **EAS build (.apk) + własna ikona + opis w README** (kryt. 15).
9. **Screenshoty/GIF + komentarze „dlaczego"** w README/kodzie (kryt. 5).
10. _(na plus)_ memoizacja `useMemo`/`useCallback`/`React.memo` (kryt. 9), `useWindowDimensions` (kryt. 2).

**Już spełnione (mocne strony):** ✅ ESLint + Prettier (3), testy (4), tryb offline (13),
podstawa architektury (1), FlatList (9), Flexbox (2), brak sekretów w kodzie (14).
