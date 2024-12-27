import React from 'react';
import { useNavigate } from "react-router-dom";

function HomeHeader({ theme, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <header>
      <div className="top">
        <div className="wrap header">
          <ul>
            <li>
              <a href="#" onClick={(e) => {
                                    // 페이지 새로고침 방지
                                    e.preventDefault(); 
                                    navigate("/slhadmin");
                                }}>ADMIN</a>
            </li>

            <li>
              <a href="#">
                <div className="mode">
                  <img className="light" src="/img/light_button.png" alt="" />
                  <label className="toggle theme">
                    <input 
                      type="checkbox" 
                      checked={theme === 'black'} 
                      onChange={toggleTheme} 
                      hidden 
                    />
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
          <a href="#" id="logo">
            <h1>SOFT-LAB HUM</h1>
          </a>

          <nav id="menu" className="o1000">
            <ul>
              <li><a href="#page02">ABOUT</a></li>
              <li><a href="#page03">PROJECT</a></li>
              <li><a href="#page04">CONTACT</a></li>
              <form action="./search.html" method="get" id="search">
                <input type="text" name="query" className="query" />
                <button type="submit" className="submit">
                  <img src="/img/search_ic.png" alt="" />
                </button>
              </form>
            </ul>
          </nav>
          
          <div className="mobile x1000">
            <div className="button">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="menuBox">
              <div className="logo">
                <img src="/img/logo_column.png" alt="" />
              </div>
              
              <form action="./search.html" method="get" id="search_mb">
                <input type="text" name="query" className="query" />
                <button type="submit" className="submit">
                  <img src="/img/search_ic.png" alt="" />
                </button>
              </form>
              
              <ul className="list">
                <li><a href="#page02">ABOUT</a></li>
                <li><a href="#page03">PROJECT</a></li>
                <li><a href="#page04">CONTACT</a></li>
                <li><a href="#">ADMIN</a></li>
              </ul>
            </div>
            
            <div className="menuBg"></div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
