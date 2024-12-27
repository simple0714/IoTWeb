import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdHeader() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const storedAdminName = localStorage.getItem('adminName');
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return(
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      width: '100%',
      color: 'white',
    }}>
      {adminName && (
        <Typography sx={{ mr: 2, color: 'white' }}>
          {adminName}님 환영합니다
        </Typography>
      )}
      <Button 
        onClick={handleHomeClick}
        sx={{
          color: 'white',
          textTransform: 'none',
          mr: 2,
        }}
      >
        홈 페이지
      </Button>
      <Button 
        onClick={handleLogout}
        sx={{
          color: 'white',
          textTransform: 'none',
        }}
      >
        로그아웃
      </Button>
    </Box>
  )
}

export default AdHeader;
