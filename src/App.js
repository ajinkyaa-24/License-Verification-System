import React, { useRef, useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import Webcam from "react-webcam";

import {
  AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem,
  Container, Button, Box, Card, CardContent, CircularProgress, Fade, Slide, Paper,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Switch, FormControlLabel, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";

import {
  MoreVert, Logout, Settings, RestartAlt, CheckCircleOutline,
  CameraAlt, Info, History, Help, Security, Person, LocationOn, Badge
} from "@mui/icons-material";

// Darker, more professional color scheme
const deepBlue = "#1e3a8a";
const darkCoral = "#dc2626";
const white = "#fff";
const lightGray = "#f1f5f9";
const darkGray = "#64748b";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_URL = "https://xemb7jp8m1.execute-api.us-east-1.amazonaws.com/dev/verify";

// Splash Screen Component
function SplashScreen({ onFinish }) {
  const [show, setShow] = useState(true);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setScale(1);
      setOpacity(1);
    }, 100);

    const timer = setTimeout(() => {
      setScale(1.2);
      setOpacity(0);
      setTimeout(() => {
        setShow(false);
        onFinish();
      }, 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        opacity: opacity,
        transition: "opacity 0.5s ease",
      }}
    >
      <Box
        sx={{
          transform: `scale(${scale})`,
          transition: "transform 0.5s ease",
          textAlign: "center",
        }}
      >
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              width: { xs: 80, sm: 120 },
              height: { xs: 80, sm: 120 },
              borderRadius: "50%",
              backgroundColor: white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <Security
              sx={{
                fontSize: { xs: 40, sm: 64 },
                color: deepBlue,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
          </Box>
        </Fade>
        <Typography
          variant="h3"
          sx={{
            color: white,
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "3rem" },
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            letterSpacing: "2px",
          }}
        >
          MAHAVERIFY
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: white,
            fontWeight: 600,
            mt: 2,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          License Verification System
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: white,
            mt: 1,
            opacity: 0.8,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          Secure Identity Verification
        </Typography>
      </Box>
      <Box sx={{ display: "flex", mt: 4, gap: 1 }}>
        {[0, 1, 2].map((dot) => (
          <Box
            key={dot}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: white,
              opacity: 0.6,
              animation: "bounce 1.4s ease-in-out infinite",
              animationDelay: `${dot * 0.3}s`,
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "translateY(0)" },
                "40%": { transform: "translateY(-10px)" },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [officer, setOfficer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuEl, setMenuEl] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [settings, setSettings] = useState({
    autoCapture: false,
    soundEnabled: true,
    highQuality: true,
    notifications: true,
  });

  const webcamRef = useRef();

  const handleSplashFinish = () => setShowSplash(false);

  const handleProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handle3DotMenu = (e) => setMenuEl(e.currentTarget);
  const handle3DotClose = () => setMenuEl(null);

  const handleStartVerification = () => {
    setCameraActive(true);
    setShowResult(false);
    setResult(null);
    setImageSrc(null);
  };

  const handleCapture = () => {
    setShowResult(false);
    const img = webcamRef.current.getScreenshot();
    setImageSrc(img);
    if (settings.soundEnabled) {
      // const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi87OefTRAMUKfj8LZjHAY4ktfvzXksBSR2yPDajkELE2a36Oinb');
    }
  };

  const handleVerify = async () => {
    setSending(true);
    setShowResult(false);
    setResult(null);
    if (!imageSrc) {
      setResult({ message: "Please capture a photo first." });
      setSending(false);
      setShowResult(true);
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          live_image_base64: imageSrc.split(",")[1],
          source_bucket: "face-recogonization"
        }),
      });
      const response = await res.json();
      let data;
      if (typeof response.body === 'string') {
        data = JSON.parse(response.body);
      } else if (response.body) {
        data = response.body;
      } else {
        data = response;
      }
      setResult(data);
      const historyEntry = {
        timestamp: new Date().toLocaleString(),
        result: data.message === "Face matched" ? "Match" : "No Match",
        similarity: data.Similarity || "N/A",
        matchedImage: data.MatchedImage || "N/A"
      };
      setVerificationHistory(prev => [historyEntry, ...prev].slice(0, 20));
    } catch (error) {
      setResult({ message: "Network error or server unavailable" });
    }
    setSending(false);
    setShowResult(true);
  };

  const handleReset = () => {
    setImageSrc(null);
    setShowResult(false);
    setResult(null);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
    setImageSrc(null);
    setShowResult(false);
    setResult(null);
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} />;
  if (!officer) return <LoginPage onLogin={setOfficer} />;

  return (
    <Box bgcolor={lightGray} minHeight="100vh">
      {/* AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Avatar sx={{ bgcolor: white, color: deepBlue, marginRight: 2, width: 40, height: 40 }}>
            <Security />
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{
              flexGrow: 1,
              color: white,
              fontWeight: 700,
              fontSize: { xs: "1.1rem", sm: "1.25rem" }
            }}
          >
            MAHAVERIFY
          </Typography>
          <Chip
            icon={<Badge sx={{ color: white, fontSize: 18 }} />}
            label={officer?.station || "Station"}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: white,
              fontWeight: 600,
              mr: 1.5,
              fontSize: { xs: "0.813rem", sm: "0.875rem" },
              backdropFilter: "blur(10px)",
            }}
          />
          <IconButton onClick={handleProfileMenu}>
            <Avatar sx={{ bgcolor: white, color: deepBlue, fontWeight: 700, width: 36, height: 36 }}>
              {officer?.officerName?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ 
              sx: { 
                minWidth: 250, 
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
              } 
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: lightGray }}>
              <Typography variant="caption" color="text.secondary">Logged in as</Typography>
              <Typography variant="h6" sx={{ color: deepBlue, fontWeight: 700, fontSize: "1.125rem" }}>
                {officer?.officerName}
              </Typography>
            </Box>
            <Divider />
            <MenuItem sx={{ py: 1.5 }}>
              <Person fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>Officer ID</Typography>
                <Typography variant="caption" color="text.secondary">{officer?.officerId}</Typography>
              </Box>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <LocationOn fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>Station</Typography>
                <Typography variant="caption" color="text.secondary">{officer?.station}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => window.location.reload()} sx={{ py: 1.5 }}>
              <Logout fontSize="small" sx={{ color: darkCoral, mr: 1.5 }} />
              <Typography color="error" fontWeight={600}>Logout</Typography>
            </MenuItem>
          </Menu>
          <IconButton onClick={handle3DotMenu} sx={{ color: white, ml: 1 }}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={menuEl}
            open={Boolean(menuEl)}
            onClose={handle3DotClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ 
              sx: { 
                minWidth: 220, 
                mt: 1,
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
              } 
            }}
          >
            <MenuItem onClick={() => { setSettingsOpen(true); handle3DotClose(); }} sx={{ py: 1.5 }}>
              <Settings fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} /> 
              <Typography fontWeight={500}>Settings</Typography>
            </MenuItem>
            <MenuItem onClick={() => { setHistoryOpen(true); handle3DotClose(); }} sx={{ py: 1.5 }}>
              <History fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} /> 
              <Typography fontWeight={500}>Verification History</Typography>
            </MenuItem>
            <MenuItem onClick={() => { setAboutOpen(true); handle3DotClose(); }} sx={{ py: 1.5 }}>
              <Info fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} /> 
              <Typography fontWeight={500}>About System</Typography>
            </MenuItem>
            <MenuItem sx={{ py: 1.5 }}>
              <Help fontSize="small" sx={{ color: deepBlue, mr: 1.5 }} /> 
              <Typography fontWeight={500}>Help & Support</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2 } }}>
        {!cameraActive ? (
          <Fade in={!cameraActive} timeout={800}>
            <Box>
              {/* Main Welcome Card */}
              <Card 
                elevation={0}
                sx={{
                  bgcolor: white,
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${lightGray}`,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box sx={{
                  background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
                  py: { xs: 4, sm: 5 },
                  textAlign: "center"
                }}>
                  <CameraAlt sx={{
                    fontSize: { xs: 48, sm: 64 },
                    color: white,
                    mb: 2,
                  }} />
                  <Typography variant="h4" sx={{
                    color: white,
                    fontWeight: 700,
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    mb: 1
                  }}>
                    License Verification System
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: white,
                    opacity: 0.95,
                    fontSize: { xs: "0.938rem", sm: "1rem" }
                  }}>
                    Secure and fast identity verification
                  </Typography>
                </Box>
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                  <Grid container spacing={12}>
                    {[
                      { num: 1, title: "Start Verification", desc: "Click the button below" },
                      { num: 2, title: "Capture Photo", desc: "Take a clear photo" },
                      { num: 3, title: "Get Results", desc: "Instant verification" }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={4} key={item.num}>
                        <Fade in={true} timeout={800 + index * 200}>
                          <Box sx={{ textAlign: "center", p: 4 }}>
                            <Box sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              bgcolor: lightGray,
                              border: `3px solid ${deepBlue}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 12px",
                              fontWeight: 700,
                              fontSize: 22,
                              color: deepBlue,
                            }}>
                              {item.num}
                            </Box>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: "1rem" }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                              {item.desc}
                            </Typography>
                          </Box>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CameraAlt />}
                      onClick={handleStartVerification}
                      sx={{
                        background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
                        color: white,
                        fontWeight: 700,
                        px: { xs: 3, sm: 5 },
                        py: { xs: 1.5, sm: 1.75 },
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 4px 14px rgba(30, 58, 138, 0.3)",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${darkCoral} 0%, ${deepBlue} 100%)`,
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(30, 58, 138, 0.4)",
                        },
                      }}
                    >
                      Start Verification
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Feature Cards */}
              <Grid container spacing={3}>
                {[
                  { icon: <Security sx={{ fontSize: 40, color: deepBlue }} />, title: "Secure", desc: "End-to-end encrypted" },
                  { icon: <CheckCircleOutline sx={{ fontSize: 40, color: deepBlue }} />, title: "Accurate", desc: "Advanced AI Detection" },
                  { icon: <History sx={{ fontSize: 40, color: deepBlue }} />, title: "Fast", desc: "Results in seconds" }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={4} key={feature.title}>
                    <Fade in={true} timeout={800 + index * 200}>
                      <Card 
                        elevation={0}
                        sx={{
                          textAlign: "center",
                          p: { xs: 2.5, sm: 8 },
                          bgcolor: white,
                          borderRadius: 2,
                          height: "55%",
                          border: `1px solid ${lightGray}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                          }
                        }}
                      >
                        <Box sx={{ mb: 1.5 }}>{feature.icon}</Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.125rem" }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                          {feature.desc}
                        </Typography>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Fade in={cameraActive} timeout={800}>
            <Card 
              elevation={0}
              sx={{
                bgcolor: white,
                borderRadius: 3,
                border: `1px solid ${lightGray}`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h5" sx={{
                    color: deepBlue,
                    fontWeight: 700,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" }
                  }}>
                    Face Verification
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleStopCamera} 
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", sm: "0.938rem" }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                {!imageSrc ? (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Box sx={{
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      border: `3px solid ${deepBlue}`,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      mb: 3,
                      width: "100%",
                      maxWidth: 640,
                    }}>
                      <Webcam
                        audio={false}
                        height={window.innerWidth < 600 ? 320 : 480}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        videoConstraints={videoConstraints}
                        style={{ display: "block", width: "100%" }}
                      />
                      <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "70%", sm: "60%" },
                        height: { xs: "70%", sm: "75%" },
                        border: `3px dashed ${darkCoral}`,
                        borderRadius: "50%",
                        pointerEvents: "none"
                      }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center", fontWeight: 500 }}>
                      Position the face within the oval guide
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CameraAlt />}
                      onClick={handleCapture}
                      sx={{
                        background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
                        color: white,
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                        boxShadow: "0 4px 14px rgba(30, 58, 138, 0.3)",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          background: `linear-gradient(135deg, ${darkCoral} 0%, ${deepBlue} 100%)`,
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(30, 58, 138, 0.4)"
                        },
                      }}
                    >
                      Capture Photo
                    </Button>
                  </Box>
                ) : (
                  <Fade in={!!imageSrc} timeout={300}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Box sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        border: `3px solid ${deepBlue}`,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        mb: 3,
                        width: "100%",
                        maxWidth: 400,
                      }}>
                        <img src={imageSrc} alt="Captured" style={{ display: "block", width: "100%" }} />
                      </Box>
                      <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }} width="100%" maxWidth={400}>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<RestartAlt />}
                          onClick={handleReset}
                          sx={{
                            color: deepBlue,
                            borderColor: deepBlue,
                            fontWeight: 700,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            flex: 1,
                            "&:hover": {
                              borderColor: deepBlue,
                              bgcolor: "rgba(30, 58, 138, 0.05)",
                            }
                          }}
                        >
                          Retake
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<CheckCircleOutline />}
                          disabled={sending}
                          onClick={handleVerify}
                          sx={{
                            background: `linear-gradient(135deg, ${deepBlue} 0%, ${darkCoral} 100%)`,
                            color: white,
                            fontWeight: 700,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            flex: 1,
                            boxShadow: "0 4px 14px rgba(30, 58, 138, 0.3)",
                            "&:hover": {
                              background: `linear-gradient(135deg, ${darkCoral} 0%, ${deepBlue} 100%)`,
                            },
                            "&:disabled": {
                              background: darkGray,
                              color: white,
                            }
                          }}
                        >
                          {sending ? "Verifying..." : "Verify Identity"}
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                )}
                <Box mt={4}>
                  <Slide direction="up" in={showResult} mountOnEnter unmountOnExit timeout={600}>
                    <Paper 
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, sm: 3 },
                        background: lightGray,
                        borderRadius: 2,
                        border: `2px solid ${deepBlue}`,
                      }}
                    >
                      {sending ? (
                        <Box sx={{ textAlign: "center", py: 3 }}>
                          <CircularProgress sx={{ color: deepBlue, mb: 2 }} size={48} />
                          <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Verifying identity...
                          </Typography>
                        </Box>
                      ) : result ? (
                        result.message === "Face matched" ? (
                          <Fade in={true} timeout={600}>
                            <Box sx={{ textAlign: "center" }}>
                              <CheckCircleOutline sx={{ fontSize: 64, color: "#16a34a", mb: 2 }} />
                              <Typography variant="h5" sx={{ color: "#16a34a", fontWeight: 700, mb: 3, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                                Face Matched Successfully
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="h6" gutterBottom sx={{ color: deepBlue, fontWeight: 700, mb: 2, fontSize: { xs: "1.125rem", sm: "1.25rem" } }}>
                                License Details
                              </Typography>
                              <TableContainer component={Paper} elevation={0} sx={{ mb: 3, border: `1px solid ${lightGray}`, borderRadius: 2 }}>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ bgcolor: deepBlue }}>
                                      <TableCell sx={{ color: white, fontWeight: 700 }}>Field</TableCell>
                                      <TableCell sx={{ color: white, fontWeight: 700 }}>Value</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {[
                                      { label: "Name", value: result.LicenseData?.Name },
                                      { label: "License Number", value: result.LicenseData?.LicenseNumber },
                                      { label: "Date of Birth", value: result.LicenseData?.DOB },
                                      { label: "Address", value: result.LicenseData?.Address },
                                      { label: "Expiry Date", value: result.LicenseData?.Expiry },
                                      { label: "Blood Group", value: result.LicenseData?.["Blood Group"] }
                                    ].map((row) => (
                                      <TableRow key={row.label} sx={{ "&:nth-of-type(even)": { bgcolor: lightGray } }}>
                                        <TableCell sx={{ fontWeight: 700 }}>{row.label}</TableCell>
                                        <TableCell>{row.value || "N/A"}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <Divider sx={{ my: 2 }} />
                              <Box sx={{ textAlign: "center", p: 2, bgcolor: white, borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>Similarity Score</Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: deepBlue }}>
                                  {result.Similarity ? result.Similarity.toFixed(2) + "%" : "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Fade>
                        ) : (
                          <Fade in={true} timeout={600}>
                            <Box sx={{ textAlign: "center" }}>
                              <Box sx={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                bgcolor: "#fee2e2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                                color: darkCoral,
                                fontSize: 32,
                                fontWeight: 700,
                              }}>
                                ✗
                              </Box>
                              <Typography variant="h5" sx={{ color: darkCoral, fontWeight: 700, mb: 1, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
                                {result.message || "No Matching Face Found"}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                Please try again or contact support
                              </Typography>
                            </Box>
                          </Fade>
                        )
                      ) : null}
                    </Paper>
                  </Slide>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>

      {/* Settings Dialog */}
      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade} 
        transitionDuration={400}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: deepBlue, color: white, fontWeight: 700 }}>
          <Settings sx={{ mr: 1, verticalAlign: "middle" }} />
          Settings
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {[
            { key: 'autoCapture', label: 'Auto-capture when face detected' },
            { key: 'soundEnabled', label: 'Enable camera sound' },
            { key: 'highQuality', label: 'High quality capture' },
            { key: 'notifications', label: 'Enable notifications' }
          ].map((setting) => (
            <FormControlLabel
              key={setting.key}
              control={
                <Switch 
                  checked={settings[setting.key]}
                  onChange={() => handleSettingChange(setting.key)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: deepBlue,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: deepBlue,
                    },
                  }}
                />
              }
              label={<Typography fontWeight={500}>{setting.label}</Typography>}
              sx={{ display: 'block', mb: 1.5 }}
            />
          ))}
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            label="Camera Resolution"
            select
            defaultValue="640x480"
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="640x480">640 x 480 (Standard)</option>
            <option value="1280x720">1280 x 720 (HD)</option>
            <option value="1920x1080">1920 x 1080 (Full HD)</option>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSettingsOpen(false)} sx={{ color: deepBlue, fontWeight: 600, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog 
        open={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        maxWidth="md" 
        fullWidth
        TransitionComponent={Fade} 
        transitionDuration={400}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: deepBlue, color: white, fontWeight: 700 }}>
          <History sx={{ mr: 1, verticalAlign: "middle" }} />
          Verification History
        </DialogTitle>
        <DialogContent sx={{ mt: 2, maxHeight: "60vh", overflowY: "auto" }}>
          {verificationHistory.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <History sx={{ fontSize: 64, color: darkGray, mb: 2, opacity: 0.5 }} />
              <Typography color="text.secondary" fontWeight={500}>No verification history yet</Typography>
            </Box>
          ) : (
            verificationHistory.map((entry, index) => (
              <Fade key={index} in={true} timeout={400 + index * 100}>
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: lightGray, border: `1px solid #e2e8f0`, borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>Timestamp</Typography>
                      <Typography variant="body2" fontWeight={600}>{entry.timestamp}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <Chip
                        label={entry.result}
                        color={entry.result === "Match" ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>Similarity</Typography>
                      <Typography variant="body2" fontWeight={700}>{entry.similarity}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>Matched Image</Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>{entry.matchedImage}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setHistoryOpen(false)} sx={{ color: deepBlue, fontWeight: 600, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog 
        open={aboutOpen} 
        onClose={() => setAboutOpen(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Fade} 
        transitionDuration={400}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: deepBlue, color: white, fontWeight: 700 }}>
          <Info sx={{ mr: 1, verticalAlign: "middle" }} />
          About System
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: deepBlue, fontWeight: 700 }}>
            License Verification System v2.0
          </Typography>
          <Typography variant="body2" paragraph color="text.secondary" sx={{ lineHeight: 1.7 }}>
            Advanced AI-powered facial recognition system designed for law enforcement and security personnel.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom fontWeight={700}>Features:</Typography>
          <Typography variant="body2" paragraph color="text.secondary" sx={{ lineHeight: 1.8 }}>
            • Real-time face detection and matching<br />
            • Secure cloud-based verification<br />
            • Comprehensive verification history<br />
            • High accuracy recognition algorithm<br />
            • End-to-end encryption
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            © 2024 License Verification System. All rights reserved.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAboutOpen(false)} sx={{ color: deepBlue, fontWeight: 600, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;