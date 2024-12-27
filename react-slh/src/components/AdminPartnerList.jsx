import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, TextField, Pagination, useTheme, useMediaQuery } from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useSetRecoilState } from 'recoil';
import { selectedPartnerIdState } from '../atoms';
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

function AdPartnerList({ setSelectedNav }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const setSelectedPartnerId = useSetRecoilState(selectedPartnerIdState);
    const URL = "http://localhost:3001/apis/partner/list";
    const URL_DELETE = "http://localhost:3001/apis/partner/delete";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalProps, setModalProps] = useState({});

    const fetchData = async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await axios.get(URL);
            console.log(response.data);
            // 날짜순으로 정렬 (최신순)
            const sortedData = response.data.dataInfo.sort((a, b) => new Date(b.CREATE_AT) - new Date(a.CREATE_AT));
            setData(sortedData);
            setFilteredResults(sortedData);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearch = () => {
        const results = data.filter(
            (partner) => partner.PARTNER_NM.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredResults(results);
        setIsSearchClicked(true);
        setPage(1);
    };

    const getPaginatedData = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return (isSearchClicked ? filteredResults : data).slice(startIndex, endIndex);
    };

    const tableStyle = {
        '& .MuiTableCell-root': {
          color: 'black',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
          padding: isMobile ? '8px 4px' : isTablet ? '12px 8px' : '16px',
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
        showConfirmModal(
            "협력사 삭제",
            "정말로 이 협력사를 삭제하시겠습니까?",
            async () => {
                try {
                    const response = await axios.delete(`${URL_DELETE}?id=${id}`, {
                        headers: {
                            'accept': 'application/json'
                        }
                    });
                    
                    if (!response.data.error) {
                        showAlertModal("성공", "협력사가 성공적으로 삭제되었습니다.");
                        fetchData(); // 데이터 다시 불러오기
                    } else {
                        showAlertModal("오류", `협력사 삭제에 실패했습니다: ${response.data.error}`);
                    }
                } catch (error) {
                    console.error("Error deleting partner:", error);
                    showAlertModal("오류", "협력사 삭제 중 오류가 발생했습니다.");
                }
            }
        );
    };

    const handlePartnerClick = (partnerId) => {
        setSelectedPartnerId(partnerId);
        setSelectedNav('updatepartner');
    };

    return(
        <Box sx={{ 
            mt: 2, 
            px: { xs: 2, sm: 3, md: 4 }, 
            minWidth: { xs: '100%', sm: '100%', md: '940px' },
            maxWidth: '100%',
            minHeight: 'calc(100vh - 320px)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                협력사 조회
            </Typography>
            <Box sx={{ 
                display: "flex", 
                mb: 2, 
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                alignItems: { xs: 'stretch', sm: 'stretch', md: 'center' }, 
                justifyContent: "space-between" 
            }}>
                <Box sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    mb: { xs: 2, sm: 2, md: 0 },
                    width: { xs: '100%', sm: '100%', md: 'auto' },
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="협력사명 검색"
                        size="small"
                        sx={{ 
                            width: { xs: '100%', sm: '100%', md: '300px' }, 
                            mr: { xs: 0, sm: 2 },
                            mb: { xs: 2, sm: 0 }
                        }}
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
                <Box sx={{ width: { xs: '100%', sm: '100%', md: 'auto' } }}>
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
                        onClick={() => setSelectedNav('addpartner')}
                    >
                        추가
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ flexGrow: 1, mb: 2, overflowX: 'auto' }}>
                <Table sx={tableStyle}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: isMobile ? "30%" : isTablet ? "25%" : "20%", fontWeight: 'bold' }}>로고</TableCell>
                            <TableCell align="center" sx={{ width: isMobile ? "40%" : isTablet ? "50%" : "60%", fontWeight: 'bold' }}>협력사명</TableCell>
                            <TableCell align="center" sx={{ width: isMobile ? "30%" : isTablet ? "25%" : "20%", fontWeight: 'bold' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getPaginatedData().map((row) => (
                            <TableRow key={row.ID}>
                                <TableCell align="center">
                                    <img src={row.PARTNER_IMG} alt="" style={{ width: "100%", maxWidth: "100px", height: "auto", maxHeight: "30px", alignItems: "center" }}/>
                                </TableCell>
                                <TableCell align="center">{row.PARTNER_NM}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", justifyContent: "center", flexDirection: isMobile || isTablet ? 'column' : 'row' }}>
                                        <Button 
                                            variant="contained"
                                            onClick={() => handlePartnerClick(row.ID)}
                                            sx={{ 
                                                bgcolor: 'rgba(0, 0, 0, 0.5)', 
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 1)',
                                                },
                                                mr: isMobile || isTablet ? 0 : 1,
                                                mb: isMobile || isTablet ? 1 : 0,
                                                width: isMobile || isTablet ? '100%' : 'auto'
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
                                                width: isMobile || isTablet ? '100%' : 'auto'
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {[...Array(Math.max(0, itemsPerPage - getPaginatedData().length))].map((_, index) => (
                            <TableRow key={`empty-${index}`}>
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
                    count={Math.ceil((isSearchClicked ? filteredResults : data).length / itemsPerPage)} 
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
    )
}

export default AdPartnerList;
