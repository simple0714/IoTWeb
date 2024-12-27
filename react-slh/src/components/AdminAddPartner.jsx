import React, { useState, useRef } from "react";
import { Box, Typography, Paper, TextField, Button, IconButton, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Modal from "./Modal";

function AdminAddPartner({setSelectedNav}) {
  const URL = "http://localhost:3001/apis/partner/add";
  const FILE_UPLOAD_URL = "http://localhost:3001/apis/fileUpload";
  const [partnerNm, setPartnerNM] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const fileInputRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
    if (!partnerNm || !image) {
      showErrorModal("오류", "협력사명과 이미지를 입력해주세요.");
      return;
    }

    showConfirmModal("협력사 추가", "협력사를 추가하시겠습니까?", submitPartner);
  };

  const submitPartner = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      const imageResponse = await axios.post(FILE_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const partnerData = {
        partnerNm: partnerNm,
        imgUrl: imageResponse.data.url,
      };

      const response = await axios.post(URL, partnerData);
      console.log(response.data);
      showErrorModal("성공", "협력사가 추가되었습니다.");
      setPartnerNM("");
      clearImage();
      setSelectedNav("partner");
    } catch (error) {
      console.error("Error adding partner:", error);
      showErrorModal("오류", "협력사 추가 실패");
    }
  };

  return (
    <Box sx={{ 
      mt: 2, 
      px: { xs: 2, sm: 3, md: 4 }, 
      minWidth: { xs: '100%', sm: '100%', md: '940px' },
      maxWidth: '100%'
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        협력사 추가
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 2, 
            width: '100%'
          }}>
            <Typography variant="subtitle1" sx={{ 
              width: { xs: '100%', sm: '120px' }, 
              mr: { xs: 0, sm: 2 }, 
              mb: { xs: 1, sm: 0 } 
            }}>
              협력사명
            </Typography>
            <TextField
              fullWidth
              value={partnerNm}
              onChange={(e) => setPartnerNM(e.target.value)}
              variant="outlined"
            />
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 2
          }}>
            <Typography variant="subtitle1" sx={{ 
              width: { xs: '100%', sm: '120px' }, 
              mr: { xs: 0, sm: 2 }, 
              mb: { xs: 1, sm: 0 } 
            }}>
              이미지
            </Typography>
            <input
              ref={fileInputRef}
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
              style={{ width: '100%' }}
            />
          </Box>
          {previewUrl && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2, 
              position: 'relative',
              width: '100%'
            }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
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

export default AdminAddPartner;
