# StudySprint

Mobilna aplikacja do zarządzania nauką metodą Pomodoro - organizacja przedmiotów,
planowanie zadań z priorytetami, pomiar czasu nauki (timer 25/5) i śledzenie
statystyk. Zbudowana w React Native + Expo.

## Funkcjonalności

- Główna - podsumowanie: liczba sesji nauki, ukończonych zadań i przedmiotów.
- Przedmioty - dodawanie, edycja i usuwanie przedmiotów.
- Zadania - tworzenie zadań z opisem, priorytetem i przypisaniem do przedmiotu;
  filtrowanie (przedmiot, status), sortowanie (data, priorytet), oznaczanie jako ukończone.
- Timer - pomodoro 25 min nauki / 5 min przerwy z automatycznym zapisem sesji.
- Statystyki - łączny czas nauki, liczba sesji, postęp zadań per przedmiot.

Dane są zapisywane lokalnie (AsyncStorage) i dostępne po ponownym uruchomieniu - również offline.

## Technologie

| Obszar         | Technologia                                   |
| -------------- | --------------------------------------------- |
| Framework      | React Native `0.81.5` + Expo `~54`            |
| Język          | JavaScript (React `19.1`)                     |
| Stan globalny  | Context API (`AppDataContext`)                |
| Nawigacja      | React Navigation - Bottom Tabs + Native Stack |
| Przechowywanie | `@react-native-async-storage/async-storage`   |
| Testy          | Jest + `jest-expo`                            |
| Jakość kodu    | ESLint 9 (`eslint-config-expo`) + Prettier    |

## Uruchomienie

Wymagania: Node.js 18+, npm oraz aplikacja Expo Go (Android/iOS) lub emulator/symulator.

```bash
git clone <URL_REPOZYTORIUM>
cd StudySprint2
npm install
npm start
```

Następnie: zeskanuj kod QR aplikacją Expo Go (telefon), naciśnij `a` (Android),
`i` (iOS) lub `w` (web).

## Testy i jakość kodu

Projekt zawiera ok. 35 testów jednostkowych logiki zadań, przedmiotów, timera i statystyk.

```bash
npm test         # Jest
npm run lint     # ESLint
npm run format   # Prettier
```

## Budowanie (EAS Build)

Konfiguracja buildów znajduje się w [`eas.json`](./eas.json). Profil `preview`
tworzy instalowalny plik `.apk` dla Androida.

```bash
npm install -g eas-cli
eas login
eas init                                          # jednorazowo
eas build --platform android --profile preview
```

Gotowy build (Android, profil `preview`):
[expo.dev/accounts/kacperormaniec/projects/StudySprint/builds/6c13abf7-cbe5-4905-b926-a3719864168a](https://expo.dev/accounts/kacperormaniec/projects/StudySprint/builds/6c13abf7-cbe5-4905-b926-a3719864168a)

Konfiguracja aplikacji (nazwa, własna ikona, splash screen, `package`) jest
w [`app.json`](./app.json). Ikony można wygenerować skryptem `node scripts/generate-icons.js`.

## Bezpieczeństwo

Aplikacja przestrzega podstawowych zasad bezpieczeństwa adekwatnych do swojego
zakresu (dane wyłącznie lokalne, brak logowania i zewnętrznego API):

- Brak kluczy API i sekretów w kodzie - aplikacja nie komunikuje się z żadnym
  backendem. `.gitignore` pomija pliki `.env*` (pod ewentualne przyszłe sekrety).
- Walidacja danych wejściowych - nazwy przedmiotów i zadań są walidowane przed
  zapisem (`validate*` w `src/logic/`); puste wartości są odrzucane, a tekst przycinany.
- Brak komunikacji sieciowej - wszystkie dane żyją na urządzeniu (AsyncStorage).
  Ewentualne przyszłe API odbywałoby się wyłącznie po HTTPS.
- Dobór magazynu do wrażliwości danych - przedmioty, zadania i sesje nie są danymi
  wrażliwymi, więc AsyncStorage jest właściwym wyborem. `expo-secure-store` jest
  celowo niezastosowany: na obecnym etapie nie ma sekretu do ochrony.

Po dodaniu logowania lub zewnętrznego API token sesji trafiłby do `expo-secure-store`
(szyfrowany Keychain/Keystore), a klucze API do zmiennych środowiskowych - zgodnie
z OWASP Mobile Top 10 (M9: Insecure Data Storage).

## Struktura projektu

```
StudySprint2/
├── App.js                     # Punkt wejścia - SafeAreaProvider + nawigacja
├── src/
│   ├── context/AppDataContext.js  # Globalny stan (Context API): przedmioty/zadania/sesje
│   ├── navigation/AppNavigator.js # Bottom Tabs + Stack (Zadania → Szczegóły)
│   ├── screens/               # Home, Subjects, Tasks, TaskDetail, Timer, Stats
│   ├── components/            # TaskForm, ScreenStatus (loading/error), ErrorBoundary
│   ├── theme/index.js         # Design tokens: colors, spacing, radius, fontSize
│   ├── logic/                 # Czysta logika biznesowa (testowalna)
│   └── utils/                 # storage.js (AsyncStorage), notifications.js
├── scripts/generate-icons.js  # Generator własnych ikon (SVG → PNG)
└── __tests__/                 # Testy jednostkowe logiki
```

Logika biznesowa (walidacja, CRUD, filtrowanie, formatowanie czasu, statystyki)
jest wydzielona z komponentów do `src/logic/` - w pełni testowalna bez renderowania UI.
Globalne dane żyją w jednym `AppDataContext` (jedno źródło prawdy, zapis do AsyncStorage),
a stan lokalny (modale, pola formularzy, filtry, odliczanie timera) pozostaje w `useState`.

## Zrzuty ekranu

|                Główna                |                Przedmioty                 |              Zadania              |
| :----------------------------------: | :---------------------------------------: | :-------------------------------: |
| ![Główna](./screenshots/home.png) | ![Przedmioty](./screenshots/subjects.png) | ![Zadania](./screenshots/tasks.png) |

|              Timer              |              Statystyki              |
| :----------------------------: | :----------------------------------: |
| ![Timer](./screenshots/timer.png) | ![Statystyki](./screenshots/stats.png) |
