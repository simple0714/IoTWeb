import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, TextField, Button, Typography, Paper, Grid, IconButton, Checkbox, FormControlLabel, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Modal from "./Modal";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function AddProject({ setSelectedNav }) {
  const URL = "http://localhost:3001/apis/project/addProject";
  const MULTI_UPLOAD_URL = "http://localhost:3001/apis/multiFileUpload";
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState(""); 
  const [stack, setStack] = useState([]);
  const [content, setContent] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState("");
  const [exampleImages, setExampleImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const fileInputRef = useRef(null);
  const exampleImagesInputRef = useRef(null);
  const [stackData, setStackData] = useState([]);
  const [exampleImageFiles, setExampleImageFiles] = useState([]);
  const [exampleImageNames, setExampleImageNames] = useState([]);

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
      return;
    }
    setMainImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearMainImage = () => {
    setMainImage(null);
    setMainImagePreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExampleImagesUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newImageFiles = [];
    const newImageNames = [];

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        newImageFiles.push(file);
        newImageNames.push(file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setExampleImages(prevImages => [
            ...prevImages,
            { file, preview: e.target.result }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.");
      }
    });

    setExampleImageFiles(prevFiles => [...prevFiles, ...newImageFiles]);
    setExampleImageNames(prevNames => [...prevNames, ...newImageNames]);
  }, []);

  const handleRemoveExampleImage = useCallback((index) => {
    setExampleImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setExampleImageNames(prevNames => prevNames.filter((_, i) => i !== index));
    setExampleImages(prevImages => prevImages.filter((_, i) => i !== index));
  }, []);

  const showErrorModal = (title, message) => {
    setModalProps({ title, message, mode: "alert" });
    setShowModal(true);
  };

  const showConfirmModal = (title, message, confirmAction) => {
    setModalProps({ title, message, mode: "confirm", onConfirm: confirmAction });
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !stack || !content || !mainImage || exampleImages.length === 0) {
      showErrorModal("오류", "모든 필드를 입력해주세요.");
      return;
    }

    showConfirmModal("프로젝트 추가", "프로젝트를 추가하시겠습니까?", submitProject);
  };

  const submitProject = async () => {
    try {
      // 대표 이미지 업로드
      const mainImageFormData = new FormData();
      mainImageFormData.append("file", mainImage);
      const mainImageResponse = await axios.post("http://localhost:3001/apis/fileUpload", mainImageFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(mainImageResponse);
      // 대표 이미지 URL을 문자열로 저장
      const mainImageUrl = mainImageResponse.data.url;
      
      // 적용 예시 이미지 업로드
      const exampleImagesFormData = new FormData();
      console.log("exampleImagesFormData1", exampleImagesFormData);
      exampleImageFiles.forEach((file) => {
        exampleImagesFormData.append('files', file);
      });
      const exampleImagesResponse = await axios.post(MULTI_UPLOAD_URL, exampleImagesFormData, {
        headers: { 
          'accept': 'application/json',
          "Content-Type": "multipart/form-data"
         }
      });

      // 응답에서 파일 URL 추출
      let fileUrls = [];
      if (exampleImagesResponse.data && exampleImagesResponse.data.files) {
        fileUrls = exampleImagesResponse.data.files.map(file => file.url);
      } else {
        console.error("Unexpected response format for example images:", exampleImagesResponse.data);
      }
      
      console.log(mainImageResponse.data.url);
      const projectData = {
        title: title,
        subTitle: subTitle,
        projectImg: mainImageUrl,
        stack: stack,
        projectInfo: content,
        files: fileUrls.map((url, index) => ({
          url: url,
          sort: index
        }))
      };

      const response = await axios.post(URL, projectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);

      showErrorModal("성공", "프로젝트가 추가되었습니다.");
      setTitle("");
      setSubTitle("");
      setStack("");
      setContent("");
      clearMainImage();
      setExampleImages([]);
      setSelectedNav("project");
    } catch (error) {
      console.error("Error adding project:", error);
      showErrorModal("오류", "프로젝트 추가 실패");
    }
  };

  useEffect(() => {
    const fetchStackData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/apis/stack');
        setStackData(response.data);
      } catch (error) {
        console.error('스택 데이터 로드 오류:', error);
      }
    };
    fetchStackData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        프로젝트 추가
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ width: { xs: '100%', sm: '120px' }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>제목</Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ width: { xs: '100%', sm: '120px' }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>부제목</Typography>
            <TextField
              fullWidth
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ width: { xs: '100%', sm: '120px' }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>내용</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>사용 기술</Typography>
            <Grid container spacing={2}>
              {stackData.map((item) => (
                <Grid item key={item.ID}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={stack.includes(item.STACK_NM)}
                        onChange={() => {
                          if (stack.includes(item.STACK_NM)) {
                            setStack(stack.filter(s => s !== item.STACK_NM));
                          } else {
                            setStack([...stack, item.STACK_NM]);
                          }
                        }}
                      />
                    }
                    label={item.STACK_NM}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>메인 이미지</Typography>
            <input
              accept="image/*"
              type="file"
              onChange={handleMainImageUpload}
              ref={fileInputRef}
            />
            {mainImagePreviewUrl && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ position: 'relative', width: 'fit-content' }}>
                  <img src={mainImagePreviewUrl} alt="Main Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                  <IconButton
                    onClick={clearMainImage}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>예시 이미지</Typography>
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleExampleImagesUpload}
              ref={exampleImagesInputRef}
            />
            {exampleImages.length > 0 && (
              <Box sx={{ mt: 2, position: 'relative', '& .swiper-button-next, & .swiper-button-prev': { color: '#000' } }}>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={isMobile ? 1 : 3}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {exampleImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Box sx={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
                        <img 
                          src={image.preview} 
                          alt={`Example ${index + 1}`} 
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain' 
                          }} 
                        />
                        <IconButton
                          onClick={() => handleRemoveExampleImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
          >
            추가
          </Button>
        </form>
      </Paper>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        {...modalProps}
      />
    </Box>
  );
}

export default AddProject;
