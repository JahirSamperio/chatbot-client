import React, { useState, useRef, useEffect } from 'react';
import { 
  TextField, Button, Box, Typography, CircularProgress, Paper, 
  ThemeProvider, createTheme, CssBaseline, IconButton
} from '@mui/material';
import { Send, CloudUpload } from '@mui/icons-material';
import { sendMessageToChatbot, uploadFile } from './api/actions/chatActions.js';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.06),0px 1px 1px 0px rgba(0,0,0,0.04),0px 1px 3px 0px rgba(0,0,0,0.02)",
    "0px 3px 3px -2px rgba(0,0,0,0.06),0px 2px 6px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.02)",
    ...Array(22).fill("none")
  ]
});

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await sendMessageToChatbot(message);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'user', message },
        { sender: 'bot', message: response.reply }
      ]);
      setMessage('');
    } catch (error) {
      setError('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      setError('');
      console.log(response);
      setChatHistory(prevHistory => [...prevHistory, { sender: 'bot', message: 'Archivo subido con éxito' }]);
    } catch (error) {
      setError('Error al cargar el archivo');
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.default',
        p: 2
      }}>
        <Paper elevation={2} sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          borderRadius: 3
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Chatbot 
            </Typography>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            bgcolor: 'background.default'
          }}>
            {chatHistory.map((entry, index) => (
              <Box key={index} sx={{ 
                display: 'flex',
                justifyContent: entry.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <Paper elevation={1} sx={{ 
                  p: 1.5,
                  maxWidth: '70%',
                  borderRadius: entry.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  bgcolor: entry.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: entry.sender === 'user' ? 'white' : 'text.primary',
                  boxShadow: theme.shadows[1]
                }}>
                  <Typography variant="body1">
                    {entry.message}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}>
            <form onSubmit={handleMessageSubmit} style={{ display: 'flex', gap: '8px' }}>
              <TextField
                fullWidth
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={handleMessageChange}
                disabled={loading}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    bgcolor: 'background.default'
                  }
                }}
              />
              <IconButton 
                type="submit"
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'action.disabledBackground' }
                }}
              >
                <Send />
              </IconButton>
              <IconButton
                component="label"
                disabled={loading}
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'secondary.dark' },
                  '&:disabled': { bgcolor: 'action.disabledBackground' }
                }}
              >
                <CloudUpload />
                <input 
                  type="file" 
                  hidden 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </IconButton>
            </form>

            {file && (
              <Box sx={{ 
                mt: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  {file.name}
                </Typography>
                <Button 
                  variant="contained"
                  size="small"
                  onClick={handleFileUpload}
                  disabled={loading}
                  sx={{
                    borderRadius: '15px',
                    textTransform: 'none'
                  }}
                >
                  Subir archivo
                </Button>
              </Box>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Chatbot;