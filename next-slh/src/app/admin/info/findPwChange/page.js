"use client"

import { useState } from 'react';
import axios from 'axios';
import { validatePassword,validatePasswordChk } from '../../../../utils/validators';
import CryptoJS from 'crypto-js';

export default function FindPwChangePage() {

    const [pw, setPw] = useState('');
    const [pwChk, setPwChk] = useState('');
    const [errorMsg, setErrorMsg] = useState({
        pw: '',
        pwChk: '',
    });

    const handlePwChange = (e) => {
        const value = e.target.value;
        setPw(value);
        const pwCheck = validatePassword(value);
        setErrorMsg((prev) => ({ ...prev, pw: pwCheck === true ? '' : pwCheck }));
    }
    const handlePwChkChange = (e) => {
        const value = e.target.value;
        setPwChk(value);
        const pwChkCheck = validatePasswordChk(pw, value);
        setErrorMsg((prev) => ({ ...prev, pwChk: pwChkCheck === true ? '' : pwChkCheck }));
    }
    const handlePwChangeSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        const pwError = validatePassword(pw);
        const pwChkError = validatePasswordChk(pw, pwChk);
        setErrorMsg({ pw: pwError, pwChk: pwChkError });
        if(
            pwError !== true
            || pwChkError !== true
        ) return;

        // 비밀번호 암호화
        const encryptedPw = CryptoJS.SHA256(pw).toString();

        const id = localStorage.getItem('findPwChangeId');

        // 비밀번호 변경
        const url = '/api/routes/Admin/findPwChange?id=' + id + '&pw=' + encryptedPw;

        axios.put(url)
        .then(response => {
            window.location.href = '/admin/info/login';
            localStorage.removeItem('findPwChangeId');
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <>
            <div className='text-3xl font-bold'>비밀번호 변경</div>
            <form onSubmit={handlePwChangeSubmit} className='w-3/4 flex flex-col gap-2 p-4'>
                <div className='flex flex-col'>
                    <label htmlFor="pw">비밀번호</label>
                    <input 
                        id="pw" 
                        type="password" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        onChange={handlePwChange}
                        value={pw}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.pw}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="pwChk">비밀번호 확인</label>
                    <input 
                        id="pwChk" 
                        type="password" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        onChange={handlePwChkChange}
                        value={pwChk}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.pwChk}</div>
                </div>
                <div className='flex flex-row w-full gap-2'>
                    <button
                        type="submit"
                        className="w-full bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center"
                    >
                        비밀번호 변경
                    </button>
                    <button
                        type="button"
                        className="w-full bg-red-500 text-white px-4 py-2 mb-4 rounded-md self-center"
                        onClick={() => {
                            window.location.href = '/admin/info/login';
                        }}
                    >
                        취소
                    </button>
                </div>
            </form>
        </>
    );
}   