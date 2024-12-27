import React, { useState, useRef } from "react";
import { Box, Button, Typography, Paper, TextField, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Modal from "./Modal";

function AdminAddAbout({ setSelectedNav }) {
  const URL = "http://localhost:3001/apis/about/addAbout";
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showErrorModal = (title, message) => {
    setModalProps({ title, message, mode: "alert" });
    setShowModal(true);
  };

  const showConfirmModal = (title, message, confirmAction) => {
    setModalProps({ title, message, mode: "confirm", onConfirm: confirmAction });
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !subTitle || !image) {
      showErrorModal("오류", "각 항목을 입력해주세요.");
      return;
    }

    showConfirmModal("소개글 추가", "소개글을 추가 하시겠습니까?", submitAbout);
  };

  const submitAbout = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      const imageResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const aboutData = {
        title: title,
        subTitle: subTitle,
        icon: imageResponse.data.url,
      };

      const response = await axios.post(URL, aboutData);
      console.log(response.data);
      showErrorModal("성공", "소개글이 추가되었습니다.");
      setTitle("");
      setSubTitle("");
      clearImage();
      setSelectedNav("about");
    } catch (error) {
      console.error("Error adding about:", error);
      showErrorModal("오류", "소개글 추가 실패");
    }
  };

  return (
    <Box sx={{ 
      mt: 2, 
      px: { xs: 2, sm: 4 }, 
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      overflowX: 'auto'
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        소개글 추가
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
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
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ width: { xs: '100%', sm: '120px' }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, mt: { xs: 0, sm: 1 } }}>내용</Typography>
            <TextField
              fullWidth
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ width: { xs: '100%', sm: '120px' }, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>이미지</Typography>
            <input
              ref={fileInputRef}
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Box>
          {previewUrl && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }} />
              <IconButton
                onClick={clearImage}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ 
              mt: 2, 
              bgcolor: 'black', 
              color: 'white', 
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              width: { xs: '100%', sm: 'auto' }
            }}
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

export default AdminAddAbout;
