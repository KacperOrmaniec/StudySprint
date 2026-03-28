export const calcTotalSessions = (sessions) => sessions.length;

export const calcTotalMinutes = (sessions) =>
  sessions.reduce((sum, s) => sum + (s.duration || 25), 0);

export const calcDoneTasks = (tasks) => tasks.filter((t) => t.done).length;

export const calcSubjectStats = (subjects, tasks) =>
  subjects.map((s) => ({
    id: s.id,
    name: s.name,
    done: tasks.filter((t) => t.subjectId === s.id && t.done).length,
    total: tasks.filter((t) => t.subjectId === s.id).length,
  }));
