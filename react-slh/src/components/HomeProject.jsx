import React, {useState, useEffect} from "react";
import { useIntersectionObserver } from "../IntersectionObserverContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Partner from "./HomePartner";

function homeProject() {
    const {ref, inView } = useIntersectionObserver();
    const URL = 
    "http://localhost:3001/apis/project/listAll"
    // 프로젝트 리스트 전체 조회

    const navigate = useNavigate();
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
            setData(response.data.dataInfo.projectList);
            
        } catch(e) {
            setError(e);
        }
        setLoding(false);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section id="page03" className={`section ${inView ? 'view' : ''}`} ref={ref}> 
            <div className="wrap">
                <div className="component">
                    <div className="maintext">Project</div>
                </div>

                <ul className="list">
                    {data && data.map((item, index) => (
                        <li key={index}>
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    // 페이지 새로고침 방지
                                    e.preventDefault(); 
                                    navigate(`/project/${item.PROJECT_NB}`);
                                }}
                            >
                                <img src={item.PROJECT_IMG} alt="" />
                                <div className="text">
                                    <div className="project">{item.PROJECT_INFO}</div>
                                    <ul className="img">
                                        {item.STACK && JSON.parse(item.STACK).stack.map((tech, idx) => (
                                            <li key={idx}>
                                                {/* 기술 스택에 맞는 이미지를 조건부로 설정 */}
                                                <img 
                                                    src={`./img/${tech}.png`} 
                                                    alt={tech} 
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="stack">
                                    {JSON.parse(item.STACK).stack.join(' / ')}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="client">
                    <div className="subtext">PARTNER</div>
                    <div className="text">함께 자라고 성장하는 주요 고객사</div>
                </div>
            </div>
            <Partner />
        </section>
    )
}

export default homeProject;