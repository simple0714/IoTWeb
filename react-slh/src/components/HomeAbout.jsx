import React, {useState, useEffect} from "react";
import { useIntersectionObserver } from "../IntersectionObserverContext";
import axios from 'axios';

function About() {
    const {ref, inView } = useIntersectionObserver();
    const URL =
    "http://localhost:3001/apis/about";
    // About 소개글 조회

    const [data, setData] = useState([]);
    const [loding, setLoding] = useState([]);
    const [error, setError] = useState([]);

    const fetchData = async () => {
        try {
            setError(null);
            setLoding(true);

            const response = await axios.get(URL);
            // console.log(response.data);
            // 응답 데이터 확인, 전체 출력
            // 확인완료 주석처리 2024-10-08, 10:26
            setData(response.data.dataInfo.rows);

        } catch(e) {
            setError(e);
        }
        setLoding(false);
    };
    useEffect(() => {
        fetchData();
    }, []);



    return(
        <section id="page02" className={`section ${inView ? 'view' : ''}`} ref={ref}>
            <div className="wrap">
                <div className="component">
                    <div className="maintext">About</div>
                    <span>" 사람을 위한 실용적인 기술을 만드는 소프트랩 흄 입니다. "</span>
                </div>

                <ul className="grid">
                    {data && data.map((item, index) => (
                        <li key={index}>
                            <img src={item.ICON} alt="" />
                            <div className="name">{item.TITLE}</div>
                            <div className="subname">{item.SUB_TITLE}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default About;