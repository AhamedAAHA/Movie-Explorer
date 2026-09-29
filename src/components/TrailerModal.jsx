// YouTube trailer dialog (uses TMDb videos → YouTube embed; no extra API key).
import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function TrailerModal({ open, onClose, youtubeKey, title }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title} — Trailer
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        {youtubeKey ? (
          <Box sx={{ aspectRatio: '16/9' }}>
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${youtubeKey}`}
              title="trailer" allowFullScreen style={{ border: 0 }} />
          </Box>
        ) : <p>No trailer available.</p>}
      </DialogContent>
    </Dialog>
  );
}
