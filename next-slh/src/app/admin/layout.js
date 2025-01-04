"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../../css/admin.css';

// 관리자 페이지 - 레이아웃
export default function AdminLayout({ children }) {

    // 햄버거 메뉴 상태
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // 클라이언트 측에서만 실행
        if (typeof window !== 'undefined') {
            setIsAdmin(!!localStorage.getItem('adminFlg'));
        }
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {isAdmin ? (
                <>
                    <header className="w-[100vw] bg-gray-800 text-white p-4 flex justify-between items-center z-20">
                        <button 
                            className="block lg:hidden text-white" 
                            onClick={toggleMenu}
                        >
                            ☰
                        </button>
                        <div className="flex-1 flex justify-end items-center">
                            <div className="flex justify-end">
                                <div className="mr-2">
                                    {localStorage.getItem('adminName')}님, 환영합니다.
                                </div>
                                <button 
                                    className="bg-red-600 text-white rounded px-4 py-2"
                                    onClick={() => {
                                        localStorage.removeItem('adminFlg');
                                        localStorage.removeItem('adminName');
                                        window.location.replace('/admin/info/login');
                                    }}
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </header>
                    {/* <div className="flex min-h-screen pt-16"> */}
                    <div className="flex pt-16">
                        <div className="fixed top-16 z-10">
                            <nav className={`bg-gray-200 w-[200px] h-screen p-4 fixed top-16 z-10 lg:relative lg:top-0 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                                <Link href="/admin" className="block hover:bg-gray-300 p-2 rounded transition-colors" onClick={handleLinkClick}>대시보드</Link>
                                <Link href="/admin/AdminAbout" className="block hover:bg-gray-300 p-2 rounded transition-colors" onClick={handleLinkClick}>소개글 관리</Link>
                                <Link href="/admin/AdminProject" className="block hover:bg-gray-300 p-2 rounded transition-colors" onClick={handleLinkClick}>프로젝트 관리</Link>
                                <Link href="/admin/AdminProjectRequest" className="block hover:bg-gray-300 p-2 rounded transition-colors" onClick={handleLinkClick}>프로젝트 요청 관리</Link>
                                <Link href="/admin/AdminPartner" className="block hover:bg-gray-300 p-2 rounded transition-colors" onClick={handleLinkClick}>협력사 관리</Link>
                            </nav>
                        </div>
                        <main className="w-[100vw] flex-1 p-4 lg:ml-[200px]" onClick={closeMenu}>
                            {children}
                        </main>
                    </div>
                </>
            ) : (
                <div className='w-[100vw] mt-16'>
                    {children}
                </div>
            )}
        </>
    );
}