"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// 관리자 페이지 - 대시 보드
export default function AdminPage() {

    // 테마 설정
    const [theme, setTheme] = useState('white');
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    //소개글 데이터 획득
    const [aboutData, setAboutData] = useState([]);
    useEffect(() => {   
        const url = '/api/routes/About';
        axios.get(url)
        .then(response => {
            setAboutData(response.data.dataInfo.rows);
        })
        .catch(error => {
            console.error('Error fetching about data:', error);
        });
    }, []);

    //프로젝트 데이터 획득
    const [projectData, setProjectData] = useState([]);
    useEffect(() => {
        const url = '/api/routes/Project';
        axios.get(url)
        .then(response => {
            setProjectData(response.data.dataInfo.projectList);
        })
        .catch(error => {
            console.error('Error fetching project data:', error);
        });
    }, []);

    //협력사 데이터 획득
    const [partnerData, setPartnerData] = useState([]);
    useEffect(() => {
        const url = '/api/routes/Partner';
        axios.get(url)
        .then(response => {
            console.log(response.data.dataInfo);
            setPartnerData(response.data.dataInfo);
        })
        .catch(error => {
            console.error('Error fetching partner data:', error);
        });
    }, []);

    // 스와이퍼 개수 동적 조절
    const [slidesProject, setSlidesProject] = useState(5);
    const [slidesPartner, setSlidesPartner] = useState(6);

    useEffect(() => {
        const updateSlidesProject = () => {
            if (window.innerWidth <= 768) {
                setSlidesProject(2);
            } else {
                setSlidesProject(5);
            }
        };

        updateSlidesProject();
        window.addEventListener('resize', updateSlidesProject);

        return () => {
            window.removeEventListener('resize', updateSlidesProject);
        };
    }, []);

    useEffect(() => {
        const updateSlidesPartner = () => {
            if (window.innerWidth <= 768) {
                setSlidesPartner(3);
            } else {
                setSlidesPartner(6);
            }
        };

        updateSlidesPartner();
        window.addEventListener('resize', updateSlidesPartner);

        return () => {
            window.removeEventListener('resize', updateSlidesPartner);
        };
    }, []);

    return (
        <>
            <div>
                <main className="grid grid-cols-1 gap-4">
                    <h2 className="text-3xl font-bold">대시 보드</h2>
                    <div className='p-4'>
                        <div className="flex justify-between pb-2">
                            <div className="text-2xl font-bold">소개글</div>
                            <Link href="/admin/AdminAbout">
                                <button className="bg-gray-500 text-white px-4 py-2 rounded-md">더보기</button>
                            </Link>
                        </div>
                        {/* 4개만 뿌리기 */}
                        {aboutData.slice(0, 6).map((item, index) => (
                            <div key={index} className='p-4 flex border rounded-md'>
                                <div className='w-3/12'>
                                    <Link
                                        href={`/admin/AdminAbout`}
                                        className='line-clamp-1'
                                        title={item.TITLE}
                                    >
                                        {item.TITLE}
                                    </Link>
                                </div>
                                <div className='w-9/12'>
                                    <Link
                                        href={`/admin/AdminAbout`}
                                        className='line-clamp-1'
                                        title={item.SUB_TITLE}
                                    >
                                        {item.SUB_TITLE}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='p-4'>
                        <div className="flex justify-between pb-2">
                            <div className="text-2xl font-bold">프로젝트</div>
                            <Link href="/admin/AdminProject">
                                <button className="bg-gray-500 text-white px-4 py-2 rounded-md">더보기</button>
                            </Link>
                        </div>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={slidesProject}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                        >
                            {projectData.map((project, index) => (
                                <SwiperSlide key={index}>
                                    <div className='p-2 flex flex-col justify-center items-center'>
                                        <Link href={`/admin/AdminProject`}>
                                            <img src={project.PROJECT_IMG} alt={project.TITLE} className='w-[200px] h-[200px]' title={project.TITLE}/>
                                            {/* <div className='text-center text-sm'>{project.TITLE.length > 10 ? project.TITLE.substring(0,10) + '...' : project.TITLE}</div> */}
                                            <div className='text-center text-sm line-clamp-1' title={project.TITLE}>
                                                {project.TITLE}
                                            </div>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className='p-4'>
                        <div className="flex justify-between pb-2">
                            <div className="text-2xl font-bold">협력사</div>
                            <Link href="/admin/AdminPartner">
                                <button className="bg-gray-500 text-white px-4 py-2 rounded-md">더보기</button>
                            </Link>
                        </div>
                        {/* Swiper 적용 */}
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={slidesPartner}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                        >
                            {partnerData.slice(0, 8).map((partner, index) => (
                                <SwiperSlide key={index}>
                                    <div className='p-2 flex flex-col justify-center items-center'>
                                        <Link href={`/admin/AdminPartner`}>
                                            {partner.PARTNER_IMG === 'NO_IMG' ? 
                                                <img className='w-[100px] h-auto'/> : 
                                                <img src={partner.PARTNER_IMG} className='w-[100px] h-auto' title={partner.PARTNER_NM}/>
                                            }
                                        </Link>
                                        <Link href={`/admin/AdminPartner`}>
                                            <div className='text-center text-sm line-clamp-1' title={partner.PARTNER_NM}>
                                                {partner.PARTNER_NM}
                                            </div>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </main>
            </div>
        </>
    );
}
  