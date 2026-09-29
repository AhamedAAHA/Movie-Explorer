// Server proxy for Speechmatics batch STT. Receives an audio clip,
// returns { text, lang } where lang is one of si / ta / en.
// Needs SPEECHMATICS_API_KEY on the server (never shipped to browsers).
const LANGS = ['si', 'ta', 'en'];

function guessLang(transcript, alt) {
  if (/[\u0D80-\u0DFF]/.test(transcript)) return 'si';
  if (/[\u0B80-\u0BFF]/.test(transcript)) return 'ta';
  return alt || 'en';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.SPEECHMATICS_API_KEY;
  if (!key) return res.status(501).json({ error: 'Speechmatics key not configured' });

  // Vercel parses multipart only with a helper; accept raw body as fallback.
  // Client sends FormData audio OR base64 JSON { audioBase64 }.
  try {
    let audioBuffer = null;
    let langHint = 'en';
    if (req.body?.audioBase64) {
      audioBuffer = Buffer.from(req.body.audioBase64, 'base64');
      langHint = req.body.langHint || 'en';
    } else if (Buffer.isBuffer(req.body)) {
      audioBuffer = req.body;
    }
    if (!audioBuffer) return res.status(400).json({ error: 'no audio received' });

    // Speechmatics batch: create job, upload, wait, fetch transcript.
    const lang = LANGS.includes(langHint) ? langHint : 'en';
    const config = {
      type: 'transcription',
      transcription_config: { language: lang === 'en' ? 'en' : lang, operating_point: 'enhanced' },
    };
    const fd = new FormData();
    fd.append('config', JSON.stringify(config));
    fd.append('data_file', new Blob([audioBuffer]), 'clip.webm');

    const create = await fetch('https://asr.api.speechmatics.com/v2/jobs/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: fd,
    });
    if (!create.ok) return res.status(502).json({ error: 'speechmatics job failed' });
    const { id } = await create.json();

    let transcript = '';
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const job = await fetch(`https://asr.api.speechmatics.com/v2/jobs/${id}/transcript`, {
        headers: { Authorization: `Bearer ${key}` },
      }).then((r) => r.json());
      if (job?.results?.length) {
        transcript = job.results.map((x) => x.alternatives?.[0]?.content || '').join(' ');
        break;
      }
    }
    return res.json({ text: transcript.trim(), lang: guessLang(transcript, lang) });
  } catch (e) {
    return res.status(500).json({ error: 'transcribe failed' });
  }
};
