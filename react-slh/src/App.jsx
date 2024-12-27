import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import setUpJs from './lib/setup';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import { IntersectionObserverProvider } from "./IntersectionObserverContext";
import { RecoilRoot } from 'recoil';

function ThemeHandler({ theme }) {
  const location = useLocation(); // Router 내부에서 위치 감지

  useEffect(() => {
    if (location.pathname === '/slhadmin') {
      // 어드민 페이지일 때 테마 속성 제거
      document.documentElement.removeAttribute('theme');
    } else {
      // 어드민 페이지가 아닐 때는 테마 적용
      document.documentElement.setAttribute('theme', theme);
    }
  }, [theme, location.pathname]);

  return null; // UI는 렌더링하지 않음
}

// 보호된 라우트를 위한 컴포넌트
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();

  if (!isLoggedIn) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'white';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const cleanup = setUpJs(); // 스크롤 초기화 함수 호출
    return () => {
      cleanup(); // 컴포넌트 언마운트 시 정리 함수 호출
    };
  }, []);

  return (
    <RecoilRoot>
      <IntersectionObserverProvider>
        <Router>
          {/* 테마 처리 로직을 라우터 내부에서 수행 */}
          <ThemeHandler theme={theme} />
          <Routes>
            <Route path='/' element={<Home theme={theme} setTheme={setTheme} />} />
            <Route path="/project/:ID" element={<Project theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
            
            {/* Admin 페이지를 ProtectedRoute로 감싸기 */}
            <Route path="/slhadmin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </IntersectionObserverProvider>
    </RecoilRoot>
  );
}

export default App;
