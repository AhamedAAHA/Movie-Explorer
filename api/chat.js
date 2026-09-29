// Server proxy for AIML.io — keeps the key off the client.
// POST { text } -> { lang, genre, rating, surprise, reply }
const GENRES = { romance: 10749, comedy: 35, action: 28, horror: 27, scifi: 878, drama: 18, animation: 16, thriller: 53 };

const SYSTEM = `You are CineMate, a movie concierge inside a TMDb-powered app.
Reply with ONLY valid JSON, no markdown: {"lang":"en|si|ta","genre":"<tmdb genre id or empty>","rating":0,"surprise":false,"reply":"<short reply in the user's language>"}
Genre ids: romance 10749, comedy 35, action 28, horror 27, sci-fi 878, drama 18, animation 16, thriller 53.
User may write in English, Sinhala or Tamil. Match reply language to them.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.AIML_API_KEY;
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'missing text' });
  if (!key) return res.status(501).json({ error: 'AIML key not configured' });

  const model = process.env.AIML_MODEL || 'gpt-4o-mini';
  try {
    const r = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: String(text).slice(0, 500) }],
        temperature: 0.4, max_tokens: 220,
      }),
    });
    if (!r.ok) return res.status(502).json({ error: 'aiml upstream error' });
    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw.replace(/```json?|```/g, '').trim());
    return res.json({
      lang: ['si', 'ta', 'en'].includes(parsed.lang) ? parsed.lang : 'en',
      genre: parsed.genre ? String(parsed.genre) : '',
      rating: Number(parsed.rating) || 0,
      surprise: Boolean(parsed.surprise),
      reply: String(parsed.reply || 'Here are some picks 👇').slice(0, 300),
    });
  } catch (e) {
    return res.status(500).json({ error: 'brain failed' });
  }
};

module.exports.GENRES = GENRES;
