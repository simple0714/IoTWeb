import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Stack, Pagination } from "@mui/material";
import { styled } from '@mui/material/styles';

// 커스텀 Pagination 스타일 추가
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

function AdContact() {
  const URL =
  "http://localhost:3001/apis/contact/findList"
  // 프로젝트 요청 전체조회
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;  // 6에서 5로 변경

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(URL);
      console.log(response.data);
      // 응답 데이터 확인, 전체 출력
      // 확인완료 주석처리 2024-10-08, 10:43
      setData(response.data.dataInfo.rows);
      
    } catch(e) {
      setError(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const serviceCodeMapping = {
    SRC01: "IOT 솔루션",
    SRC02: "모바일웹",
    SRC03: "웹서비스",
    SRC04: "IT컨설팅",
    SRC06: "테스트서비스",
    SRC07: "UI / UX",
  };

  const tableStyle = {
    '& .MuiTableCell-root': { 
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      padding: '10px',
    },
    '& .MuiTableCell-root:last-child': { 
      borderRight: 'none',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontWeight: 'bold',
      color: '#FFFFFF', 
      backgroundColor: '#000000', 
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
      color: '#000000', 
    }
  };

  // 디테일 페이지를 상태관리를 통해 현재 선택된 ID를 확인하고 조건부로 렌더링
  // 공통사용 css style
  const InfoBox = {
    width: "100px",
    height: "70px",
    border: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "none", // 오른쪽 테두리 제거
  };
  const ItemBox = {
    border: "1px solid black",
    height: "70px",
    width: "100%",
    minWidth: "300px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
    marginLeft: "-1px", 
  };
  const ItemBox2 = {
    border: "1px solid black",
    height: "70px",
    width: "100%",
    minWidth: "300px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px",
    marginLeft: "-1px", // 왼쪽 마진을 음수로 설정하여 InfoBox와 붙임
  };
  const serviceCodeBox = {
    width: "80px",
    height: "50px",
    border: "1px solid black",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  };

  return selectedItem ? (
    <Box sx={{ mt: 2, px: 4 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold", cursor: "pointer" }} onClick={() => setSelectedItem(null)}>
        프로젝트 요청 조회
      </Typography>
      <Box component="hr" sx={{ my: 2 }} />
      <Box sx={{ 
        overflow: "auto", 
        maxHeight: "700px",
        scrollbarWidth: "none",  // Firefox를 위한 설정
        msOverflowStyle: "none",  // IE와 Edge를 위한 설정
        "&::-webkit-scrollbar": {  // Chrome, Safari, Opera를 위한 설정
          display: "none"
        }
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>고객정보</Typography>
        <Stack direction="row" sx={{ mb: 2 }}>
          <Stack>
            <Box sx={InfoBox}>회사 또는<br />기관명</Box>
            <Box sx={InfoBox}>담당자명</Box>
            <Box sx={InfoBox}>연락처</Box>
            <Box sx={InfoBox}>이메일</Box>
          </Stack>
          <Stack>
            <Box sx={ItemBox}>{selectedItem.ORG_NM}</Box>
            <Box sx={ItemBox}>{selectedItem.USER_NM}</Box>
            <Box sx={ItemBox}>{selectedItem.PHONE}</Box>
            <Box sx={ItemBox}>{selectedItem.EMAIL}</Box>
          </Stack>
        </Stack>

        <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>서비스타입</Typography>
        <Box sx={{ display: "flex", mb: 2 }}>
          {JSON.parse(selectedItem.SERVICE_CD).serviceCd.map((code) => (
            <Box key={code} sx={serviceCodeBox}>
              {serviceCodeMapping[code] || code}
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>프로젝트 예산/일정</Typography>
        <Stack direction="row" sx={{ mb: 2 }}>
          <Stack>
            <Box sx={InfoBox}>예산</Box>
            <Box sx={InfoBox}>일정</Box>
          </Stack>
          <Stack>
            <Box sx={ItemBox2}>{selectedItem.BUDGET}</Box>
            <Box sx={ItemBox2}>{selectedItem.SCHEDULE}</Box>
          </Stack>
        </Stack>

        <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>프로젝트 내용</Typography>
        <Box sx={{ border: "1px solid black", width: "100%", minHeight: "300px", p: 2, mb: 2 }}>
          <Typography variant="body1">{selectedItem.PROJECT_INFO}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Box
            onClick={() => setSelectedItem(null)}
            sx={{
              border: "1px solid black",
              width: "70px",
              height: "30px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            목록
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', height: '600px' }}>
      <Typography variant="h5" sx={{ ml: 2, mb: 1, fontWeight: "bold" }}>
        프로젝트 요청 조회
      </Typography>
      <TableContainer component={Paper} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', maxHeight: '500px' }}>
        <Table sx={{ ...tableStyle, flexGrow: 1, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell align="center">고객 정보</TableCell>
              <TableCell align="center">서비스 타입</TableCell>
              <TableCell align="center">문의 내용</TableCell>
              <TableCell align="center">예산</TableCell>
              <TableCell align="center">일정</TableCell>
              <TableCell align="center">문의 일자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item) => (
              <TableRow key={item.ID} hover>
                <TableCell align="center">{item.USER_NM}</TableCell>
                <TableCell align="center">
                  {JSON.parse(item.SERVICE_CD).serviceCd
                    .map((code) => serviceCodeMapping[code] || code)
                    .join(", ")}
                </TableCell>
                <TableCell 
                  align="center" 
                  onClick={() => setSelectedItem(item)} 
                  sx={{ cursor: "pointer" }}
                >
                  {item.PROJECT_INFO.length > 10 
                    ? `${item.PROJECT_INFO.slice(0, 10)}...` 
                    : item.PROJECT_INFO}
                </TableCell>
                <TableCell align="center">{item.BUDGET.toLocaleString()}</TableCell>
                <TableCell align="center">{item.SCHEDULE}</TableCell>
                <TableCell align="center">{new Date(item.CREATE_AT).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {[...Array(Math.max(0, rowsPerPage - data.slice((page - 1) * rowsPerPage, page * rowsPerPage).length))].map((_, index) => (
              <TableRow key={`empty-${index}`}>
                <TableCell colSpan={6}>&nbsp;</TableCell>
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
          count={Math.ceil(data.length / rowsPerPage)} 
          page={page} 
          onChange={(event, value) => setPage(value)}
          shape="rounded"
          size="small"
        />
      </Box>
    </Box>
  );
}

export default AdContact;
