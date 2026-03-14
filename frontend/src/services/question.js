const API_BASE = "http://localhost:5000/api"; // your backend base URL

export const fetchRandomQuestions = async (
  token,
  type,
  difficulty,
  topic,
  count = 5
) => {
  const res = await fetch(
    `${API_BASE}/questions/random?type=${type}&difficulty=${difficulty}&topic=${topic}&count=${count}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
};
export const addQuestion = async (token, question) => {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(question),
  });

  if (!res.ok) {
    throw new Error("Failed to add question");
  }

  return res.json();
};
