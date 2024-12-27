import React from "react";
import { useIntersectionObserver } from "../IntersectionObserverContext";

function Contact() { 
    const {ref, inView } = useIntersectionObserver();

    return (
        <section id="page04" className={`section ${inView ? 'view' : ''}`} ref={ref}>
          <div className="wrap">
            <div className="component">
              <div className="maintext">CONTACT</div>
              <span>
                아이디어만 있어도 좋아요, <br /> 소프트랩 흄과 함께 할 당신을 소개해주세요.
              </span>
            </div>
            <div className="o1000">
              <div className="board">
                <div className="left">
                  <ul id="question">
                    <li className="number">01</li>
                    <li className="text">고객 정보</li>
                    <li className="memo">
                      * 기재하신 연락처로 담당자가 연락 또는 이메일을 드립니다.
                    </li>
                  </ul>
                  <ul id="answer">
                    <form action="" className="grid" method="post">
                      <input type="text" name="office" placeholder="회사 또는 기관명" />
                      <input type="text" name="manager" placeholder="담당자명" />
                      <input type="text" name="contact" placeholder="연락처" />
                      <input type="text" name="mail" placeholder="이메일" />
                    </form>
                  </ul>
                  <ul id="question">
                    <li className="number">02</li>
                    <li className="text">함께 하고 싶은 서비스는 무엇인가요?</li>
                    <li className="memo">* 중복선택가능</li>
                  </ul>
                  <div id="select">
                    <label className="checkbox button">
                      IoT솔루션
                      <input type="checkbox" name="tag" hidden />
                    </label>
                    <label className="checkbox button">
                      모바일 앱
                      <input type="checkbox" name="tag" hidden />
                    </label>
                    <label className="checkbox button">
                      웹 서비스
                      <input type="checkbox" name="tag" hidden />
                    </label>
      
                    <br className="x1200" />
      
                    <label className="checkbox button">
                      IT 컨설팅
                      <input type="checkbox" name="tag" hidden />
                    </label>
                    <label className="checkbox button">
                      UI / UX
                      <input type="checkbox" name="tag" hidden />
                    </label>
                  </div>
                </div>
                <div className="right">
                  <ul id="question">
                    <li className="number">03</li>
                    <li className="text">프로젝트 예산 / 일정을 알려주세요.</li>
                  </ul>
                  <ul id="answer">
                    <form action="" method="post" className="grid">
                      <input
                        type="text"
                        name="budget"
                        placeholder="대락적인 예산을 입력해주세요."
                      />
                      <input
                        type="text"
                        name="scedule"
                        placeholder="대략적인 일정을 입력해주세요."
                      />
                    </form>
                  </ul>
                  <ul id="question">
                    <li className="number">04</li>
                    <li className="text">
                      구상 중이신 프로젝트에 대해 자세히 설명해 주세요.
                    </li>
                  </ul>
                  <ul id="answer">
                    <form action="" method="post">
                      <span className="ex">
                        예시) <br />
                        프로젝트 제목 : 소프트랩 흄 모바일 앱 리뉴얼<br />
                        프로젝트 목적 : 기존 앱을 트렌드에 맞게 리뉴얼하고 싶습니다.
                        <br />
                        선호하는 컨셉 : 홈페이지 주소 또는 텍스트로 입력해주세요.
                        <br />
                        문의 내용 : 프로젝트에 대해 강조하고 싶은 내용을 입력해주세요.
                      </span>
                      <textarea name="explain"></textarea>
                    </form>
                  </ul>
                </div>
              </div>
              <form action="" method="post">
                <input type="submit" value="제출" />
              </form>
            </div>
            <a href="./contact.html" className="mob_btn x1000">문의하기</a>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </section>
      );
      
}

export default Contact;