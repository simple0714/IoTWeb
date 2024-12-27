import React, { useState, useEffect } from "react";
import { useIntersectionObserver } from "../IntersectionObserverContext";
import axios from "axios";
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

// 스타일드 컴포넌트 정의
const ContactSection = styled.section`
  padding: 60px 0px 100px;

  .component {
    padding: 100px 0px 60px;
  }

  .component .maintext {
    font-family: 'Chillax-Variable';
    font-weight: bold;
    font-size: 8rem;
    color: var(--main-text-color);
    opacity: 0;
    transform: translateY(30px);
  }

  &.view .component .maintext {
    opacity: 1;
    transform: translateY(0%);
    transition: opacity .4s .2s, transform .5s .4s;
  }

  .component span {
    font-size: 1.5rem;
    color: var(--main-text-color);
    opacity: 0;
    transform: translateY(30px);
  }

  &.view .component span {
    opacity: 1;
    transform: translateY(0%);
    transition: opacity .4s .3s, transform .5s .5s;
  }

  .board {
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0px;
    width: 100%;
    padding-top: 100px;
  }

  .board .left {
    padding: 0px 4vw;
    transition: all .3s 0s;
  }

  .board .right {
    border-left: 1px solid var(--main-text-color);
    padding: 0px 4vw;
    transition: all .3s 0s;
  }

  #question {
    text-align: left;
    padding: 30px 0px 60px;
    color: var(--main-text-color);
  }

  #question li {
    font-family: 'Pretendard-ExtraBold';
    font-size: 25px;
    padding: 0px 10px;
    transition: all .3s 0s;
  }

  #question .memo {
    font-family: 'Pretendard-Regular';
    font-size: 16px;
    opacity: .4;
  }

  #answer .grid {
    width: 100%;
    display: inline-grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 3vw;
    transition: all .3s 0s;
  }

  #answer .grid input[type=text] {
    border: none;
    background-color: transparent;
    border-bottom: 3px solid var(--main-text-color);
    padding: 5px 10px;
    margin-bottom: 30px;
    line-height: 25px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: all .3s 0s;
  }

  #answer {
    display: block;
    text-align: left;
    padding-bottom: 4vw;
  }

  #answer span {
    width: 100%;
    font-size: 14px;
    opacity: .5;
    padding: 0px 0px 15px 5px;
  }

  #answer textarea {
    border: 3px solid var(--main-text-color);
    width: 100%;
    height: 200px;
  }

  input[type=submit] {
    width: 130px;
    line-height: 50px;
    border-radius: 5px;
    background-color: var(--main-text-color);
    margin-top: 6vw;
  }

  #select {
    text-align: left;
    padding-bottom: 4vw;
  }

  #select .checkbox.button {
    color: var(--main-text-color);
    border: 3px solid var(--main-text-color);
    padding: 5px 23px;
    margin: 3px 0px;
  }

  #select .radio.button:has(input[type="radio"]:checked),
  #select .checkbox.button:has(input[type="checkbox"]:checked) {
    color: var(--main-white-color);
    background-color: #4C49FF;
    border: 3px solid #4C49FF;
  }

  @media only screen and (max-width: 1024px) {
    .component .maintext {
      font-size: 7rem;
    }

    .board {
      grid-template-columns: 1fr;
    }

    .board .left {
      padding: 0px 2vw;
    }

    .board .right {
      border: none;
      padding: 0px 2vw;
    }

    #select {
      text-align: center;
    }
  }

  @media only screen and (max-width: 430px) {
    .component .maintext {
      font-size: 5rem;
    }

    #answer .grid {
      grid-template-columns: 1fr;
    }

    #question {
      padding: 30px 0px 50px;
    }

    #question li {
      font-size: 20px;
    }

    #question .memo {
      font-size: 12px;
    }

    #select .checkbox.button {
      padding: 0px 15px;
    }

    #answer span {
      font-size: 12px;
    }

    input[type=submit] {
      width: 100px;
      margin-top: 10vw;
    }

    .board {
      padding-top: 0px;
    }

    .board .left {
      padding: 0px 10px;
    }
  }
`;

