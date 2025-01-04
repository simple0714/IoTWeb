"use client";

import { useIntersectionObserver } from "../../../utils/IntersectionObserverContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { validateEmail, validatePhone, validateNumber, validateRequired } from "../../../utils/validators";
import Modal from '../../../components/modal';
import '../../../css/contactDetail.css';

// 유저 클라이언트
export default function UserContact() {
    const { ref, inView } = useIntersectionObserver();

    const [serviceData, setServiceData] = useState([]);

    // 입력값 상태
    const [orgNm, setOrgNm] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [budget, setBudget] = useState('');
    const [schedule, setSchedule] = useState('');
    const [description, setDescription] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    
    // 에러 상태
    const [orgNmError, setOrgNmError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [budgetError, setBudgetError] = useState('');
    const [scheduleError, setScheduleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [serviceError, setServiceError] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showCancel, setShowCancel] = useState(true);

    // 서비스 데이터 획득
    useEffect(() => {
        const url = '/api/routes/Service';   

        axios.get(url)
        .then(response => {
            console.log(response.data.dataInfo); // TODO: 삭제 - 데이터 확인용
            setServiceData(response.data.dataInfo);
        })
        .catch(error => {
            console.error("Error fetching service data:", error);
        });
    }, []);


    // 서비스 선택 처리
    const handleServiceChange = (serviceCode) => {
        setSelectedServices((prevSelectedServices) => {
            const isSelected = prevSelectedServices.includes(serviceCode);
            const updatedServices = isSelected
                ? prevSelectedServices.filter((code) => code !== serviceCode)
                : [...prevSelectedServices, serviceCode];

            setServiceError(validateServices(updatedServices));

            return updatedServices;
        });
    };

    // 실시간 발리데이션 함수
    const validateAndSetOrgNm = (value) => {
        setOrgNm(value);
        setOrgNmError(validateRequired(value) === true ? '' : validateRequired(value));
    };
    const validateAndSetName = (value) => {
        setName(value);
        setNameError(validateRequired(value) === true ? '' : validateRequired(value));
    };
    const validateAndSetPhone = (value) => {
        setPhone(value);
        setPhoneError(validatePhone(value) === true ? '' : validatePhone(value));
    };
    const validateAndSetEmail = (value) => {
        setEmail(value);
        setEmailError(validateEmail(value) === true ? '' : validateEmail(value));
    };
    const validateAndSetBudget = (value) => {
        setBudget(value);
        setBudgetError(validateNumber(value) === true ? '' : validateNumber(value));
    };
    const validateAndSetSchedule = (value) => {
        setSchedule(value);
        setScheduleError(validateNumber(value) === true ? '' : validateNumber(value));
    };
    const validateAndSetDescription = (value) => {
        setDescription(value);
        setDescriptionError(validateRequired(value) === true ? '' : validateRequired(value));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 입력값 유효성 검사 및 에러 메시지 설정
        const orgNmValidation = validateRequired(orgNm);
        const nameValidation = validateRequired(name);
        const phoneValidation = validatePhone(phone);
        const emailValidation = validateEmail(email);
        const budgetValidation = validateNumber(budget);
        const scheduleValidation = validateNumber(schedule);
        const descriptionValidation = validateRequired(description);
        const serviceValidation = selectedServices.length > 0 ? true : '최소 하나의 서비스를 선택해주세요.';

        setOrgNmError(orgNmValidation === true ? '' : orgNmValidation);
        setNameError(nameValidation === true ? '' : nameValidation);
        setPhoneError(phoneValidation === true ? '' : phoneValidation);
        setEmailError(emailValidation === true ? '' : emailValidation);
        setBudgetError(budgetValidation === true ? '' : budgetValidation);
        setScheduleError(scheduleValidation === true ? '' : scheduleValidation);
        setDescriptionError(descriptionValidation === true ? '' : descriptionValidation);
        setServiceError(serviceValidation === true ? '' : serviceValidation);

        if (
            orgNmValidation !== true
            || nameValidation !== true
            || phoneValidation !== true
            || emailValidation !== true
            || budgetValidation !== true
            || scheduleValidation !== true
            || descriptionValidation !== true
            || serviceValidation !== true
        ) {
            return;
        }

        const data = {
            orgNm: orgNm,
            name: name,
            phone: phone,
            email: email,
            budget: budget,
            schedule: schedule,
            description: description,
            service: selectedServices
        };
        console.log(data); // TODO: 삭제 - 데이터 확인용

        const url = '/api/routes/Contact/add';
        axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(() => {
            setModalMessage('문의가 제출되었습니다.');
            setShowCancel(false);
            setIsModalVisible(true);
            // 폼 초기화
            setOrgNm('');
            setName('');
            setPhone('');
            setEmail('');
            setBudget('');
            setSchedule('');
            setDescription('');
            setSelectedServices([]);
        })
        .catch((error) => {
            setModalMessage('문의 제출에 실패하였습니다. 다시 시도해주세요.');
            setShowCancel(false);
            setIsModalVisible(true);
        });
    };

    return (
        <section id="page04" className={`section ${inView ? 'view' : ''}`} ref={ref}>
            <form className="wrap" onSubmit={handleSubmit}>
                <div className="component">
                    <div className="maintext">CONTACT</div>
                    <span>
                        아이디어만 있어도 좋아요, <br />
                        소프트랩 흄과 함께 할 당신을 소개해주세요.
                    </span>
                </div>

                <div>
                {/* <div className="o1000"> */}
                    <div className="board">
                        <div className="left">
                            <ul id="question">
                                <li className="number">01</li>
                                <li className="text">고객 정보</li>
                                <li className="memo">* 기재하신 연락처로 담당자가 연락 또는 이메일을 드립니다.</li>
                            </ul>

                            <ul id="answer">
                                <li>
                                    <div className="grid custom-grid">
                                        <div>
                                            <input
                                                type="text"
                                                name="office"
                                                value={orgNm}
                                                placeholder="회사 또는 기관명"
                                                onChange={(e) => validateAndSetOrgNm(e.target.value)}
                                            />
                                            <div className="error" style={{ color: 'red' }}>{orgNmError}</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="manager"
                                                value={name}
                                                placeholder="담당자명"
                                                onChange={(e) => validateAndSetName(e.target.value)}
                                            />
                                            <div className="error" style={{ color: 'red' }}>{nameError}</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="contact"
                                                value={phone}
                                                placeholder="연락처"
                                                onChange={(e) => validateAndSetPhone(e.target.value)}
                                            />
                                            <div className="error" style={{ color: 'red' }}>{phoneError}</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="mail"
                                                value={email}
                                                placeholder="이메일"
                                                onChange={(e) => validateAndSetEmail(e.target.value)}
                                            />
                                            <div className="error" style={{ color: 'red' }}>{emailError}</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <ul id="question">
                                <li className="number">02</li>
                                <li className="text">함께 하고 싶은 서비스는 무엇인가요?</li>
                                <li className="memo">* 중복선택가능</li>
                            </ul>

                            <div id="select">
                                {Array.isArray(serviceData) && serviceData.map((service, index) => (
                                    <label key={index} className="checkbox button">
                                        {service.SERVICE_NM}
                                        <input
                                            type="checkbox"
                                            name="tag"
                                            hidden
                                            value={service.SERVICE_CD}
                                            onChange={() => handleServiceChange(service.SERVICE_CD)}
                                        />
                                    </label>
                                ))}
                                <div className="error" style={{ color: 'red' }}>{serviceError}</div>
                            </div>
                        </div>

                        <div className="right">
                            <ul id="question">
                                <li className="number">03</li>
                                <li className="text">프로젝트 예산 / 일정을 알려주세요.</li>
                            </ul>

                            <ul id="answer">
                                <li>
                                    <div className="grid custom-grid2">
                                        <div>
                                            <div>
                                            <input
                                                type="text"
                                                name="budget"
                                                value={budget}
                                                placeholder="예산 입력 (단위: 만 원)"
                                                onChange={(e) => validateAndSetBudget(e.target.value)}
                                            />
                                            </div>
                                            <div className="error" style={{ color: 'red' }}>{budgetError}</div>
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="scedule"
                                                value={schedule}
                                                placeholder="일정 입력 (단위: 일)"
                                                onChange={(e) => validateAndSetSchedule(e.target.value)}
                                            />
                                            <div className="error" style={{ color: 'red' }}>{scheduleError}</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <ul id="question">
                                <li className="number">04</li>
                                <li className="text">구상 중이신 프로젝트에 대해 자세히 설명해 주세요.</li>
                            </ul>

                            <ul id="answer">
                                <li>
                                    <div>
                                        <span className="ex">
                                            예시) <br />
                                            프로젝트 제목 : 소프트랩 흄 모바일 앱 리뉴얼<br />
                                            프로젝트 목적 : 기존 앱을 트렌드에 맞게 리뉴얼하고 싶습니다.<br />
                                            선호하는 컨셉 : 홈페이지 주소 또는 텍스트로 입력해주세요.<br />
                                            문의 내용 : 프로젝트에 대해 강조하고 싶은 내용을 입력해주세요.
                                        </span>
                                        <textarea
                                            name="explain"
                                            value={description}
                                            onChange={(e) => validateAndSetDescription(e.target.value)}
                                        />
                                        <div className="error" style={{ color: 'red' }}>{descriptionError}</div>
                                    </div>
                                </li>
                            </ul>

                            <input type="submit" name="제출" />
                        </div>
                    </div>
                </div>
            </form>
            {isModalVisible && (
                <Modal
                    message={modalMessage}
                    onConfirm={() => setIsModalVisible(false)}
                    onCancel={() => setIsModalVisible(false)}
                    showCancel={showCancel}
                />
            )}
        </section>
    );
}
