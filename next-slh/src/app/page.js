'use client'

import { useEffect } from 'react';

import UserHeader from './UserHeader/page';
import UserVideo from './UserVideo/page';
import UserAbout from './UserAbout/page';
import UserProject from './UserProject/page';
import UserContact from './UserContact/page';
import UserMap from './UserMap/page';
import UserFooter from './UserFooter/page';
import "../css/globals.css";
import "../css/lib/setup.css";
import "../css/lib/layout.css";
import "../css/lib/style.css";
// import "../css/lib/setup.js";

// 사용자 페이지 - 메인
export default function Home() {
  
  // useEffect(() => {
  //   window.location.reload();
  // }, [])

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header>
        <UserHeader />
      </header>
      <main>
        <UserVideo />
        <UserAbout />
        <UserProject />
        <UserContact />
        <UserMap />
      </main>
      <footer>
        <UserFooter />
      </footer>
      {/* Top Button */}
      <button onClick={scrollToTop} style={topButtonStyle}>
        Top
      </button>
    </>
  );
}
// CSS for the top button
const topButtonStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: 'gray',
  color: '#fff',
  border: 'none',
  borderRadius: '15px',
  cursor: 'pointer',
  zIndex: 1000,
};

