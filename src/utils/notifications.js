import * as Notifications from "expo-notifications";

// DLACZEGO globalny handler: określa, jak system ma pokazać powiadomienie, gdy
// aplikacja jest na pierwszym planie (domyślnie byłoby ukryte). Ustawiamy raz
// przy imporcie modułu.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Prosi o zgodę na powiadomienia. Zwraca true, jeśli użytkownik ją wyraził.
 * DLACZEGO najpierw sprawdzamy istniejący status: by nie pokazywać systemowego
 * pytania ponownie, jeśli zgoda została już udzielona lub trwale odrzucona.
 */
export const requestNotificationPermission = async () => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

/**
 * Wysyła natychmiastowe lokalne powiadomienie. Bezpieczne do wywołania nawet
 * bez zgody — system po prostu go nie pokaże, więc nie trzeba dodatkowych
 * sprawdzeń w miejscu wywołania.
 */
export const sendLocalNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // null = pokaż od razu
    });
  } catch (e) {
    console.warn("notification error:", e);
  }
};
