// src/api/interaction.js
export async function logInteraction(payload) {
  // Replace with your real endpoint
  const res = await fetch("/api/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to log interaction");
}