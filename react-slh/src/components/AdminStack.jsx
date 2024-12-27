import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, TextField, Button, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Modal from "./Modal";

function AdminStack() {
  const [stackData, setStackData] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [editStackName, setEditStackName] = useState("");
  const [editStackImage, setEditStackImage] = useState(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const editFileInputRef = useRef(null);
  const [newStackName, setNewStackName] = useState("");
  const [stackImage, setStackImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStackData();
  }, []);

  const fetchStackData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/apis/stack');
      setStackData(response.data);
    } catch (error) {
      console.error('스택 데이터 로드 오류:', error);
    }
  };

  const handleStackSelect = (stack) => {
    setSelectedStack(stack);
    setEditStackName(stack.STACK_NM);
    setEditImagePreviewUrl(stack.ICON);
    setEditStackImage(null); // 새로운 이미지 선택을 초기화
  };

  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setEditStackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
    }
  };

  const clearEditImage = () => {
    setEditStackImage(null);
    setEditImagePreviewUrl(selectedStack.ICON);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const showErrorModal = (title, message) => {
    setModalProps({ title, message, mode: "alert" });
    setShowModal(true);
  };

  const showConfirmModal = (title, message, confirmAction) => {
    setModalProps({ title, message, mode: "confirm", onConfirm: confirmAction });
    setShowModal(true);
  };

  const handleUpdateStack = () => {
    if (!editStackName) {
      showErrorModal("오류", "스택 이름을 입력해주세요.");
      return;
    }
    showConfirmModal("스택 수정", "정말로 이 스택을 수정하시겠습니까?", submitUpdateStack);
  };

  const submitUpdateStack = async () => {
    try {
      let imageUrl = selectedStack.ICON;
      if (editStackImage) {
        const formData = new FormData();
        formData.append("file", editStackImage);
        const uploadResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        imageUrl = uploadResponse.data.url;
      }

      const response = await axios.put("http://localhost:3001/apis/stack/updateStack", {
        id: parseInt(selectedStack.ID), name: editStackName, url: imageUrl,
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.error) {
        showErrorModal("성공", "스택이 성공적으로 수정되었습니다.");
        setSelectedStack(null);
        setEditStackName("");
        setEditStackImage(null);
        setEditImagePreviewUrl("");
        fetchStackData(); // 스택 목록 새로고침
      } else {
        showErrorModal("오류", `스택 수정에 실패했습니다: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error updating stack:", error);
      showErrorModal("오류", "스택 수정 중 오류가 발생했습니다.");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setStackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showErrorModal("오류", "이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
    }
  };

  const clearImage = () => {
    setStackImage(null);
    setImagePreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newStackName || !stackImage) {
      showErrorModal("오류", "스택 이름과 이미지를 모두 입력해주세요.");
      return;
    }

    showConfirmModal("스택 추가", "스택을 추가하시겠습니까?", submitStack);
  };

  const submitStack = async () => {
    try {
      // 이미지 업로드
      const formData = new FormData();
      formData.append("file", stackImage);
      const uploadResponse = await axios.post("http://localhost:3001/apis/fileUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // 스택 추가 API 호출
      const stackData = {
        name: newStackName,
        url: uploadResponse.data.url
      };
      const addResponse = await axios.post("http://localhost:3001/apis/stack/addStack", stackData, {
        headers: { "Content-Type": "application/json" }
      });

      if (!addResponse.data.error) {
        showErrorModal("성공", "스택이 성공적으로 추가되었습니다.");
        setNewStackName("");
        clearImage();
        fetchStackData(); // 스택 목록 새로고침
      } else {
        showErrorModal("오류", `스택 추가에 실패했습니다: ${addResponse.data.error}`);
      }
    } catch (error) {
      console.error("Error adding stack:", error);
      showErrorModal("오류", "스택 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <Box sx={{ mt: 2, px: 4, minWidth: '940px' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        스택 관리
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>스택 수정</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {stackData.map((item) => (
            <FormControlLabel
              key={item.ID}
              control={
                <Checkbox
                  checked={selectedStack && selectedStack.ID === item.ID}
                  onChange={() => handleStackSelect(item)}
                />
              }
              label={item.STACK_NM}
            />
          ))}
        </Box>

        {selectedStack && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>스택 수정</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ width: '120px', mr: 2 }}>스택 이름</Typography>
              <TextField
                fullWidth
                value={editStackName}
                onChange={(e) => setEditStackName(e.target.value)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ width: '120px', mr: 2 }}>스택 이미지</Typography>
              <input
                ref={editFileInputRef}
                accept="image/*"
                type="file"
                onChange={handleEditImageUpload}
              />
            </Box>
            {editImagePreviewUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
                <img src={editImagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                <IconButton
                  onClick={clearEditImage}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleUpdateStack}
                sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }, mr:2 }}
              >
                수정
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>스택 추가</Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ width: '120px', mr: 2 }}>스택 이름</Typography>
              <TextField
                fullWidth
                value={newStackName}
                onChange={(e) => setNewStackName(e.target.value)}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ width: '120px', mr: 2 }}>스택 이미지</Typography>
              <input
                ref={fileInputRef}
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
            </Box>
            {imagePreviewUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
                <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' } }}
              >
                추가
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        {...modalProps}
      />
    </Box>
  );
}

export default AdminStack;
