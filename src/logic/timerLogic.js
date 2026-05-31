// Czyste, bezstanowe pomocniki timera. Zapis sesji przeniesiono do globalnego
// stanu (AppDataContext.addSession), więc ten moduł nie dotyka już storage.
export const STUDY_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export const formatTime = (seconds) => ({
  minutes: String(Math.floor(seconds / 60)).padStart(2, "0"),
  secs: String(seconds % 60).padStart(2, "0"),
});
