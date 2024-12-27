// 대시보드 컴포넌트
// 협력사 슬라이더의 이미지, 텍스트를 클릭했을 때 페이지 이동 기능 추가 완료, 사용경험 불편시 수정 todo
// 프로젝트 슬라이더는 텍스트를 클릭했을 때 페이지 이동 기능 추가, 이미지는 제외

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Grid } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "../lib/sliderCustom.css";

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIosNewIcon
      className={className}
      style={{ ...style, display: "block", color: "white" }}
      onClick={onClick}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIosIcon
      className={className}
      style={{ ...style, display: "block", color: "white" }}
      onClick={onClick}
    />
  );
}

function Dashboard({ setSelectedNav }) {
  const URL = "http://localhost:3001/apis/about"; 
  const URL2 = "http://localhost:3001/apis/project/listAll";
  const URL3 = "http://localhost:3001/apis/partner/list";
  const [aboutData, setAboutData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL);
      // console.log(response.data.dataInfo.rows);
      setAboutData(response.data.dataInfo.rows);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };
  const fetchData2 = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL2);
      // console.log(response.data.dataInfo.projectList);
      setProjectData(response.data.dataInfo.projectList);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };
  const fetchData3 = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL3);
      console.log(response.data.dataInfo);
      setPartnerData(response.data.dataInfo);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
  }, []);


  const tableStyle = {
    '& .MuiTableCell-root': {
      color: 'black',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
    },
    '& .MuiTableRow-root': {
      cursor: 'pointer',
      opacity: 1, // 불투명도를 1로 고정
      '&:hover': {
        opacity: 1, // 호버 시에도 불투명도를 1로 유지
      },
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      color: 'white',
      backgroundColor: 'black',
      borderBottom: '1px solid white',
      borderRight: '1px solid white',
      '&:last-child': {
        borderRight: 'none',
      },
    },
    '& .always-visible': {
      opacity: 1,
      '&:hover': {
        opacity: 1,
      },
    },
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    // prevArrow: <SamplePrevArrow />,
    // nextArrow: <SampleNextArrow />
    arrows: false,
  };

   // 소개글 수정 핸들러
   const handleUpdateAboutClick = () => {
    alert("소개글 조회에서 수정할 게시물을 선택해주세요");
    setSelectedNav("about");
  };

  // 프로젝트 수정 핸들러
  const handleUpdateProjectClick = () => {
    alert("프로젝트 조회에서 수정할 게시물을 선택해주세요");
    setSelectedNav("project");
  };

  // 협력사 수정 핸들러
  const handleUpdatePartnerClick = () => {
    alert("협력사 조회에서 수정할 게시물을 선택해주세요");
    setSelectedNav("partner");
  };

  return(
    <Box sx={{ 
      mt: 2, 
      px: { xs: 1, sm: 2 }, 
      minWidth: { xs: '100%', md: '1000px' },
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", flexShrink: 0 }}>
        대시보드
      </Typography>
      <Box className="dashboard-content" sx={{ 
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <Box className="about-container" sx={{ mb: 5, width: '100%' }}>
          <Box sx={{ display: "flex", mb: 2, alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ mr: 2, fontWeight: "bold", mb: { xs: 1, sm: 0 } }}>
                소개글 (적용중)
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setSelectedNav('addabout')}
                sx={{ 
                  mr: 2, 
                  mb: { xs: 1, sm: 0 },
                  bgcolor: 'black', 
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >추가
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={tableStyle}>
              <TableBody>
                {aboutData.map((row) => (
                  <TableRow key={row.ID} className="always-visible" onClick={() => setSelectedNav('about')}>
                    <TableCell align="left" sx={{ width: { xs: "40%", sm: "30%" }, borderRight: "1px solid gray" }}>{row.TITLE}</TableCell>
                    <TableCell align="left" sx={{ width: { xs: "60%", sm: "70%" } }}>{row.SUB_TITLE}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="project-container" sx={{ mb: 5, width: '100%' }}>
          <Box sx={{ display: "flex", mb: 2, alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ mr: 2, fontWeight: "bold", mb: { xs: 1, sm: 0 } }}>
                프로젝트 (적용중)
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setSelectedNav('addproject')}
                sx={{ 
                  mr: 2, 
                  mb: { xs: 1, sm: 0 },
                  bgcolor: 'black', 
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                추가
              </Button>
            </Box>
          </Box>
          <Slider {...settings}>
            {projectData.map((project) => (
              <Box key={project.ID} sx={{ p: 1 }}>
                <img 
                  src={project.PROJECT_IMG} 
                  alt={project.TITLE} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
                <Typography 
                  align="center" 
                  sx={{ mt: 1, fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => setSelectedNav('project')}
                >
                  {truncateText(project.TITLE, 10)}
                </Typography>
              </Box>
            ))}
          </Slider>
        </Box>
        <Box className="partner-container" sx={{ mb: 3, width: '100%' }}>
          <Box sx={{ display: "flex", mb: 2, alignItems: "center", justifyContent: "flex-start", flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
              <Typography variant="h6" sx={{ mr: 2, fontWeight: "bold", mb: { xs: 1, sm: 0 } }}>
                협력사 배너 (적용중)
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setSelectedNav('addpartner')}
                sx={{ 
                  mr: 2, 
                  mb: { xs: 1, sm: 0 },
                  bgcolor: 'black', 
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  }
                }}
              >
                추가
              </Button>
            </Box>
          </Box>
          <Slider {...settings}>
            {partnerData.map((row) => (
              <Box key={row.ID} sx={{ p: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  mx: 0.5
                }}
                >
                  <img 
                    src={row.PARTNER_IMG}
                    alt={row.PARTNER_NM}
                    style={{ 
                      width: '150px', 
                      height: '100px', 
                      objectFit: 'contain',
                      marginBottom: '10px',
                      cursor: 'pointer',
                    }} 
                    onClick={() => setSelectedNav('partner')}
                  />
                  <Typography 
                    align="center" 
                    sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                    onClick={() => setSelectedNav('partner')}
                  >
                    {truncateText(row.PARTNER_NM, 10)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>    
      </Box>
    </Box>
  )
}

export default Dashboard;
