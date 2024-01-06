import {
  Box,
  Button,
  Card,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IUser, IUsers } from "../../types.ts";
import { getUsers } from "../../apis/user.ts";
import { createNewRecord } from "../../apis/record.ts";
import { AxiosResponse } from "axios";
import Operations from "./Operations.tsx";

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

const Home = () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const [dateString, setDateString] = useState<string>(todayDate);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [cardId, setCardId] = useState<string>("");
  const [values, setValues] = useState<any>({})
  const [autoFocusId, setAutoFocusId] = useState<number>(0)

  useEffect(() => {
    setSelectedUser(null);
    getUsers().then((res: AxiosResponse<[any]>) => {
      setUsers(res.data.reduce((acc, user) => {
        user.type = Number(user.type?.id)
        return {
          ...acc,
          [user.cardId]: user,
          // [user.id]: user,
        }
      }, {}));
    }).catch(err => alert(err.message || err))
  }, [])

  const onSubmit = (e: any, data: {
    type: number
    amount: number
    notes: string
  }) => {
    e.preventDefault();
    const { type, amount, notes } = data
    createNewRecord({
      user: selectedUser?.id,
      date: dateString,
      type,
      amount,
      notes,
    }).then(() => {
      if (!selectedUser?.cardId) return
      setUsers({ ...users, [selectedUser?.cardId]: { ...selectedUser, total: selectedUser?.total + amount } })
      setValues({})
    }).catch(err => alert(err.message || err))
  }

  useEffect(() => {
    // if (cardId.length === 3) 
    setSelectedUser(users?.[cardId] || null);
    const user = users?.[cardId]
    setAutoFocusId(user? user.type === 1 ? 2 : 5 : 0)
    // else setSelectedUser(null);
  }, [cardId, users]);

  return (
    <Card sx={{ maxWidth: "850px", bgcolor: "#f9f9f9", padding: "50px" }}>
      <Box sx={styles.flex}>
        <Typography variant='body1' sx={{ mr: "8px" }}>
          رقم البطاقة :
        </Typography>
        <TextField
        // autoFocus={false}
        // focused={false}
        // disabled={selectedUser?.name.length > 0}
          size='small'
          fullWidth
          placeholder='رقم البطاقة ...'
          type='search'
          // value={123}
          value={cardId}
          onChange={(e) => {
            setCardId(e.target.value);
          }}
        />
        <Chip
          variant='outlined'
          sx={{ ...styles.chip, opacity: selectedUser?.type === 2 ? 1 : 0.3 }}
          label='تاجر'
        />
        <Chip
          variant='outlined'
          sx={{ ...styles.chip, opacity: selectedUser?.type === 1 ? 1 : 0.3 }}
          label='زبون'
        />
      </Box>
      <Box
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
            value={selectedUser?.name || ""}
            size='small'
            fullWidth
            placeholder='الاسم'
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            رقم التلفون :
          </Typography>
          <TextField
            value={selectedUser?.phone || ""}
            size='small'
            fullWidth
            placeholder='رقم التلفون'
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            الرصيد :
          </Typography>
          <TextField
            value={selectedUser?.total || ""}
            size='small'
            fullWidth
            placeholder='الرصيد'
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            ملاحظات :
          </Typography>
          <TextField
            value={selectedUser?.notes || ""}
            size='small'
            fullWidth
            placeholder='ملاحظات'
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            التاريخ :
          </Typography>
          <TextField
            type='date'
            sx={{ width: "100%" }}
            // sx={{ width: 220 }}
            size='small'
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Button sx={{ width: "100%" }} variant='outlined' color='primary'>
            كشف حساب
          </Button>
        </Box>
      </Box>
      <Operations autoFocusId={autoFocusId} values={values} setValues={setValues} onSubmit={onSubmit} />
    </Card>
  );
};
export default Home;
