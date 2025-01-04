"use client";
import { useState } from 'react';
import axios from 'axios';
import { validateRequired } from '../../../../utils/validators';

export default function FindIdPage() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [findId, setFindId] = useState('');
    const [errorMsg, setErrorMsg] = useState({
        name: '',
        email: '',
        findId: '',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        const nameCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, name: nameCheck === true ? '' : nameCheck }));
    }
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const emailCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, email: emailCheck === true ? '' : emailCheck }));
    }
    const handleFindId = (e) => {
        e.preventDefault();
        
        // 유효성 검사
        const nameCheck = validateRequired(name);
        const emailCheck = validateRequired(email);
        if(
            nameCheck !== true
            || emailCheck !== true
        ) {
            setErrorMsg({ ...errorMsg, name: nameCheck, email: emailCheck });
            return;
        }

        // 아이디 찾기  
        const url = '/api/routes/Admin/findId?name=' + name + '&email=' + email;  

        axios.get(url)
        .then(response => {
            if(response.data === '일치하는 정보가 없습니다.') {
                setErrorMsg({ ...errorMsg, findId: response.data });
                setFindId('');
            } else {
                setFindId(response.data.ADMIN_ID);
                setErrorMsg({ ...errorMsg, findId: '' });
            }
        }).catch(error => {
            console.error(error);
        });
    }
    const handleLogin = () => {
        window.location.href = `/admin/info/login?id=${findId}`;
    }
    return (
        <>
            <div className='text-3xl font-bold'>아이디 찾기</div>
            <form onSubmit={handleFindId} className='w-3/4 flex flex-col gap-2 p-4'>
                <div className='flex flex-col'>
                    <label htmlFor="name">이름</label>
                    <input 
                        id="name" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={name}
                        onChange={handleNameChange} 
                        readOnly={findId}
                        />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.name}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email">이메일</label>
                    <input 
                        id="email" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={email}
                        onChange={handleEmailChange} 
                        readOnly={findId}
                        />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.email}</div>
                </div>      
                <div className='flex flex-col justify-center items-center pb-2' style={{ minHeight: '20px' }}>
                    {errorMsg.findId && <div className='text-red-500 text-sm' >{errorMsg.findId}</div>}
                    {findId && <div className='text-sm font-bold' >아이디 : {findId}</div>}
                </div>

                <div className='flex justify-between gap-2'>
                    <div className='flex flex-col w-full'>
                        {findId && <button onClick={handleLogin} className="w-full bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center">로그인으로 돌아가기</button>}
                        {!findId && 
                        <div className='flex flex-row w-full gap-2'>
                            <button onClick={handleFindId} className="w-1/2 bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center">아이디 찾기</button>
                            <button
                                type="button"
                                className="w-1/2 bg-red-500 text-white px-4 py-2 mb-4 rounded-md self-center"
                                onClick={() => {
                                    window.location.href = '/admin/info/login';
                                }}
                                >
                                취소
                            </button>
                        </div>
                        }
                    </div>
                                
                </div>
            </form>
        </>
    );
}