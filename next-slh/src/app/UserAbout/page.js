"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "../../utils/IntersectionObserverContext";
import axios from "axios";

export default function UserAbout() {
    const { ref, inView } = useIntersectionObserver();
    const [aboutData, setAboutData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/routes/About');
                console.log(response.data); // TODO : 삭제 - 데이터 확인용
                setAboutData(response.data.dataInfo.rows);
            } catch (error) {
                console.error("About 데이터 가져오기 오류:", error);
                // 일정 시간 후에 다시 시도
                setTimeout(fetchData, 5000); // 5초 후에 다시 시도
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <section id="page02" className={`section ${inView ? 'view' : ''}`} ref={ref}>
                <div className="wrap">
                    <div className="component">
                        <div className="maintext">About</div>
                        <span>" 사람을 위한 실용적인 기술을 만드는 소프트랩 흄 입니다. "</span>
                    </div>
                    <ul className="grid">
                        {aboutData && aboutData.map((item, index) => (
                            <li key={index}>
                                <img src={item.ICON} alt={item.TITLE}/> 
                                <div className="name">{item.TITLE}</div>
                                <div className="subname">{item.SUB_TITLE}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}