function Contact() {
  const { ref, inView } = useIntersectionObserver();

  // 폼 데이터 저장
  const [formData, setFormData] = useState({
    orgNm: "",
    name: "",
    phone: "",
    email: "",
    service: [],
    budget: "",
    schedule: "",
    description: ""
  });
  
  //오류 저장
  const [errors, setErrors] = useState({});
  // 서비스 목록 API
  const URL = "http://localhost:3001/apis/service/list";
  // 서비스 목록 저장
  const [services, setServices] = useState([]);
  // API 호출해서 서비스 목록 가져오기
  const fetchData = async () => {
    const response = await axios.get(URL);
    console.log(response.data);
    setServices(response.data.dataInfo.rows);
  };

  useEffect(() => {
    fetchData();
  }, []);
  // 전화번호 하이픈 제거, 예산에서 쉼표 추가
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
        setFormData((prevData) => ({
            ...prevData,
            service: checked
                ? [...prevData.service, value]
                : prevData.service.filter((service) => service !== value),
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'text' && name === 'phone'
                ? value.replace(/[^0-9]/g, '') // 전화번호에서 숫자만 남김
                : (name === 'budget'
                    ? formatBudget(value) // 예산에서 쉼표 추가
                    : value)
        }));
    }
  };
  // 숫자를 쉼표 형식으로 변환
  const formatBudget = (value) => {
    // 숫자만 남기기
    const numericValue = value.replace(/[^0-9]/g, '');
    // 숫자에 쉼표 추가
    return numericValue === '' ? '' : Number(numericValue).toLocaleString();
  };
  // 전화번호 유효성 검사 함수
  const isValidPhone = (phone) => {
    // 예: 숫자만 포함하고 길이가 10자리 또는 11자리인 경우에 유효하다고 간주
    const phonePattern = /^\d{10,11}$/;
    return phonePattern.test(phone);
  };

  // 이메일 유효성 검사 함수
  const isValidEmail = (email) => {
    // 일반적인 이메일 형식에 대한 정규 표현식
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // 유효성검사
  const validateForm = () => {
    const newErrors = {};
    let hasEmptyFields = false; // 모든 필드 체크를 위한 변수 초기화

    // 각 필드 체크
    if (!formData.orgNm.trim()) {
        newErrors.orgNm = "회사 또는 기관명을 입력해주세요.";
        hasEmptyFields = true; // 필드가 비어있으면 true
    }
    if (!formData.name.trim()) {
        newErrors.name = "담당자명을 입력해주세요.";
        hasEmptyFields = true; // 필드가 비어있으면 true
    }
    if (!formData.phone.trim()) {
        newErrors.phone = "연락처를 입력해주세요.";
        hasEmptyFields = true; // 필드가 비어있으면 true
    }
    if (!formData.email.trim()) {
        newErrors.email = "이메일을 입력해주세요.";
        hasEmptyFields = true; // 필드가 비어있으면 true
    }
    if (formData.service.length === 0) {
        newErrors.service = "최소 하나의 서비스를 선택해주세요.";
        hasEmptyFields = true; // 필드가 비어있으면 true
    }

    // 입력하지 않은 항목이 하나라도 있다면 모달 메시지 표시
    if (hasEmptyFields) {
        setModalMessage("입력하지 않은 항목이 있습니다. 다시 확인해주세요.");
        setModalVisible(true);
        return false; 
    }

    // 입력된 경우 유효성 체크
    if (!isValidPhone(formData.phone)) {
        newErrors.phone = "올바른 연락처 형식이 아닙니다."; 
    }
    if (!isValidEmail(formData.email)) {
        newErrors.email = "올바른 이메일 주소를 입력해주세요."; 
    }

    setErrors(newErrors);

    // 유효성 검사 실패 시 해당 오류 메시지 모달 표시
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("<br />");
      setModalMessage("유효성 검사에 통과하지 못한 항목이 있습니다:<br />" + errorMessages);
      setModalVisible(true);
      return false; // 유효성 검사 실패
    }

  return true; 
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본제출 방지

    // 폼 제출 전 유효성검사
    if (!validateForm()) return;

    // 쉼표 제거한 budget 값을 복사
    const sanitizedFormData = {
        ...formData,
        budget: formData.budget.replace(/,/g, "") // 쉼표 제거
    };

    try {
        const response = await fetch("http://localhost:3001/apis/contact/postContact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sanitizedFormData), // 쉼표 제거한 데이터 전송
        });

        if (response.ok) {
            setModalMessage("요청이 성공적으로 전송되었습니다.");
            setModalVisible(true);
            // 성공시 폼 데이터 초기화
            setFormData({
                orgNm: "",
                name: "",
                phone: "",
                email: "",
                service: [],
                budget: "",
                schedule: "",
                description: ""
            });
            setErrors({}); // 성공시 에러 메세지 초기화
        } else {
            setModalMessage("요청에 실패했습니다. 다시 시도해주세요.");
            setModalVisible(true);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setModalMessage("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        setModalVisible(true);
    }
  };

  // css
  
  return (
    <ContactSection id="page04" className={`section ${inView ? 'view' : ''}`} ref={ref}>
      <Helmet>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1" />
      </Helmet>
      <div className="wrap">
        <div className="component">
          <div className="maintext">CONTACT</div>
          <span>아이디어만 있어도 좋아요, <br /> 소프트랩 흄과 함께 할 당신을 소개해주세요.</span>
        </div>

        <div className="board">
          <div className="left">
            <ul id="question">
              <li className="number">01</li>
              <li className="text">고객 정보</li>
              <li className="memo">* 기재하신 연락처로 담당자가 연락 또는 이메일을 드립니다.</li>
            </ul>

            <ul id="answer">
              <div className="grid">
                <input
                  type="text"
                  name="orgNm"
                  placeholder="회사 또는 기관명"
                  value={formData.orgNm}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="담당자명"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="연락처"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="email"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </ul>

            <ul id="question">
              <li className="number">02</li>
              <li className="text">함께 하고 싶은 서비스는 무엇인가요?</li>
              <li className="memo">* 중복선택가능</li>
            </ul>
            <div id="select">
              {services.map(service => (
                <label key={service.SERVICE_CD} className="checkbox button">
                  {service.SERVICE_NM}
                  <input
                    type="checkbox"
                    name="service"
                    value={service.SERVICE_CD}
                    onChange={handleChange}
                    hidden
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="right">
            <ul id="question">
              <li className="number">03</li>
              <li className="text">프로젝트 예산 / 일정을 알려주세요.</li>
            </ul>
            <ul id="answer">
              <div className="grid">
                <input
                  type="text"
                  name="budget"
                  placeholder="대략적인 예산을 입력해주세요."
                  value={formData.budget}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="schedule"
                  placeholder="대략적인 마감 일정을 입력해주세요. (숫자만 입력)"
                  value={formData.schedule}
                  onChange={handleChange}
                />
              </div>
            </ul>

            <ul id="question">
              <li className="number">04</li>
              <li className="text">구상 중이신 프로젝트에 대해 자세히 설명해 주세요.</li>
            </ul>
            <ul id="answer">
              <span className="ex">
                예시) <br />
                프로젝트 제목 : 소프트랩 흄 모바일 앱 리뉴얼<br />
                프로젝트 목적 : 기존 앱을 트렌드에 맞게 리뉴얼하고 싶습니다.<br />
                선호하는 컨셉 : 홈페이지 주소 또는 텍스트로 입력해주세요.<br />
                문의 내용 : 프로젝트에 대해 강조하고 싶은 내용을 입력해주세요.
              </span>
              <textarea
                name="description"
                placeholder="프로젝트에 대해 설명해주세요."
                value={formData.description}
                onChange={handleChange}
              />
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="submit" value="제출" />
        </form>
      </div>
    </ContactSection>
  );
}

export default Contact;