import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Typography, TextField, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Modal from '../components/Modal';
import { useTheme, useMediaQuery } from '@mui/material';

// 유효성 검사 함수들

// 이메일 유효성 검사
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// 전화번호 유효성 검사
const validatePhone = (phone) => {
    const re = /^\d{10,11}$/;
    return re.test(phone);
};

// 아이디 유효성 검사
const validateId = (id) => {
    const re = /^[a-zA-Z0-9_]{4,20}$/;
    return re.test(id);
};

// 비밀번호 유효성 검사
const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};

// 이름 유효성 검사
const validateName = (name) => {
    const re = /^[가-힣a-zA-Z]{2,30}$/;
    return re.test(name);
};

// 전화번호 유효성 검사
const validatePhoneWithHyphen = (phone) => {
    const re = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return re.test(phone);
};


function Signup() {
    const URL = "http://localhost:3001/apis/admin/signUp";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        pw: '',
        name: '',
        email: '',
        phone: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        console.log('formData 변경됨:', formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`handleChange 호출됨: ${name} = ${value}`);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const showErrorModal = (message) => {
        setModalProps({
            title: "오류",
            message: message,
            mode: "alert",
            onClose: closeModal
        });
        setShowModal(true);
    };

    const showSuccessModal = (message) => {
        setModalProps({
            title: "성공",
            message: message,
            mode: "alert",
            onClose: () => {
                closeModal();
                navigate('/login');
            }
        });
        setShowModal(true);
    };

    const showConfirmModal = () => {
        setModalProps({
            title: "회원가입 확인",
            message: "회원가입을 진행하시겠습니까?",
            mode: "confirm",
            onConfirm: handleSignup,
            onClose: closeModal
        });
        setShowModal(true);
    };

    const handleSignup = async () => {
        try {
            const encryptedPassword = CryptoJS.SHA256(formData.pw).toString();
            const dataToSend = { ...formData, pw: encryptedPassword };
            const response = await axios.post(URL, dataToSend, {
                headers: {
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
                }
            });
            console.log('서버 응답:', response);
            if (response.status === 200) {
                showSuccessModal('회원가입이 완료되었습니다.');
                navigate('/login'); // 로그인 페이지로 이동
            } else {
                showErrorModal(response.data.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
                console.log(response.data.message);
            }
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            showErrorModal(err.response?.data?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 빈 필드 검사
        for (const [key, value] of Object.entries(formData)) {
            if (!value.trim()) {
                showErrorModal(`${key} 필드를 입력해주세요.`);
                return;
            }
        }
        if (!confirmPassword.trim()) {
            showErrorModal('비밀번호 확인 필드를 입력해주세요.');
            return;
        }

        // 비밀번호 확인
        if (formData.pw !== confirmPassword) {
            showErrorModal('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 이메일 유효성 검사
        if (!validateEmail(formData.email)) {
            showErrorModal('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        // 아이디 유효성 검사
        if (!validateId(formData.id)) {
            showErrorModal('아이디는 4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.');
            return;
        }

        // 비밀번호 강도 검사
        if (!validatePassword(formData.pw)) {
            showErrorModal('비밀번호는 8자 이상이며, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.');
            return;
        }

        // 이름 유효성 검사
        if (!validateName(formData.name)) {
            showErrorModal('이름은 2-30자의 한글 또는 영문만 사용 가능합니다.');
            return;
        }

        // 전화번호 형식 검사
        if (!validatePhone(formData.phone)) {
            showErrorModal('유효한 전화번호 형식이 아닙니다.');
            return;
        }

        console.log('전송될 데이터:', formData);
        console.log('전송될 데이터 (JSON 문자열):', JSON.stringify(formData, null, 2));

        showConfirmModal();
    };

    return(
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "1200px",
            width: "100%",
            minHeight: "100vh",
            margin: "0 auto",
            padding: { xs: "20px", sm: "40px", md: "80px" },
          }}>
        {/* 왼쪽 div */}
        <Box sx={{
          flex: 1,
        //   marginRight: { md: "100px" },
          marginTop: { xs: "20px", md: "100px" },
          textAlign: { xs: "center", md: "center" },
        }}>
        <Typography variant="h2" component="h2" sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" } }}> 회원가입 </Typography>
            <Button 
                type="submit"
                variant="contained" 
                size="large"
                sx={{
                    width: { xs: "100%", sm: "400px" },
                    height: "80px",
                    fontSize: "18px",
                    marginTop:"40px",
                    backgroundColor: "#000000",
                    borderRadius: "15px",
                    }}
                > 가입하기 
             </Button>
          {error && <Typography color="error" sx={{marginTop: "20px"}}>{error}</Typography>}
        </Box>

        {/* 구분선 추가 (모바일에서는 숨김) */}
        <Box sx={{
          width: "1px",
          backgroundColor: "#e0e0e0",
          margin: "0 20px",
          display: { xs: "none", md: "block" },
        }}></Box>

        {/* 오른쪽 div (입력 필드) */}
        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        //   marginLeft: { md: "100px" },
          maxWidth: { xs: "100%", sm: "400px" },
          margin: { xs: "40px auto 0", md: "0 0 0 50px" },
        }}>
          <TextField
            name="id"
            label="아이디"
            placeholder="아이디를 입력해주세요"
            value={formData.id}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="pw"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={formData.pw}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="confirmPassword"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
          />
          <TextField
            name="name"
            label="성명"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="email"
            label="이메일"
            placeholder="이메일을 입력해주세요"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="phone"
            label="전화번호"
            placeholder="전화번호를 입력해주세요"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        
        {/* Modal 컴포넌트 추가 */}
        <Modal
            open={showModal}
            onClose={closeModal}
            {...modalProps}
        />
      </Box>
    )
}

export default Signup;
