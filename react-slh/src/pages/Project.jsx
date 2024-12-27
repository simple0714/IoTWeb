import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styled from 'styled-components';

const ProjectSection = styled.section`
  padding-bottom: 20vw;

  .title {
    text-align: center;
    padding: 7vw 0px;
  }

  .title .text {
    font-size: 2.3rem;
    font-weight: bold;
    transition: all .3s 0s;
  }

  .title .text span {
    font-size: 18px;
  }

  .title .stack {
    padding-top: 2rem;
    transition: all .3s 0s;
    opacity: .5;
  }

  .list {
    display: inline-grid;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3vw;
    padding-bottom: 7vw;
  }

  .list img {
    width: 100%;
    max-height: 500px;
    transition: all .3s 0s;
  }

  .list .explain {
    text-align: left;
    font-size: 1.3rem;
    padding: 20px 5px;
    transition: all .3s 0s;
  }

  .app {
    width: 100%;
    padding: 20px 0px;
    transition: all .3s 0s;
  }

  .swiper-container {
    position: relative;
    padding-bottom: 30px;  
  }

  .swiper-slide img {
    width: 100%;
    height: auto;
  }

  .swiper-pagination {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .swiper-pagination-bullet {
    background: #000;  
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    background: #007aff;  
    opacity: 1;
  }

  @media only screen and (max-width: 1100px) {
    .title .text {
      font-size: 1.8rem;
    }
    .title .stack {
      padding-top: 10px;
    }
    .list .explain {
      font-size: 17px;
    }
  }

  @media only screen and (max-width: 800px) {
    .title .text {
      font-size: 20px;
    }
    .title .text span {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 700px) {
    .title .text {
      font-size: 20px;
      line-height: 26px;
    }
    .list .explain {
      font-size: 16px;
    }
  }

  @media only screen and (max-width: 600px) {
    .title {
      text-align: left;
      padding: 7vw 10px 2vw;
    }
    .list {
      grid-template-columns: 1fr;
      padding-bottom: 10vw;
    }
    .list img {
      max-height: 350px;
    }
    .swiper-slide img {
      max-height: 550px;
    }
  }

  @media only screen and (max-width: 400px) {
    .title .text {
      font-size: 17px;
      line-height: 25px;
    }
    .title .text span {
      font-size: 13px;
    }
    .title .stack {
      font-size: 13px;
    }
    .list img {
      max-height: 230px;
    }
    .list .explain {
      padding: 0px 5px;
    }
  }
`;

function Project() {
    const { ID } = useParams();
    console.log(ID);
    const URL = `http://localhost:3001/apis/project/findOne?projectNb=${ID}`;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setError(null);
            const response = await axios.get(URL);
            setData(response.data.dataInfo);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data available</div>;

    const { projectInfo, projectFiles } = data;

    return (
        <ProjectSection id="project01" className="section">
            <div className="wrap">
                <div className="title">
                    <div className="text">
                        {projectInfo.TITLE}
                        <br />
                        <span>{projectInfo.SUB_TITLE}</span>
                    </div>
                    <div className="stack">{JSON.parse(projectInfo.STACK).stack.join(' / ')}</div>
                </div>
                
                <ul className="list">
                    <img src={projectInfo.PROJECT_IMG} alt="" />
                    <div className="explain">{projectInfo.PROJECT_INFO}</div>
                </ul>
                
                <span className="app">*실제 사용 시 시스템 이미지</span>
                
                <div className="swiper-container">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                        }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        spaceBetween={10}
                        slidesPerView={4}
                        loop={false}
                        centeredSlides={false}
                        breakpoints={{
                            300: { slidesPerView: 1 },
                            400: { slidesPerView: 1 },
                            600: { slidesPerView: 2 },
                            800: { slidesPerView: 3 },
                            1000: { slidesPerView: 3 },
                            1100: { slidesPerView: 3 },
                        }}
                    >
                        {projectFiles.map(file => (
                            <SwiperSlide key={file.ID}>
                                <img src={file.PROJECT_IMG} alt="" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="swiper-pagination"></div>
                </div>
            </div>
        </ProjectSection>
    );
}

export default Project;
