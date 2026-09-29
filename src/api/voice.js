// Voice input: records a clip, tries Speechmatics through the server
// proxy, drops back to the browser Web Speech API when keys are missing.
import { LANGS } from './assistant';

export async function transcribeWithServer(blob) {
  const fd = new FormData();
  fd.append('audio', blob, 'clip.webm');
  const r = await fetch('/api/transcribe', { method: 'POST', body: fd });
  if (!r.ok) throw new Error('server transcribe failed');
  return r.json(); // { text, lang }
}

export function transcribeWithBrowser(langHint = 'en') {
  return new Promise((resolve, reject) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return reject(new Error('no browser speech support'));
    const rec = new SR();
    rec.lang = LANGS[langHint] || 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => resolve({ text: e.results[0][0].transcript, lang: langHint });
    rec.onerror = (e) => reject(new Error(e.error || 'mic error'));
    rec.start();
    setTimeout(() => { try { rec.stop(); } catch { /* noop */ } }, 12000);
  });
}

export function recordClip(ms = 8000) {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: 'audio/webm' }));
      };
      rec.start();
      setTimeout(() => rec.state !== 'inactive' && rec.stop(), ms);
    } catch (e) { reject(e); }
  });
}
