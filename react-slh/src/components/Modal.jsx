import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function ModalComponent({ open, onClose, title, message, mode = 'alert', onConfirm, onCancel }) {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {mode === 'confirm' && (
          <>
            <Button onClick={handleConfirm} color="primary">
              확인
            </Button>
            <Button onClick={handleCancel} color="error">
              취소
            </Button>
          </>
        )}
        {mode === 'alert' && (
          <Button onClick={handleClose} color="primary">
            확인
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ModalComponent;