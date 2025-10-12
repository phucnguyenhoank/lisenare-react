const BACKEND_URL = "http://192.168.73.230:8000";

export async function fetchExercises() {
  try {
    const response = await fetch(`${BACKEND_URL}/exercises/`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exercises: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
