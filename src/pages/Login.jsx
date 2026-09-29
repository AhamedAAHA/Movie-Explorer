// Full-screen movie backdrop with the login card floating over it
// like a popup. Backdrop is picked live from trending so it never
// goes stale; falls back to a still while that loads.
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, useTheme, InputAdornment, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MovieIcon from '@mui/icons-material/Movie';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTrending, discoverMovies } from '../api/tmdb';

const FALLBACK_DARK = 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg';
const FALLBACK_LIGHT = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [backdrop, setBackdrop] = useState(FALLBACK_DARK);
  const theme = useTheme();
  const light = theme.palette.mode === 'light';

  // dark pulls a moody trending still, light pulls a bright animated
  // one so the whole page feels like a matinee poster
  useEffect(() => {
    const load = light
      ? discoverMovies({ genre: '16', rating: 0, page: 1, query: '' })
      : fetchTrending(1);
    load.then((d) => {
      const withBg = (d.results || []).filter((m) => m.backdrop_path);
      if (withBg.length) {
        const pick = withBg[Math.floor(Math.random() * Math.min(withBg.length, 8))];
        setBackdrop(`https://image.tmdb.org/t/p/original${pick.backdrop_path}`);
      } else {
        setBackdrop(light ? FALLBACK_LIGHT : FALLBACK_DARK);
      }
    }).catch(() => setBackdrop(light ? FALLBACK_LIGHT : FALLBACK_DARK));
  }, [light]);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (tab === 0) await login(email, password);
      else await register(email, password);
      nav(loc.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', py: 5 }}>
      {/* entire-screen movie thumbnail */}
      <Box key={backdrop} className="kenburns" sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${backdrop})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%',
      }} />
      <Box sx={{
        position: 'absolute', inset: 0,
        background: (t) => t.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(5,6,10,0.55), rgba(5,6,10,0.82))'
          : 'linear-gradient(180deg, rgba(250,246,239,0.55), rgba(250,246,239,0.88))',
        backdropFilter: 'blur(2px)',
      }} />
      {/* popup card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{ position: 'relative', width: 'min(430px, calc(100vw - 32px))' }}
      >
        <Card sx={{
          overflow: 'hidden',
          borderRadius: 5,
          backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(18,22,34,0.82)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(22px)',
          border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: (t) => t.palette.mode === 'dark' ? '0 30px 80px rgba(0,0,0,0.55)' : '0 30px 70px rgba(120,70,20,0.28)',
        }}>
          {/* gold hairline on top */}
          <Box sx={{ height: 4, background: 'linear-gradient(90deg,#7c5cff,#e8b34b,#b3261e)' }} />
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Box sx={{
                width: 46, height: 46, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg,#e8b34b,#b3261e)', boxShadow: '0 8px 22px rgba(232,179,75,0.4)',
              }}>
                <MovieIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" lineHeight={1.1}>{tab === 0 ? 'Welcome back' : 'Join the show'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tab === 0 ? 'Pick up right where you left off.' : 'One account, endless movies.'}
                </Typography>
              </Box>
            </Box>

            {/* pill switch instead of plain tabs */}
            <Box sx={{ display: 'flex', p: 0.5, borderRadius: 3, bgcolor: 'action.hover', mt: 2, mb: 2.5 }}>
              {['Login', 'Register'].map((label, i) => (
                <Box key={label} onClick={() => { setTab(i); setError(''); }}
                  sx={{
                    flex: 1, textAlign: 'center', py: 1, borderRadius: 2.5, cursor: 'pointer',
                    fontWeight: 600, fontSize: 14, transition: 'all .25s',
                    ...(tab === i
                      ? { bgcolor: 'background.paper', boxShadow: 2, color: 'text.primary' }
                      : { color: 'text.secondary' }),
                  }}>
                  {label}
                </Box>
              ))}
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: [0, -8, 8, -4, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
              <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><MailOutlinedIcon fontSize="small" /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField label="Password" type={showPw ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)} helperText="At least 6 characters"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" size="small" onClick={() => setShowPw((s) => !s)} aria-label="show password">
                        {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <motion.span whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <Button type="submit" variant="contained" size="large" fullWidth endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 2.5, py: 1.4, fontWeight: 700, textTransform: 'none', fontSize: 16,
                    background: 'linear-gradient(135deg,#e8b34b,#d24a2e)',
                    '&:hover': { background: 'linear-gradient(135deg,#f2c55e,#d24a2e)' },
                  }}>
                  {tab === 0 ? 'Log in' : 'Create account'}
                </Button>
              </motion.span>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2.5}>
              Tip: after logging in, ask CineMate 🎬 for picks in English, සිංහල or தமிழ்.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
