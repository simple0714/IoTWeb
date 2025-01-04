'use client';

import CryptoJS from 'crypto-js';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { validateId, validateRequired } from '../../../../utils/validators';
import axios from 'axios';
import Modal from '../../../../components/modal';
 

// 로그인 페이지
const LoginPage = () => {

    useEffect(() => {
        // Clear local storage items when the component mounts
        localStorage.removeItem('adminFlg');
        localStorage.removeItem('adminName');
    }, []);

    // const [id, setId] = useState(() => {
    //     const params = new URLSearchParams(window.location.search);
    //     return params.get('id') || '';
    // });

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [errorMsg, setErrorMsg] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    useEffect(() => {
    if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setId(params.get('id') || '');
        }
    }, []);

    // 로그인 처리
    const handleLogin = (e) => {
        e.preventDefault();

        // 유효성 검사
        let errors = {}; // 오류 메세지 저장 객체
        // 아이디 유효성 검사
        const idRequiredError = validateRequired(id);
        if (idRequiredError !== true) {
            errors.id = idRequiredError;
        } else {
            const idFormatError = validateId(id);
            if (idFormatError !== true) {
                errors.id = idFormatError;
            }
        }
        // 비밀번호 유효성 검사 (로그인에서 비밀번호는 필수 값만 체크함)
        const pwRequiredError = validateRequired(pw);
        if (pwRequiredError !== true) {
            errors.pw = pwRequiredError;
        }
        // 모든 오류 메세지 저장
        setErrorMsg(errors);

        // 비밀번호 암호화
        const encryptedPw = CryptoJS.SHA256(pw).toString();
        // 유효성 검사 완료되면 axios 요청
        if (Object.keys(errors).length === 0) {
            console.log(id, encryptedPw);
            const url = '/api/routes/Admin/login?id=' + id + '&pw=' + encryptedPw;

            axios.get(url)
            .then(response => {
                // 로그인 성공 시 응답 데이터 처리 및 로컬 스토리지에 저장
                localStorage.setItem('adminName', response.data.dataInfo.ADMIN_NM);
                localStorage.setItem('adminFlg', true);

                // 로그인 성공 후 메인 페이지로 이동
                window.location.href = '/admin';
            })
            .catch(error => {
                setModalOpen(true);
                setModalMsg(error.response.data);
                // console.error(error);
            }); 
        }
    };
    return (
        <>
            <div className='text-3xl font-bold'>로그인</div>
            <form onSubmit={handleLogin} className='w-3/4 flex flex-col gap-2 p-4'>
                <div className='flex flex-col'>
                    <label htmlFor="id">아이디</label>
                    <input 
                        id="id" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={id}
                        onChange={(e) => setId(e.target.value)} 
                    />
                    <div className='text-red-500 text-sm h-5'>{errorMsg.id}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="pw">비밀번호</label>
                    <input 
                        id="pw" 
                        type="password" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)} 
                    />
                    <div className='text-red-500 text-sm h-5'>{errorMsg.pw}</div>
                </div>
                <button type="submit" className="w-full bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center" >
                    로그인
                </button>
            </form>
            <div className='flex justify-between gap-2 w-1/2 self-center'>
                <Link href="/admin/info/regist">회원가입</Link>
                <Link href="/admin/info/findId">아이디 찾기</Link>
                <Link href="/admin/info/findPw">비밀번호 찾기</Link>
            </div>

            {modalOpen && (
                <Modal
                    message={modalMsg}
                    onConfirm={() => setModalOpen(false)}
                    onCancel={() => setModalOpen(false)}
                    showCancel={false}
                />
            )}
        </>
    );
};

// 명령형 함수 컴포넌트
export default LoginPage;