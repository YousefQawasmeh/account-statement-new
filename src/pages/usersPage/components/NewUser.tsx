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
import { allCurrencies, usersTypes } from "../../../utils.ts";

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
    width: "110px",
    height: "35px",
    m: "5px",
    borderWidth: "2px",
    fontSize: "15px",
  },
};

const Users = () => {
  const { search } = useLocation();
  const query: any = new URLSearchParams(search);
  const [newUser, setNewUser] = useState<IUser>({
    total: 0,
    name: query.get('name') || "",
    subName: "",
    phone: query.get('phone') || "",
    phone2: "",
    type: 0,
    notes: "",
    id: "",
    cardId: 0,
    currency: "شيكل",
  });

  const saveUser = (e: any) => {
    e.preventDefault();

    if (!newUser.cardId) {
      alert("ادخل رقم البطاقة");
      return;
    }
    if (!newUser.name) {
      alert("ادخل الاسم");
      return;
    }
    if (!newUser.type) {
      alert("ادخل نوع البطاقة");
      return;
    }
    if (!newUser.currency) {
      alert("ادخل العملة");
      return;
    }

    createNewUser(newUser)
      .then(() => {
        setNewUser({
          total: 0,
          name: "",
          phone: "",
          phone2: "",
          type: newUser.type,
          notes: "",
          id: "",
          cardId: 0,
          currency: "شيكل",
        });
        setNewUserCardId();
      })
      .catch((err) => alert(err.message || err));
  };

  const setNewUserCardId = () => {
    newUser.type && getNewCardId(newUser.type).then((res) => {
      setNewUser((prev) => ({ ...prev, cardId: res.data.cardId }));
    })
  }

  const onInputChange = (e: any) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value as any }));
  }

  useEffect(setNewUserCardId, [newUser.type]);

  return (
    <Card sx={{ maxWidth: "850px", bgcolor: "#f9f9f9", padding: "50px" }}>
      <Box sx={{ ...styles.flex, justifyContent: "space-between" }}>
        <Box sx={{ ...styles.flex, width: "45%" }}>
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
        </Box>
        <Box sx={{ ...styles.flex, width: "45%", justifyContent: "space-between" }}>
          {Object.keys(usersTypes).map((key) => {
            const isSelected = newUser?.type === +key;
            const isPrimary = +key === 1;
            return (
              <Chip
                key={key}
                variant={isSelected ? 'filled' : 'outlined'}
                color={isPrimary ? 'primary' : 'secondary'}
                sx={{ ...styles.chip, ...(isSelected ? { border: 0, padding: "2px" } : { opacity: 0.6 }) }}
                label={usersTypes[+key]}
                onClick={() => { setNewUser({ ...newUser, type: +key, }); }}
              />
            )
          })}


          <Box sx={{ width: "2px", height: "40px", bgcolor: "green", mx: "6px", }} />
          {
            allCurrencies.map((currency, index) => {
              const isSelected = newUser?.currency === currency.name
              return (
                <Chip
                  key={index}
                  variant={isSelected ? 'filled' : 'outlined'}
                  color={'info'}
                  sx={{ ...styles.chip, ...(isSelected ? { border: 0, padding: "2px" } : { opacity: 0.6 }), "> span": { ...(currency.name === "شيكل" ? { scale: "1.6", alignSelf: "baseline", paddingTop: "1px" } : { scale: "1.2" }) } }}
                  label={currency.symbol}
                  onClick={() => { setNewUser({ ...newUser, currency: currency.name }); }}
                />
              )
            })
          }

        </Box>
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
            الاسم الفرعي :
          </Typography>
          <TextField
            onChange={onInputChange}
            value={newUser?.subName || ""}
            size='small'
            fullWidth
            placeholder='الاسم الفرعي'
            autoComplete="off"
            name="subName"
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            رقم التلفون 2 :
          </Typography>
          <TextField
            onChange={onInputChange}
            value={newUser?.phone2 || ""}
            size='small'
            fullWidth
            placeholder='رقم التلفون 2 (اختياري)'
            autoComplete="off"
            name="phone2"
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "100%" }}>
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
