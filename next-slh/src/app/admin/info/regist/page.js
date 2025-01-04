"use client";

import { useState } from 'react';
import axios from 'axios';
import { validateId, validatePassword, validatePasswordChk, validateName, validateEmail, validatePhone } from '../../../../utils/validators';
import Modal from '../../../../components/modal';
import CryptoJS from 'crypto-js';

// 회원가입 페이지
export default function RegistPage() {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [pwChk, setPwChk] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [idChk, setIdChk] = useState(false);
    const [idReadonly, setIdReadonly] = useState(false);
    const [emailChk, setEmailChk] = useState(false);
    const [emailReadonly, setEmailReadonly] = useState(false);
    
    const [errorMsg, setErrorMsg] = useState({
        id: '',
        pw: '',
        pwChk: '',
        name: '',
        email: '',
        phone: '',
    });

    // 모달
    const [modalMsg, setModalMsg] = useState('');
    const [modalType, setModalType] = useState(true);
    const [showModal, setShowModal] = useState(false);


    // 아이디 중복 확인
    const handleIdChk = () => {
        if (id === '') {
            setModalMsg('아이디를 입력해주세요.');
            setModalType(false);
            setShowModal(true);
            return;
        }
        const url = '/api/routes/Admin/chkId';
        const data = { id: id };
        
        axios.post(url, data)
        .then(response => {
            if(response.data === '사용 가능한 아이디입니다.') {
                setShowModal(true);
                setModalType(false);
                setIdChk(true);
                setModalMsg('사용 가능한 아이디입니다.');
                setIdReadonly(true);
            } else if (response.data === '이미 존재하는 아이디입니다.') {
                setShowModal(true);
                setModalType(false);
                setIdChk(false);
                setModalMsg('이미 사용 중인 아이디입니다.');
            }
        })
        .catch(error => {
            console.error(error);
        });
    } 
    // 이메일 중복 확인
    const handleEmailChk = () => {
        if (email === '') {
            setModalMsg('이메일을 입력해주세요.');
            setModalType(false);
            setShowModal(true);
            return;
        }
        const url = '/api/routes/Admin/chkEmail';
        const data = { email: email };
        
        axios.post(url, data)
        .then(response => {
            if(response.data === '사용 가능한 이메일입니다.') {
                setShowModal(true);
                setModalType(false);
                setEmailChk(true);
                setModalMsg('사용 가능한 이메일입니다.');
                setEmailReadonly(true);
            } else if (response.data === '이미 존재하는 이메일입니다.') {
                setShowModal(true);
                setModalType(false);
                setEmailChk(false);
                setModalMsg('이미 사용 중인 이메일입니다.');
            }
        })
        .catch(error => {
            console.error(error);
        });
    }


    // 회원가입 요청
    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 체크
        let errors = {};

        // 아이디 유효성 체크
        const idCheck = validateId(id);
        if(idCheck !== true) {
            errors.id = idCheck;
        }
        // 비밀번호 유효성 체크
        const pwCheck = validatePassword(pw);
        if(pwCheck !== true) {
            errors.pw = pwCheck;
        }
        // 비밀번호 확인 유효성 체크
        const pwChkCheck = validatePasswordChk(pw, pwChk);
        if(pwChkCheck !== true) {
            errors.pwChk = pwChkCheck;
        }
        // 이름 유효성 체크
        const nameCheck = validateName(name);
        if(nameCheck !== true) {
            errors.name = nameCheck;
        }
        // 이메일 유효성 체크
        const emailCheck = validateEmail(email);
        if(emailCheck !== true) {
            errors.email = emailCheck;
        }
        // 전화번호 유효성 체크
        const phoneCheck = validatePhone(phone);
        if(phoneCheck !== true) {
            errors.phone = phoneCheck;
        }
        // 에러 메시지 저장
        setErrorMsg(errors);

        // 유효성 검사 실패 시 중단
        if(Object.keys(errors).length > 0) {
            return;
        }

        // 중복 체크 확인
        if (!idChk) {
            setModalMsg('아이디 중복 확인을 해주세요.');
            setModalType(false);
            setShowModal(true);
            return;
        }
        if (!emailChk) {
            setModalMsg('이메일 중복 확인을 해주세요.');
            setModalType(false);
            setShowModal(true);
            return;
        }

        // 비밀번호 암호화
        const encryptedPw = CryptoJS.SHA256(pw).toString();

        // 모든 오류 메세지가 없으면 회원가입 요청
        const url = '/api/routes/Admin/signUp';
        const data = {
            id: id,
            pw: encryptedPw,
            name: name,
            email: email,
            phone: phone
        }
        console.log(data);
        axios.post(url, data)
        .then(response => {
            console.log(response);
            if(response.data === '회원가입 성공') {
                setShowModal(true);
                setModalType(false);
                setModalMsg('회원가입 성공. 로그인 페이지로 이동합니다.');
            } else {
                setShowModal(true);
                setModalType(false);
                setModalMsg('회원가입 실패. 다시 시도해주세요.');
            }

        })
        .catch(error => {
            console.error(error);
        });
    }

    // 실시간 유효성 검사 핸들러
    const handleIdChange = (e) => {
        const newId = e.target.value;
        setId(newId);
        const idCheck = validateId(newId);
        setErrorMsg(prev => ({ ...prev, id: idCheck === true ? '' : idCheck }));
    };

    const handlePwChange = (e) => {
        const newPw = e.target.value;
        setPw(newPw);
        const pwCheck = validatePassword(newPw);
        setErrorMsg(prev => ({ ...prev, pw: pwCheck === true ? '' : pwCheck }));
    };

    const handlePwChkChange = (e) => {
        const newPwChk = e.target.value;
        setPwChk(newPwChk);
        const pwChkCheck = validatePasswordChk(pw, newPwChk);
        setErrorMsg(prev => ({ ...prev, pwChk: pwChkCheck === true ? '' : pwChkCheck }));
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        const nameCheck = validateName(newName);
        setErrorMsg(prev => ({ ...prev, name: nameCheck === true ? '' : nameCheck }));
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const emailCheck = validateEmail(newEmail);
        setErrorMsg(prev => ({ ...prev, email: emailCheck === true ? '' : emailCheck }));
    };

    const handlePhoneChange = (e) => {
        const newPhone = e.target.value;
        setPhone(newPhone);
        const phoneCheck = validatePhone(newPhone);
        setErrorMsg(prev => ({ ...prev, phone: phoneCheck === true ? '' : phoneCheck }));
    };

    return (
        <>
            <div className='text-3xl font-bold'>회원가입</div>
            <form onSubmit={handleSubmit} className='w-3/4 flex flex-col gap-2 p-4'>
                <div className='flex flex-col'>
                    <label htmlFor="id">아이디</label>
                    <div className='flex justify-between gap-2'>
                        <input 
                            id="id" 
                            type="text" 
                            className="w-3/4 border border-gray-300 rounded-md p-2"
                            placeholder='아이디를 입력해주세요.'
                            value={id}
                            onChange={handleIdChange}
                            readOnly={idReadonly}
                        /> 
                        {!idReadonly && (
                            <button
                                type="button"
                                className="w-1/4 bg-gray-500 text-white px-4 py-2 rounded-md self-center"
                                onClick={handleIdChk}
                            >중복확인</button>
                        )}
                    </div>
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.id}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="pw">비밀번호</label>
                    <input
                        id="pw" 
                        type="password" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder='비밀번호를 입력해주세요.'
                        value={pw}
                        onChange={handlePwChange}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.pw}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="pwChk">비밀번호 확인</label>
                    <input 
                        id="pwChk" 
                        type="password" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder='비밀번호를 다시 입력해주세요.'
                        value={pwChk}
                        onChange={handlePwChkChange}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.pwChk}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="name">이름</label>
                    <input
                        id="name" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder='이름을 입력해주세요.'
                        value={name}
                        onChange={handleNameChange}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.name}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email">이메일</label>
                    <div className='flex justify-between gap-2'>
                        <input
                            id="email" 
                            type="text" 
                            className="w-3/4 border border-gray-300 rounded-md p-2"
                            placeholder='이메일을 입력해주세요.'
                            value={email}
                            onChange={handleEmailChange}
                            readOnly={emailReadonly}
                        />
                        {!emailReadonly && (
                            <button 
                                type="button"
                                className="w-1/4 bg-gray-500 text-white px-4 py-2 rounded-md self-center"
                                onClick={handleEmailChk}
                            >중복확인</button>
                        )}
                    </div>
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.email}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="tel">전화번호</label>
                    <input 
                        id="tel" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder='전화번호를 입력해주세요.'
                        value={phone}
                        onChange={handlePhoneChange}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.phone}</div>
                </div>
                <div className='flex justify-between gap-2'>
                    <button className="w-2/3 bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center">회원가입</button>
                    <button
                        type="button"
                        className="w-2/3 bg-red-500 text-white px-4 py-2 mb-4 rounded-md self-center"
                        onClick={() => {
                            window.location.href = '/admin/info/login';
                        }}
                    >
                        취소
                    </button>
                </div>
            </form>

            {showModal && (
                <Modal
                    message={modalMsg}
                    showCancel={modalType}
                    onConfirm={() => {
                        setShowModal(false);
                        if (modalMsg === '회원가입 성공. 로그인 페이지로 이동합니다.') {
                            window.location.href = '/admin/info/login';
                        }
                    }}
                />
            )}
        </>
    );
}