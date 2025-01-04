'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../../css/projectDetail.css';
import Link from 'next/link';

export default function UserProjectDetail() {
    const { projectNb } = useParams();
    const router = useRouter();
    const [projectOneData, setProjectOneData] = useState(null);

    // project 단일 조회
    useEffect(() => {
        const url = `/api/routes/Project/${projectNb}`;

        axios.get(url)
            .then(response => {
                console.log(response.data.dataInfo); // TODO : 삭제 - 데이터 확인용
                setProjectOneData(response.data.dataInfo);
            })
            .catch(error => {
                console.error("Error fetching project data:", error);
            });
    }, [projectNb]);

    // 뒤로가기 함수 추가
    const handleGoBack = () => {
        router.back();
    };

    return (
        <>
            <main>
                <section id="project01" className="section">
                    <div className="wrap">
                        <div className="title">
                            <div className="text">
                                {projectOneData?.projectInfo?.TITLE}
                                <span>{projectOneData?.projectInfo?.SUB_TITLE}</span>
                            </div>
                            <div className="stack">
                                {projectOneData?.projectInfo?.STACK ? 
                                    JSON.parse(projectOneData.projectInfo.STACK).stack.join(' / ') : 
                                    '스택 정보 없음'}
                            </div>
                        </div>

                        <ul className="list">
                            <img src={projectOneData?.projectInfo?.PROJECT_IMG} alt="" />
                            <textarea className="explain" readOnly value={projectOneData?.projectInfo?.PROJECT_INFO}></textarea>
                            {/* <pre className="explain">
                                {projectOneData?.projectInfo?.PROJECT_INFO}
                            </pre> */}
                            {/* <div className="explain">
                                {projectOneData?.projectInfo?.PROJECT_INFO}
                            </div> */}
                        </ul>

                        <span className="app">*실제 사용 시 어플리케이션 이미지</span>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={10}
                            slidesPerView={4}
                            centeredSlides={false}
                            loop={false}
                            pagination={{ clickable: true, el: ".swiper-pagination" }}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                300: { slidesPerView: 1 },
                                400: { slidesPerView: 1 },
                                600: { slidesPerView: 2 },
                                800: { slidesPerView: 3 },
                                1000: { slidesPerView: 3 },
                                1100: { slidesPerView: 3 },
                            }}
                            className="swiper"
                        >
                            {projectOneData?.projectFiles?.map(file => (
                                <SwiperSlide key={file.ID}>
                                    <img src={file.PROJECT_IMG} alt={`Project Image ${file.SORT}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="swiper-pagination"></div>
                    </div>
                </section>
                <button 
                    className="project-detail-custom-btn" 
                    onClick={handleGoBack}
                >
                    돌아가기
                </button>
            </main>
        </>
    );
}

