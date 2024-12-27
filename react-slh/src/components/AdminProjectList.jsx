import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useSetRecoilState } from 'recoil';
import { selectedProjectIdState } from '../atoms';
import Modal from "./Modal";

// 커스텀 Pagination 스타일
const CustomPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  },
}));

function ProjectList({ setSelectedNav }) {
  const setSelectedProjectId = useSetRecoilState(selectedProjectIdState);
  const URL = "http://localhost:3001/apis/project/listAll"; // 프로젝트 리스트 전체조회

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState(""); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]); // 검색 결과 상태
  const [isSearchClicked, setIsSearchClicked] = useState(false); // 검색 버튼 클릭 여부
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL);
      console.log(response.data);
      setData(response.data.dataInfo.projectList);
      setFilteredResults(response.data.dataInfo.projectList); // 초기값 설정
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 검색 필터링 함수
  const handleSearch = () => {
    const results = data.filter(
      (project) =>
        project.PROJECT_INFO.includes(searchTerm) ||
        project.CREATE_AT.includes(searchTerm)
    );
    setFilteredResults(results);
    setIsSearchClicked(true);
    setPage(1); // 검색 시 첫 페이지로 리셋
  };

  const sortedProjects = data
    .slice()
    .sort((a, b) => new Date(b.CREATE_AT) - new Date(a.CREATE_AT));

  const displayedProjects = isSearchClicked ? filteredResults : sortedProjects;

  const pageCount = Math.ceil(displayedProjects.length / itemsPerPage);

  const currentProjects = displayedProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event, value) => {
    setPage(value);
  };

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
      // '&:nth-last-of-type(-n+2)' << 디자인 둘 중 하나 선택
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProjectClick = (projectNb) => {
    setSelectedProjectId(projectNb);  // Recoil 상태 업데이트
    setSelectedNav('updateproject');
  };

  const showConfirmModal = (title, message, confirmAction) => {
    setModalProps({ 
      title, 
      message, 
      mode: "confirm", 
      onConfirm: () => {
        confirmAction();
        setShowModal(false);
      },
      onCancel: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const showAlertModal = (title, message) => {
    setModalProps({ 
      title, 
      message, 
      mode: "alert",
      onConfirm: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const handleDelete = async (projectNb) => {
    showConfirmModal(
      "프로젝트 삭제",
      "정말로 이 프로젝트를 삭제하시겠습니까?",
      async () => {
        try {
          const response = await axios.delete(`http://localhost:3001/apis/project/deleteProject?projectNb=${projectNb}`, {
            headers: {
              'accept': 'application/json'
            }
          });
          
          if (!response.data.error) {
            showAlertModal("성공", "프로젝트가 성공적으로 삭제되었습니다.");
            fetchData(); // 데이터 다시 불러오기
          } else {
            showAlertModal("오류", `프로젝트 삭제에 실��했습니다: ${response.data.error}`);
          }
        } catch (error) {
          console.error("Error deleting project:", error);
          showAlertModal("오류", "프로젝트 삭제 중 오류가 발생했습니다.");
        }
      }
    );
  };

  return (
    <Box sx={{ 
        mt: 2, 
        px: { xs: 2, sm: 4 },
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        프로젝트 조회
      </Typography>
      <Box sx={{ 
        display: "flex", 
        mb: 2, 
        alignItems: "center", 
        justifyContent: "space-between",
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center",
          width: { xs: '100%', sm: 'auto' }
        }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="프로젝트명 검색"
            size="small"
            sx={{ width: { xs: '100%', sm: '300px' }, mr: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
            sx={{ 
              bgcolor: 'black', 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            검색
          </Button>
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: 'black', 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)',
              },
              width: '100%'
            }}
            onClick={() => setSelectedNav('addproject')}
          >
            추가
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ flexGrow: 1, mb: 2}}>
        <Table sx={tableStyle}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: { xs: "25%", sm: "20%" }, fontWeight: 'bold' }}>이미지</TableCell>
              <TableCell align="center" sx={{ width: { xs: "35%", sm: "40%" }, fontWeight: 'bold' }}>프로젝트명</TableCell>
              <TableCell align="center" sx={{ width: "20%", fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Stack</TableCell>
              <TableCell align="center" sx={{ width: { xs: "40%", sm: "20%" }, fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.map((project) => (
              <TableRow key={project.ID}>
                <TableCell align="center">
                  <img src={project.PROJECT_IMG} alt="" style={{ width: "100%", maxWidth: "100px", height: "auto", maxHeight: "60px", objectFit: "contain" }}/>
                </TableCell>
                <TableCell align="center">{project.TITLE}</TableCell>
                <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{JSON.parse(project.STACK).stack.join(", ")}</TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center",
                    flexDirection: 'row',
                    gap: 1
                  }}>
                    <Button 
                      variant="contained"
                      onClick={() => handleProjectClick(project.PROJECT_NB)}
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.5)', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 1)',
                        },
                        padding: { xs: '4px 8px', sm: '6px 16px' },
                        fontSize: { xs: '0.7rem', sm: '0.875rem' }
                      }}
                    >
                      수정
                    </Button>
                    <Button 
                      variant="contained"
                      onClick={() => handleDelete(project.PROJECT_NB)}
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.5)', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 1)',
                        },
                        padding: { xs: '4px 8px', sm: '6px 16px' },
                        fontSize: { xs: '0.7rem', sm: '0.875rem' }
                      }}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {[...Array(Math.max(0, itemsPerPage - currentProjects.length))].map((_, index) => (
              <TableRow key={`empty-${index}`} sx={{ height: "133px" }}>
                <TableCell colSpan={3}>&nbsp;</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 'auto',
        pb: 2
      }}>
        <CustomPagination 
          count={pageCount} 
          page={page} 
          onChange={handleChangePage} 
          shape="rounded"
          size="small"
        />
      </Box>
      
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        {...modalProps}
      />
    </Box>
  );
}

export default ProjectList;
