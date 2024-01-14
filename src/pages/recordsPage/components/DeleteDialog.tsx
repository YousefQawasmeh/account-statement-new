import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    handleClose?: () => void
    handleDelete: (notes: string) => void    
}
const DeleteDialog = (props: Props)=> {
    const {open, setOpen, handleClose = () => {setOpen(false)}, handleDelete} = props


  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const notes = formJson.notes;
            handleDelete(notes);
            handleClose();
          },
        }}
      >
        <DialogTitle>حذف الحركة</DialogTitle>
        <DialogContent>
          <DialogContentText>
            سيتم حذف الحركة بشكل نهائي ، لإكمال الإجراء يرجى إدخال السبب
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="notes"
            label="سبب الحذف"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button type="submit">حذف</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default DeleteDialog