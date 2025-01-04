"use client";

import { useState, useEffect } from "react";
import { useIntersectionObserver } from "../../utils/IntersectionObserverContext";
import axios from "axios";
import Link from 'next/link';

export default function UserProject() {
    const { ref, inView } = useIntersectionObserver();
    
    const [projectData, setProjectData] = useState([]);
    const [stackData, setStackData] = useState([]);
    const [partnerData, setPartnerData] = useState([]);

    // 프로젝트 데이터 요청
    useEffect(() => {
        const url = '/api/routes/Project';   

        axios.get(url)
        .then(response => {
            console.log(response.data.dataInfo.projectList); // TODO : 삭제 - 데이터 확인용
            setProjectData(response.data.dataInfo.projectList);
        })
        .catch(error => {
            console.error("Error fetching project data:", error);
        });
    }, []);

    // 스택 데이터 요청
    useEffect(() => {
        const url = '/api/routes/Stack'; 
        console.log(url);

        axios.get(url)
        .then(response => {
            console.log(response.data); // TODO : 삭제 - 데이터 확인용
            setStackData(response.data);
        })
        .catch(error => {
            console.error("Error fetching stack data:", error);
        });
    }, []);

    // 파트너 데이터 요청
    useEffect(() => {
        const url = '/api/routes/Partner';

        axios.get(url)
        .then(response => {
            console.log(response.data.dataInfo); // TODO : 삭제 - 데이터 확인용
            setPartnerData(response.data.dataInfo);
        })
        .catch(error => {
            console.error("Error fetching partner data:", error);
        });
    }, []);

    const getStackNames = (parsedStack) => {
        return parsedStack.map(stackItem => {
            if (!stackData) return null;
            const matchingStack = stackData.find(stack => stack.STACK_NM === stackItem);
            return matchingStack ? matchingStack.STACK_NM : null;
        }).filter(Boolean).join(' / ');
    };

    const renderStackImages = (parsedStack) => {
        return parsedStack.map((stackItem, stackIndex) => {
            if (!stackData) return null;
            const matchingStack = stackData.find(stack => stack.STACK_NM === stackItem);
            return matchingStack ? (
                <li key={stackIndex}>
                    <img src={matchingStack.ICON} alt={matchingStack.STACK_NM} />
                </li>
            ) : null;
        });
    };

    return (
        <section id="page03" className={`section ${inView ? 'view' : ''}`} ref={ref}>
            <div className="wrap">
                <div className="component">
                    <div className="maintext">Project</div>
                </div>

                <ul className="list">
                    {projectData && projectData.map((item, index) => {
                        let parsedStack = [];
                        try {
                            parsedStack = JSON.parse(item.STACK).stack;
                        } catch (error) {
                            console.error("Error parsing stack data:", error);
                        }

                        const stackNames = getStackNames(parsedStack);

                        return (
                            <li key={index}>
                                <Link href={`/UserProject/Detail/${item.PROJECT_NB}`}>
                                    <img className="projectImg-heightFix" src={item.PROJECT_IMG} alt={item.TITLE} />
                                    <div className="text">
                                        <div className="project" title={item.TITLE}>{item.TITLE}</div>
                                        <ul className="img">
                                            {renderStackImages(parsedStack)}
                                        </ul>
                                        <div className="stack" title={stackNames}>{stackNames}</div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="client">
                    <div className="subtext">PARTNER</div>
                    <div className="text">함께 자라고 성장하는 주요 고객사</div>
                </div>
            </div>

            <div className="animation">
                <ul className="banner">
                    {Array(3).fill().map((_, i) => (
                        partnerData && partnerData.map((item, index) => (
                            <li key={`${i}-${index}`}>
                                {item.PARTNER_IMG !== 'NO_IMG' ? 
                                    <img src={item.PARTNER_IMG} alt={item.PARTNER_NM} />
                                    : <img alt={item.PARTNER_NM} />    
                                } 
                            </li>
                        ))
                    ))}
                </ul>
            </div>
        </section>
    );
}
