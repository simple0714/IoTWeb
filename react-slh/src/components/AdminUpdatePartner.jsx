import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Paper, TextField, IconButton, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilValue } from 'recoil';
import { selectedPartnerIdState } from '../atoms';
import axios from "axios";
import Modal from "./Modal";

function AdminUpdatePartner({ setSelectedNav }) {
  const URL = "http://localhost:3001/apis/partner/list";
  const URL_UPDATE = "http://localhost:3001/apis/partner/update";

  const [partnerNm, setPartnerNm] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const selectedPartnerId = useRecoilValue(selectedPartnerIdState);
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
    setPreviewUrl(originalImageUrl);
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

  useEffect(() => {
    console.log("선택된 파트너 ID:", selectedPartnerId);
    const fetchData = async () => {
      try {
        const response = await axios.get(URL);
        const partnerData = response.data.dataInfo.find(partner => partner.ID === selectedPartnerId);
        if (partnerData) {
          console.log(response.data.dataInfo);
          setPartnerNm(partnerData.PARTNER_NM);
          setPreviewUrl(partnerData.PARTNER_IMG);
          setOriginalImageUrl(partnerData.PARTNER_IMG);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showErrorModal("오류", "데이터를 불러오는 데 실패했습니다.");
      }
    };
    if (selectedPartnerId) {
      fetchData();
    }
  }, [selectedPartnerId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!partnerNm) {
      showErrorModal("오류", "협력사명을 입력해주세요.");
      return;
    }

    showConfirmModal("협력사 수정", "협력사 정보를 수정하시겠습니까?", submitPartner);
  };

  const submitPartner = async () => {
    try {
      let imgUrl = originalImageUrl;

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const imageResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imgUrl = imageResponse.data.url;
      }

      const updateData = {
        id: selectedPartnerId,
        partnerNm: partnerNm,
        imgUrl: imgUrl
      };

      const response = await axios.put(URL_UPDATE, updateData, {
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      });

      console.log(response.data);
      showErrorModal("성공", "협력사 정보가 수정되었습니다.");
      setOriginalImageUrl(imgUrl);
      setSelectedNav("partner");
    } catch (error) {
      console.error("Error updating partner:", error);
      showErrorModal("오류", "협력사 정보 수정 실패");
    }
  };
  
  return(
    <Box sx={{ 
      mt: 2, 
      px: { xs: 2, sm: 3, md: 4 }, 
      minWidth: { xs: '100%', sm: '100%', md: '940px' },
      maxWidth: '100%'
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        협력사 수정
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
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
              협력사명
            </Typography>
            <TextField
              fullWidth
              value={partnerNm}
              onChange={(e) => setPartnerNm(e.target.value)}
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
            수정
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

export default AdminUpdatePartner;
