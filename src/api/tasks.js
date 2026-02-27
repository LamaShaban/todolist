const KEY = 'tasks';

export async function fetchTasks() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks));
  return true;
}
