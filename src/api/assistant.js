// CineMate brain: detects Sinhala / Tamil / English, figures out the
// mood, and turns it into TMDb search params. Tries the server proxy
// (AIML.io) first, falls back to a local keyword brain so the demo
// never breaks without keys.

export const LANGS = { si: 'si-LK', ta: 'ta-LK', en: 'en-US' };

export function detectLang(text) {
  if (/[\u0D80-\u0DFF]/.test(text)) return 'si';
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  return 'en';
}

// mood words in all three languages -> TMDb genre ids
const MOODS = [
  { ids: [10749], words: ['romantic', 'romance', 'love', 'ආදර', 'காதல்', 'காதல்', 'kadhal'] },
  { ids: [35], words: ['funny', 'comedy', 'laugh', 'fun', 'සිනා', 'வேடிக்கை', 'comedy'] },
  { ids: [28], words: ['action', 'fight', 'adventure', 'සටන්', 'சண்டை', 'action'] },
  { ids: [27], words: ['horror', 'scary', 'ghost', 'බය', 'பயம்', 'horror', 'peyi'] },
  { ids: [878], words: ['sci-fi', 'scifi', 'space', 'future', 'අභ්‍යවකාශ', 'விண்வெளி'] },
  { ids: [18], words: ['drama', 'emotional', 'serious', 'සංවේදී', 'உணர்ச்சி'] },
  { ids: [16], words: ['cartoon', 'animation', 'anime', 'kids', 'ළමා', 'குழந்தை'] },
  { ids: [53], words: ['thriller', 'suspense', 'mystery', 'ත්‍රාස', 'மர்மம்'] },
];

const RATING_WORDS = ['best', 'top', 'highly rated', 'හොඳම', 'சிறந்த'];

export function localBrain(text) {
  const lang = detectLang(text);
  const lower = text.toLowerCase();
  let genre = '';
  for (const m of MOODS) {
    if (m.words.some((w) => lower.includes(w.toLowerCase()))) { genre = String(m.ids[0]); break; }
  }
  const rating = RATING_WORDS.some((w) => lower.includes(w)) ? 7 : 0;
  const surprise = /surprise|random|anything|අහඹු|ஆச்சரியம்/.test(lower);
  if (surprise && !genre) genre = String([10749, 35, 28, 878][Math.floor(Math.random() * 4)]);
  const reply = replyFor(lang, genre, surprise);
  return { lang, genre, rating, surprise, reply };
}

function genreName(id, lang) {
  const names = {
    10749: { en: 'romantic', si: 'ආදර', ta: 'காதல்' },
    35: { en: 'funny', si: 'සිනාසෙන', ta: 'வேடிக்கையான' },
    28: { en: 'action-packed', si: 'සටන්කාමී', ta: 'அதிரடி' },
    27: { en: 'spooky', si: 'බයහිතෙන', ta: 'பயமான' },
    878: { en: 'sci-fi', si: 'විද්‍යා-ප්‍රබන්ධ', ta: 'அறிவியல்' },
    18: { en: 'emotional', si: 'සංවේදී', ta: 'உணர்ச்சிகரமான' },
    16: { en: 'animated', si: 'සජීවිකරණ', ta: 'அனிமேஷன்' },
    53: { en: 'thrilling', si: 'ත්‍රාසජනක', ta: 'திரில்' },
  };
  return (names[id] || { en: 'great', si: 'හොඳ', ta: 'நல்ல' })[lang];
}

function replyFor(lang, genre, surprise) {
  const g = genre ? genreName(Number(genre), lang) : null;
  if (lang === 'si') return surprise ? 'හරි, මම ඔයාට අහඹු ෆිල්ම් ටිකක් හොයලා දෙන්නම්! 🎲' : g ? `හරි! ${g} ෆිල්ම් ටිකක් මෙන්න — ඔයාට සෙට් වෙන එකක් බලන්න 👇` : 'කියන්න, මොන වගේ ෆිල්ම් එකක්ද ඕනේ? (ආදර, සිනා, සටන්… )';
  if (lang === 'ta') return surprise ? 'சரி, உங்களுக்கு சில சர்ப்ரைஸ் படங்களை கண்டுபிடிக்கிறேன்! 🎲' : g ? `சரி! ${g} படங்கள் இதோ — பிடித்ததை பாருங்கள் 👇` : 'சொல்லுங்கள், என்ன மாதிரி படம் வேண்டும்? (காதல், வேடிக்கை, அதிரடி…)';
  return surprise ? 'On it — pulling some surprise picks for you! 🎲' : g ? `Got you — here are some ${g} picks 👇` : 'Tell me the vibe — romantic, funny, action…?';
}

// Ask the server proxy (AIML.io). Returns null when not configured.
export async function serverBrain(text) {
  try {
    const r = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

export async function understand(text) {
  const server = await serverBrain(text);
  if (server && server.genre !== undefined) return server;
  return localBrain(text);
}

// Speak a reply out loud in the right language. Free, browser built-in.
export function speak(text, lang) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[lang] || 'en-US';
    const voices = synth.getVoices();
    const v = voices.find((x) => x.lang?.startsWith(LANGS[lang]?.slice(0, 2))) || voices.find((x) => x.lang?.startsWith('en'));
    if (v) u.voice = v;
    synth.speak(u);
  } catch { /* voice is best-effort */ }
}
