import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Fade,
  Box,
  IconButton,
} from "@mui/material";
import { Person, Visibility, VisibilityOff, Lock } from "@mui/icons-material";

// Darker, more professional color scheme
const deepBlue = "#1e3a8a"; // Dark blue
const darkCoral = "#dc2626"; // Dark red/coral
const white = "#fff";
const softGray = "#f8fafc";

const LoginPage = ({ onLogin }) => {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoggingIn(true);
    setError(null);

    try {
      const response = await fetch(
        "https://4yjyazuj2j.execute-api.us-east-1.amazonaws.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officerId, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      setLoggingIn(false);
      onLogin(data);
    } catch (err) {
      setLoggingIn(false);
      setError(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={12}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 420 },
            p: { xs: 3, sm: 4 },
            background: white,
            borderRadius: { xs: 3, sm: 4 },
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Logo/Icon Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: { xs: 70, sm: 80 },
                height: { xs: 70, sm: 80 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(30, 58, 138, 0.3)",
              }}
            >
              <Person sx={{ fontSize: { xs: 36, sm: 42 }, color: white }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: deepBlue,
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Officer Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Enter your credentials to continue
          </Typography>

          <TextField
            label="Officer ID"
            fullWidth
            margin="normal"
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: deepBlue }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: softGray,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: white,
                  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.1)",
                },
                "&.Mui-focused": {
                  backgroundColor: white,
                  boxShadow: "0 4px 16px rgba(30, 58, 138, 0.2)",
                },
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: deepBlue }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: deepBlue }} />
                    ) : (
                      <Visibility sx={{ color: deepBlue }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: softGray,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: white,
                  boxShadow: "0 4px 12px rgba(30, 58, 138, 0.1)",
                },
                "&.Mui-focused": {
                  backgroundColor: white,
                  boxShadow: "0 4px 16px rgba(30, 58, 138, 0.2)",
                },
              },
            }}
          />

          {error && (
            <Fade in={!!error}>
              <Typography
                color="error"
                variant="body2"
                sx={{
                  mt: 2,
                  p: 1.5,
                  bgcolor: "#fee2e2",
                  borderRadius: 1,
                  fontSize: { xs: "0.813rem", sm: "0.875rem" },
                }}
              >
                {error}
              </Typography>
            </Fade>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loggingIn || !officerId || !password}
            sx={{
              mt: 3,
              background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
              color: white,
              fontWeight: 700,
              borderRadius: 2,
              padding: { xs: "12px", sm: "14px" },
              fontSize: { xs: "1rem", sm: "1.125rem" },
              textTransform: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 14px rgba(30, 58, 138, 0.4)",
              "&:hover": {
                background: `linear-gradient(135deg, ${darkCoral} 0%, ${deepBlue} 100%)`,
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(30, 58, 138, 0.5)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                background: "#94a3b8",
                color: white,
              },
            }}
          >
            {loggingIn ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: white }} />
                <span>Logging In...</span>
              </Box>
            ) : (
              "Sign In"
            )}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.75rem", sm: "0.813rem" },
              }}
            >
              Secure Authentication System v2.0
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;