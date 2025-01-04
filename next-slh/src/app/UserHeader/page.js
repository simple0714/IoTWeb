"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function UserHeader() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkTheme(savedTheme === 'black');
    document.documentElement.setAttribute('theme', savedTheme || 'white');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? 'black' : 'white';
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // header태그 안에 감싸져있음 (밖에 <header> 태그 있음)
    <>
      <div className="top">
        <div className="wrap header">
          <ul>
            <li><Link href="/admin/info/login">ADMIN</Link></li>
            <li>
              <a href="#">
                <div className="mode">
                  <img className="light" src="/img/light_button.png" alt="" />
                  <label className={`toggle theme ${isDarkTheme ? 'view' : ''}`}>
                    <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} hidden />
                  </label>
                  <img className="dark" src="/img/dark_button.png" alt="" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap">
        <div className="flex">
          <Link href="#" id="logo">
            <h1>SOFT-LAB HUM</h1>
          </Link>

          <nav id="menu" className="o1000">
            <ul style={{padding:'15px'}}>
              <li><Link href="#page02">ABOUT</Link></li>
              <li><Link href="#page03">PROJECT</Link></li>
              <li><Link href="#page04">CONTACT</Link></li>
              <form id="search">
                <input type="text" name="query" className="query" />
                <button type="submit" className="submit">
                  <img src="/img/search_ic.png" alt="" />
                </button>
              </form>
            </ul>
          </nav>

          <div className={`mobile x1000 ${isMenuOpen ? 'view' : ''}`}>
            <div className="button" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="menuBox">
              <div className="logo">
                <img src="/img/logo_column.png" alt="" />
              </div>

              <ul className="list">
                <li><Link href="#page02" onClick={closeMenu}>ABOUT</Link></li>
                <li><Link href="#page03" onClick={closeMenu}>PROJECT</Link></li>
                <li><Link href="#page04" onClick={closeMenu}>CONTACT</Link></li>
                <li><Link href="#" onClick={closeMenu}>ADMIN</Link></li>
              </ul>
            </div>

            <div className="menuBg" onClick={closeMenu}></div>
          </div>
        </div>
      </div>
    </>
  );
}
