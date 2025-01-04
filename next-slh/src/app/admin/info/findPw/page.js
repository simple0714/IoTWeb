"use client";

import { useState } from 'react';
import axios from 'axios';
import { validateRequired } from '../../../../utils/validators';
import Link from 'next/link';

export default function FindPwPage() {

    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [findPw, setFindPw] = useState(false);
    const [errorMsg, setErrorMsg] = useState({
        name: '',
        id: '',
        email: '',
        tel: '',
        findPw: '',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        const nameCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, name: nameCheck === true ? '' : nameCheck }));
    }
    const handleIdChange = (e) => {
        const value = e.target.value;
        setId(value);
        const idCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, id: idCheck === true ? '' : idCheck }));
    }
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const emailCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, email: emailCheck === true ? '' : emailCheck }));
    }
    const handleTelChange = (e) => {
        const value = e.target.value;
        setTel(value);
        const telCheck = validateRequired(value);
        setErrorMsg((prev) => ({ ...prev, tel: telCheck === true ? '' : telCheck }));
    }

    const handleFindPw = (e) => {
        e.preventDefault();
        
        // 유효성 검사
        const nameCheck = validateRequired(name);
        const idCheck = validateRequired(id);
        const emailCheck = validateRequired(email);
        const telCheck = validateRequired(tel);
        if(
            nameCheck !== true
            || idCheck !== true
            || emailCheck !== true
            || telCheck !== true
        ) {
            setErrorMsg({ ...errorMsg, name: nameCheck, id: idCheck, email: emailCheck, tel: telCheck });
            return;
        }

        // 비밀번호 찾기
        const url = '/api/routes/Admin/findPw?name=' + name + '&id=' + id + '&email=' + email + '&phone=' + tel;

        axios.get(url)
        .then(response => {
            if(response.data === '일치하는 정보가 없습니다.') {
                setErrorMsg({ ...errorMsg, findPw: response.data });
            } else {
                setFindPw(response.data);
                localStorage.setItem('findPwChangeId', id);
            }
        }).catch(error => {
            console.error(error);
        });
    }
    // const handlePwChange = () => {
    //     window.location.replace('/admin/info/findPwChange', { state: { id: id } });
    // }


    return (
        <>
            <div onClick={handleFindPw} className='text-3xl font-bold'>비밀번호 찾기</div>
            <form className='w-3/4 flex flex-col gap-2 p-4'>
                <div className='flex flex-col'>
                    <label htmlFor="name">이름</label>
                    <input 
                        id="name" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        readOnly={findPw}
                        onChange={handleNameChange}
                        value={name}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.name}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="id">아이디</label>
                    <input 
                        id="id" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        readOnly={findPw}
                        onChange={handleIdChange}
                        value={id}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.id}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email">이메일</label>
                    <input 
                        id="email" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        readOnly={findPw}
                        onChange={handleEmailChange}
                        value={email}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.email}</div>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="tel">전화번호</label>
                    <input 
                        id="tel" 
                        type="text" 
                        className="border border-gray-300 rounded-md p-2 w-full" 
                        readOnly={findPw}
                        onChange={handleTelChange}
                        value={tel}
                    />
                    <div className='text-red-500 text-sm' style={{ minHeight: '20px' }}>{errorMsg.tel}</div>
                </div>
                {!findPw && 
                    <div className='flex flex-col justify-center items-center' style={{ minHeight: '20px' }}>
                        <div className='text-red-500 text-sm'>{errorMsg.findPw}</div>
                    </div>
                }
                {findPw && 
                    <div className='flex flex-col justify-center items-center' style={{ minHeight: '20px' }}>
                        <div className='text-blue-500 text-sm'>[찾기완료] 비밀번호 변경을 진행해 주세요.</div>
                    </div>
                }

                <div className='flex flex-col'>
                    <div className='flex flex-row w-full gap-2'>
                        {!findPw && (
                            <button
                                onClick={handleFindPw}
                                className="w-full bg-gray-500 text-white px-4 py-2 mb-4 rounded-md self-center"
                            >
                                비밀번호 찾기
                            </button>
                        )}
                        {findPw && (
                            <Link href="/admin/info/findPwChange" className="w-full bg-blue-500 text-white px-4 py-2 mb-4 rounded-md self-center text-center">
                                <button>
                                    비밀번호 변경
                                </button>
                            </Link>
                        )}
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
                </div>
            </form>
        </>
    );
}