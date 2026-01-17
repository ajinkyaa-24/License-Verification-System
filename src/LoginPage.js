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

// Color scheme
const deepBlue = "#1e3a8a";
const darkCoral = "#dc2626";
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
        `${process.env.REACT_APP_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
          body: JSON.stringify({
            officerId: officerId.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid Officer ID or Password");
      }

      const data = await response.json();
      onLogin(data);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${deepBlue}, ${darkCoral})`,
        px: { xs: 1.5, sm: 0 }, // mobile side padding
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={12}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 420 }, // ✅ mobile friendly
            p: { xs: 2.5, sm: 4 },              // ✅ less padding on mobile
            borderRadius: { xs: 3, sm: 4 },
            background: white,
          }}
        >
          {/* Icon */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${deepBlue}, ${darkCoral})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person
                sx={{ fontSize: { xs: 32, sm: 42 }, color: white }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            align="center"
            sx={{
              color: deepBlue,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", sm: "2.1rem" }, // ✅ responsive font
            }}
          >
            Officer Login
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "text.secondary",
              mb: 3,
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            Enter your credentials to continue
          </Typography>

          {/* Officer ID */}
          <TextField
            label="Officer ID"
            fullWidth
            value={officerId}
            onChange={(e) => setOfficerId(e.target.value)}
            onKeyPress={handleKeyPress}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: deepBlue }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: softGray,
                borderRadius: 2,
              },
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: deepBlue }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: softGray,
                borderRadius: 2,
              },
            }}
          />

          {error && (
            <Typography
              color="error"
              sx={{
                mt: 1.5,
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              {error}
            </Typography>
          )}

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            disabled={loggingIn || !officerId || !password}
            onClick={handleLogin}
            sx={{
              mt: 3,
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${deepBlue}, ${darkCoral})`,
            }}
          >
            {loggingIn ? (
              <>
                <CircularProgress size={20} sx={{ color: white, mr: 1 }} />
                Logging In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <Typography
            align="center"
            sx={{
              mt: 3,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              color: "text.secondary",
            }}
          >
            Secure Authentication System v2.0
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
