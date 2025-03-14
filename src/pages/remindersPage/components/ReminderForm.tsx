import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import { createReminder } from '../../../apis/reminder';
import { IUser } from '../../../types';
import { getUsers } from '../../../apis/user';
import moment from 'moment';

interface ReminderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ open, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState(moment().format('YYYY-MM-DD'));
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users.data);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    // if (user) {
      await createReminder({ note, dueDate, user: user?.id });
      onSubmit();
      onClose();
    // }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>إنشاء تذكير</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ملاحظات"
          type="text"
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <TextField
          margin="dense"
          label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;تاريخ التذكير"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Autocomplete
          options={users}
          getOptionLabel={(user) => user.name + (user.subName ? `(${user.subName})` : '')}
          value={user}
          onChange={(_event, newValue) => {
            setUser(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="اسم الشخص" margin="dense" fullWidth />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} >إلغاء</Button>
        <Button onClick={handleSubmit} variant='contained'>حفظ</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReminderForm;
