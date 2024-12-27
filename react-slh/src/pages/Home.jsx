import React, { useState, useEffect } from 'react';
import HomeHeader from '../components/HomeHeader';
import HomeVideo from '../components/HomeVideo';
import HomeAbout from '../components/HomeAbout';
import HomeProject from '../components/HomeProject';
import HomeContact from '../components/HomeContact';
import HomeMap from '../components/HomeMap';
import Footer from '../components/HomeFooter';

function Home() {
    // 로컬 스토리지에서 테마 값을 불러옴, 없으면 기본값 'white' 사용
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'white';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // 테마 변경 함수
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'white' ? 'black' : 'white'));
    };

    // 테마 변경에 따른 HTML 태그 속성 및 로컬 스토리지 업데이트
    useEffect(() => {
        document.documentElement.setAttribute('theme', theme); // HTML 태그의 theme 속성 변경
        localStorage.setItem('theme', theme); // 로컬 스토리지에 테마 저장

        const toggleLabel = document.querySelector('.toggle.theme');
        if (toggleLabel) {
            if (theme === 'black') {
                toggleLabel.classList.add('view'); // 테마가 black일 때 'view' 클래스 추가
            } else {
                toggleLabel.classList.remove('view'); // 테마가 white일 때 'view' 클래스 제거
            }
        }
    }, [theme]); // 테마가 변경될 때마다 실행

    return (
        <>
            <HomeHeader theme={theme} toggleTheme={toggleTheme} />
            <main>
                    <HomeVideo theme={theme} toggleTheme={toggleTheme} />
                    <HomeAbout theme={theme} toggleTheme={toggleTheme} />
                    <HomeProject theme={theme} toggleTheme={toggleTheme} />
                    <HomeContact theme={theme} toggleTheme={toggleTheme} />
                    <HomeMap theme={theme} toggleTheme={toggleTheme} />
            </main>
            <footer>
                <Footer theme={theme} toggleTheme={toggleTheme} />
            </footer>
        </>
    );
}

export default Home;
