import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import logo from './logo.jpg';




const NavigationMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      style={{
        backgroundColor: "white",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between", // מפזר בין הלוגו לניווט
          alignItems: "center", // מיושר אנכית
        }}
      >
        {/* לוגו בצד שמאל */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
          }}
        >
          <img
            src={logo} // הנתיב לתמונה שלך
            alt="CaptchaApp"
            style={{
              height: "40px", // גובה התמונה
              objectFit: "contain", // התאמת התמונה
            }}
          />
        </Link>

        {/* ניווט בצד ימין */}
        {isMobile ? (
          <div>
            <IconButton onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to="/captchaTest"
                onClick={handleClose}
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px",
                }}
              >
                Captcha Test
              </MenuItem>
              <MenuItem
                component={Link}
                to="/captchaTable"
                onClick={handleClose}
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px",
                }}
              >
                Analysis Results
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "20px" }}>
            <Link
              to="/captchaTest"
              style={{
                textDecoration: "none",
                color: location.pathname === "/captchaTest" ? "#5b9efc" : "#555",
                fontSize: "18px",
                fontWeight: location.pathname === "/captchaTest" ? "bold" : "500",
                borderBottom:
                  location.pathname === "/captchaTest"
                    ? "2px solid #5b9efc"
                    : "none",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Captcha Test
            </Link>
            <Link
              to="/captchaTable"
              style={{
                textDecoration: "none",
                color: location.pathname === "/captchaTable" ? "#5b9efc" : "#555",
                fontSize: "18px",
                fontWeight: location.pathname === "/captchaTable" ? "bold" : "500",
                borderBottom:
                  location.pathname === "/captchaTable"
                    ? "2px solid #5b9efc"
                    : "none",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Analysis Results
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>


  );
};

export default NavigationMenu;