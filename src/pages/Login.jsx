// Split login: poster art on the left, form on the right.
// Same component handles register through the tabs.
import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Alert, Tabs, Tab, Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ART = 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (tab === 0) await login(email, password);
      else await register(email, password);
      nav(loc.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card sx={{ overflow: 'hidden' }}>
          <Grid container>
            <Grid item xs={12} sm={5} sx={{
              minHeight: 320,
              backgroundImage: `url(${ART})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              position: 'relative', display: { xs: 'none', sm: 'block' },
            }}>
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.75))' }} />
              <Box sx={{ position: 'absolute', bottom: 0, p: 3 }}>
                <Typography variant="h6" color="#fff">Find your next favorite film.</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.75)">Trending, search and a voice buddy that speaks your language.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Movie Explorer</Typography>
                <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} sx={{ mb: 2 }}>
                  <Tab label="Login" /><Tab label="Register" />
                </Tabs>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
                  <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} helperText="At least 6 characters" />
                  <Button type="submit" variant="contained" size="large">{tab === 0 ? 'Login' : 'Create account'}</Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </motion.div>
    </Container>
  );
}
