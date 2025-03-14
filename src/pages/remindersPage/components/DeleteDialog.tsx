import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteDialogProps {
  open: boolean;
  setOpen: () => void;
  handleDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, setOpen, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={setOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"حذف التذكير"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          هل أنت متأكد من حذف هذا التذكير؟
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={setOpen} variant='contained'>إلغاء</Button>
        <Button onClick={handleDelete} autoFocus>
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
