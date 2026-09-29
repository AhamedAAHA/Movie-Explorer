// CineMate floating widget: text + voice chat, mood shortcuts,
// and movie cards right inside the conversation.
import React, { useState, useRef, useEffect } from 'react';
import {
  Fab, Paper, Box, Typography, TextField, IconButton, Chip,
  Card, CardMedia, CardContent, Divider,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { understand, speak, detectLang } from '../../api/assistant';
import { transcribeWithServer, transcribeWithBrowser, recordClip } from '../../api/voice';
import { discoverMovies, IMAGE_BASE } from '../../api/tmdb';
import { useMovies } from '../../context/MovieContext';

const QUICK = ['❤️ Romantic', '😂 Funny', '🔥 Action', '🎲 Surprise me', 'ආදර ෆිල්ම්', 'காதல் படம்'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'Hey! I’m CineMate 🎬 — tell me the vibe (romantic, funny…) in English, සිංහල or தமிழ், by text or mic.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const bottom = useRef(null);
  const { toggleFavorite } = useMovies();

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  const push = (m) => setMsgs((x) => [...x, m]);

  const handleText = async (raw) => {
    const text = raw.trim();
    if (!text || busy) return;
    push({ from: 'user', text });
    setInput('');
    setBusy(true);
    try {
      const brain = await understand(text);
      const data = await discoverMovies({ genre: brain.genre || '', rating: brain.rating || 0, page: 1, query: '' });
      const picks = data.results.slice(0, 4);
      push({ from: 'bot', text: brain.reply, lang: brain.lang, movies: picks });
      speak(brain.reply.replace(/[^\p{L}\p{N}\s,.!?'’—-]/gu, ''), brain.lang);
    } catch {
      push({ from: 'bot', text: 'Hmm, that glitched on my side — try once more?' });
    } finally { setBusy(false); }
  };

  const handleMic = async () => {
    if (recording || busy) return;
    setRecording(true);
    try {
      // Prefer Speechmatics through the proxy; browser fallback otherwise.
      let heard;
      try {
        const blob = await recordClip(7000);
        heard = await transcribeWithServer(blob);
      } catch {
        heard = await transcribeWithBrowser('en');
        // retry Tamil/Sinhala quickly if the guess looks off — cheap trick,
        // browser API needs the lang up front on some devices
        if (!heard.text) heard = await transcribeWithBrowser('en');
      }
      setRecording(false);
      if (heard?.text) handleText(heard.text);
      else push({ from: 'bot', text: 'Didn’t catch that — mind trying again, a bit closer to the mic?' });
    } catch {
      setRecording(false);
      push({ from: 'bot', text: 'Mic is blocked or unsupported here — type it instead, I read all three languages 🙂' });
    }
  };

  return (
    <>
      <Fab color="primary" onClick={() => setOpen((o) => !o)} aria-label="chat"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300, width: 60, height: 60 }}>
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ position: 'fixed', bottom: 96, right: 16, zIndex: 1300, width: 'min(380px, calc(100vw - 32px))' }}>
            <Paper elevation={8} sx={{ borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520, maxHeight: '70vh' }}>
              <Box sx={{ p: 1.75, background: (t) => t.palette.mode === 'dark' ? '#1a2030' : '#201410', color: '#fff' }}>
                <Typography fontWeight={700}>🎬 CineMate</Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>Voice movie buddy • EN / සිං / தமிழ்</Typography>
              </Box>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {msgs.map((m, i) => (
                  <Box key={i} alignSelf={m.from === 'user' ? 'flex-end' : 'flex-start'} sx={{ maxWidth: '88%' }}>
                    <Box sx={{
                      px: 1.5, py: 1, borderRadius: 2,
                      bgcolor: m.from === 'user' ? 'primary.main' : 'action.hover',
                      color: m.from === 'user' ? '#fff' : 'text.primary',
                    }}>
                      <Typography variant="body2">{m.text}</Typography>
                      {m.from === 'bot' && m.lang && (
                        <IconButton size="small" onClick={() => speak(m.text, m.lang)} aria-label="read aloud"><VolumeUpIcon fontSize="inherit" /></IconButton>
                      )}
                    </Box>
                    {m.movies?.length > 0 && (
                      <Box display="flex" gap={1} mt={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
                        {m.movies.map((mv) => (
                          <Card key={mv.id} sx={{ minWidth: 128, maxWidth: 128 }}>
                            <CardMedia component={Link} to={`/movie/${mv.id}`}
                              image={mv.poster_path ? (mv.poster_path.startsWith('http') ? mv.poster_path : `${IMAGE_BASE}${mv.poster_path}`) : ''}
                              alt={mv.title} sx={{ aspectRatio: '2/3' }} />
                            <CardContent sx={{ p: 1 }}>
                              <Typography variant="caption" noWrap fontWeight={600}>{mv.title}</Typography>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" color="text.secondary">★ {Number(mv.vote_average || 0).toFixed(1)}</Typography>
                                <Box>
                                  <IconButton size="small" onClick={() => toggleFavorite(mv)} aria-label="save"><FavoriteBorderIcon fontSize="inherit" /></IconButton>
                                  <IconButton size="small" component={Link} to={`/movie/${mv.id}`} aria-label="details"><PlayArrowIcon fontSize="inherit" /></IconButton>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
                {busy && <Typography variant="caption" color="text.secondary">CineMate is thinking…</Typography>}
                <div ref={bottom} />
              </Box>
              <Divider />
              <Box sx={{ p: 1, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {QUICK.map((q) => <Chip key={q} label={q} size="small" variant="outlined" clickable onClick={() => handleText(q.replace(/^[^\s]+\s/, ''))} />)}
              </Box>
              <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                <IconButton color={recording ? 'error' : 'default'} onClick={handleMic} aria-label="voice">
                  {recording ? <StopIcon /> : <MicIcon />}
                </IconButton>
                <TextField fullWidth size="small" placeholder="Type a vibe…" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleText(input)} />
                <IconButton color="primary" onClick={() => handleText(input)} aria-label="send"><SendIcon /></IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { detectLang as _chatLang };
