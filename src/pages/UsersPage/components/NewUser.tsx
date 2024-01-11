import {
  Box,
  Button,
  Card,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IUser } from "../../../types.ts";
import { createNewUser, getNewCardId } from "../../../apis/user.ts";
import { useLocation } from 'react-router-dom';

const styles = {
  flex: {
    display: "flex",
    alignItems: "center",
    my: "6px",
    "& p": {
      minWidth: "100px",
    },
  },
  chip: {
    width: "70px",
    height: "40px",
    m: "5px",
    borderColor: "green",
    borderWidth: "2px",
    color: "black",
    fontSize: "16px",
  },
};

const Users = () => {
  const { search } = useLocation();
  const query: any = new URLSearchParams(search);
  const [newUser, setNewUser] = useState<IUser>({
    total: 0,
    name: query.get('name') || "",
    phone: "",
    type: 0,
    notes: "",
    id: "",
    cardId: 0,
  });

  const saveUser = (e: any) => {
    e.preventDefault();

    if (!newUser.cardId) {
      alert("ادخل رقم البطاقة")
      return
    }
    if (!newUser.name) {
      alert("ادخل الاسم")
      return
    }
    if (!newUser.type) {
      alert("ادخل نوع البطاقة")
      return
    }

    createNewUser(newUser).then(() => {
      setNewUser({
        total: 0,
        name: "",
        phone: "",
        type: newUser.type,
        notes: "",
        id: "",
        cardId: 0,
      })
      setNewUserCardId()
    }).catch(err => alert(err.message || err))
  }

  const setNewUserCardId = () => {
    newUser.type && getNewCardId(newUser.type).then((res) => {
      setNewUser((prev) => ({ ...prev, cardId: res.data.cardId }));
    })
  }

  const onInputChange = (e: any) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  useEffect(setNewUserCardId, [newUser.type]);

  return (
    <Card sx={{ maxWidth: "850px", bgcolor: "#f9f9f9", padding: "50px" }}>
      <Box sx={styles.flex}>
        <Typography variant='body1' sx={{ mr: "8px" }}>
          رقم البطاقة :
        </Typography>
        <TextField
          onChange={onInputChange}
          size='small'
          fullWidth
          placeholder='رقم البطاقة ...'
          value={newUser.cardId || ""}
          disabled
          type='number'
          name="cardId"
        />
        <Chip
          variant='outlined'
          sx={{ ...styles.chip, opacity: newUser?.type === 1 ? 1 : 0.3 }}
          label='زبون'
          onClick={() => { setNewUser({ ...newUser, type: 1, }); }}
        />
        <Chip
          variant='outlined'
          sx={{ ...styles.chip, opacity: newUser?.type === 2 ? 1 : 0.3 }}
          label='تاجر'
          onClick={() => { setNewUser({ ...newUser, type: 2, }); }}
        />

      </Box>
      <Box
        component={"form"}
        onSubmit={saveUser}
        sx={{
          ...styles.flex,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            الاسم :
          </Typography>
          <TextField
            onChange={onInputChange}
            value={newUser?.name || ""}
            size='small'
            fullWidth
            placeholder='الاسم'
            autoFocus
            required
            autoComplete="off"
            name="name"
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            رقم التلفون :
          </Typography>
          <TextField
            onChange={onInputChange}
            value={newUser?.phone || ""}
            size='small'
            fullWidth
            placeholder='رقم التلفون'
            autoComplete="off"
            name="phone"
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            الرصيد :
          </Typography>
          <TextField
            onChange={onInputChange}
            value={newUser?.total || ""}
            size='small'
            fullWidth
            placeholder='الرصيد'
            autoComplete="off"
            type="number"
            name="total"
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            ملاحظات :
          </Typography>
          <TextField
            onChange={(e) => { setNewUser({ ...newUser, notes: e.target?.value }) }}
            value={newUser?.notes || ""}
            size='small'
            fullWidth
            placeholder='ملاحظات'
            name="notes"
          />
        </Box>

        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Button
            type="submit"
            sx={{ width: "180px", marginTop: "20px" }}
            variant='contained'
            color='primary'
          >
            إضافة بطاقة جديدة
          </Button>
        </Box>
      </Box>
      {/* <Link style={{ display: "flex", fontSize: "14px" }} to="/account-statement-new/">الصفحة الرئيسية</Link> */}


    </Card>
  );
};
export default Users;
