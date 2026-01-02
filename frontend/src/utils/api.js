const BASE_URL = import.meta.env.VITE_API_URL;

export async function getActivities() {
  const res = await fetch(`${API_URL}/api/activities`);
  if (!res.ok) {
    throw new Error("Failed to fetch activities");
  }
  return res.json();
}

export async function createActivity(activity) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });

  if (!res.ok) {
    throw new Error("Failed to create activity");
  }

  return res.json();
}
