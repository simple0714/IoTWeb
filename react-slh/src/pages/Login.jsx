import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Typography, TextField, Box } from '@mui/material';
import logo from '../assets/Logo.png';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useTheme, useMediaQuery } from '@mui/material';
import Modal from '../components/Modal';

function Login() {
    const URL = "http://localhost:3001/apis/admin/login";
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // 로그인 상태인 경우 관리자 페이지로 리디렉션
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/slhadmin');
        }
        // 컴포넌트 마운트 시 기존 타이머 제거
        clearTimeout(localStorage.getItem('loginTimeout'));
        // 컴포넌트 언마운트 시 타이머 제거
        return () => {
            clearTimeout(localStorage.getItem('loginTimeout'));
        };
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username && !password) {
          setModalMessage('아이디와 비밀번호를 입력해주세요.');
          setOpenModal(true);
          return;
        } else if (!username) {
            setModalMessage('아이디를 입력해주세요.');
            setOpenModal(true);
            return;
        } else if (!password) {
            setModalMessage('비밀번호를 입력해주세요.');
            setOpenModal(true);
            return;
        }
        try {
            const encryptedPassword = CryptoJS.SHA256(password).toString();

            const response = await axios.get(URL, {
              params: { id: username, pw: encryptedPassword },
              withCredentials: true
            });
            // console.log(response);

            if (response.status === 200) {
                const { ADMIN_ID, ADMIN_NM } = response.data.dataInfo;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('adminId', ADMIN_ID);
                localStorage.setItem('adminName', ADMIN_NM);

                const timer = setTimeout(() => {
                  localStorage.removeItem('isLoggedIn', 'false');
                }, 10000); // 10초 후 로그인 상태 제거

                localStorage.setItem('loginTimeout', timer);

                navigate('/slhadmin');
            } else {
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return(
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        margin: { xs: "40px auto", sm: "60px auto", md: "80px auto" },
        padding: { xs: "0 20px", sm: "0 40px", md: 0 },
      }}>
        <Box sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
        }}>
          {/* 왼쪽 div */}
          <Box sx={{
            width: { xs: "100%", md: "500px" },
            marginTop: { xs: "20px", md: "100px" },
            textAlign: { xs: "center", md: "left" },
          }}>
            <img src={logo} alt="logo" 
            style={{
              width: isMobile ? "200px" : isTablet ? "250px" : "350px",
              height: "auto",
              cursor: "pointer",
            }} 
            onClick={() => navigate('/')} />
          </Box>

          {/* 오른쪽 div (로그인 영역) */}
          <Box sx={{
            width: { xs: "100%", md: "400px" },
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: { xs: "20px", md: "200px" },
          }}>
            <TextField
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: 'black',
                color: 'white',
                marginTop: '10px',
                marginBottom: '10px',
                fontSize: '18px',
              }}
            >
              로그인
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography onClick={() => navigate('/signup')} variant="body2" style={{cursor: "pointer"}}>회원가입</Typography>
              <Typography variant="body2" style={{color:"#808080"}}>ID찾기</Typography>
              <Typography variant="body2" style={{color:"#808080"}}>P/W 찾기</Typography>
            </Box>
          </Box>
        </Box>
        <Modal open={openModal} onClose={handleCloseModal} message={modalMessage} />
      </Box>
    )
}

export default Login;
