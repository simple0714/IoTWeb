import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody } from "@mui/material"; 
import axios from "axios";
import { useSetRecoilState } from 'recoil';
import { selectedAboutIdState } from '../atoms';
import Modal from "./Modal";

function AdAbout({ setSelectedNav }) {
  const setSelectedAboutId = useSetRecoilState(selectedAboutIdState);
  const URL = "http://localhost:3001/apis/about";
  const URL2 = "http://localhost:3001/apis/about/deleteAbout";
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL);
      setData(response.data.dataInfo.rows);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (id) => {
    // 소개글 삭제시 에러를 반환하지 않을 경우 성공처리로 변경
    showConfirmModal(
      "소개글 삭제",
      "정말로 이 소개글을 삭제하시겠습니까?",
      async () => {
        try {
          const response = await axios.delete(`${URL2}?id=${id}`, {
            headers: {
              'accept': 'application/json'
            }
          });
          
          if (!response.data.error) {
            showAlertModal("성공", "소개글이 성공적으로 삭제되었습니다.");
            fetchData(); // 데이터 다시 불러오기
          } else {
            showAlertModal("오류", `소개글 삭제에 실패했습니다: ${response.data.error}`);
          }
        } catch (error) {
          console.error("Error deleting about:", error);
          showAlertModal("오류", "소개글 삭제 중 오류가 발생했습니다.");
        }
      }
    );
  };

  const tableStyle = {
    overflow: 'hidden',
    '& .MuiTable-root': {
      width: '100%',
    },
    '& .MuiTableCell-root': {
      color: 'black',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      padding: { xs: '8px', sm: '16px' }, // 반응형 패딩
    },
    '& .MuiTableRow-root': {
      opacity: 1,
      '&:hover': {
        opacity: 1,
      },
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      color: 'white',
      backgroundColor: 'black',
      borderBottom: '1px solid white',
      '&:first-of-type': {
        borderRight: '1px solid white',
      },
    },
    '& .always-visible': {
      opacity: 1,
      '&:hover': {
        opacity: 1,
      },
    },
  };
  
  return(
    <Box sx={{ 
      mt: 2, 
      px: { xs: 1, sm: 2 }, // 반응형 패딩
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto',
      overflowX: 'auto' // 작은 화면에서 가로 스크롤 허용
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        소개글 조회
      </Typography>
      <Box sx={{ 
        display: "flex", 
        mb: 2, 
        alignItems: "center", 
        justifyContent: "flex-end",
        flexWrap: 'wrap' // 작은 화면에서 버튼 줄바꿈
      }}>
        <Box>
          <Button 
            variant="contained" 
            onClick={() => setSelectedNav('addabout')}
            sx={{ 
              mr: { xs: 1, sm: 2 }, // 반응형 마진
              mb: { xs: 1, sm: 0 }, // 작은 화면에서 아래 마진 추가
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
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: { xs: "30%", sm: "20%" }, fontWeight: 'bold' }}>제목</TableCell>
              <TableCell align="center" sx={{ width: { xs: "40%", sm: "60%" }, fontWeight: 'bold' }}>내용</TableCell>
              <TableCell align="center" sx={{ width: { xs: "30%", sm: "20%" }, fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.ID} className="always-visible">
                <TableCell align="left" sx={{ cursor: 'default !important' }}>{row.TITLE}</TableCell>
                <TableCell align="left" sx={{ cursor: 'default !important' }}>{row.SUB_TITLE}</TableCell>
                <TableCell align="center">
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center",
                    flexDirection: { xs: 'column', sm: 'row' }, // 작은 화면에서 버튼 세로 배치
                    gap: { xs: 1, sm: 0 } // 작은 화면에서 버튼 사이 간격
                  }}>
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        setSelectedAboutId(row.ID);
                        setSelectedNav('updateabout');
                      }}
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.5)', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 1)',
                        },
                        mr: { xs: 0, sm: 1 },  // 반응형 마진
                        mb: { xs: 1, sm: 0 },  // 작은 화면에서 아래 마진 추가
                        width: { xs: '100%', sm: 'auto' } // 작은 화면에서 전체 너비
                      }}
                    >
                      수정
                    </Button>
                    <Button 
                      variant="contained"
                      onClick={() => handleDelete(row.ID)}
                      sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.5)', 
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 1)',
                        },
                        width: { xs: '100%', sm: 'auto' } // 작은 화면에서 전체 너비
                      }}
                    >
                      삭제
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        {...modalProps}
      />
    </Box>
  );
}

export default AdAbout;
