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
// import homeStyles from "./index.style.ts";
import { IUser, IUsers } from "../../types.ts";
import { getUsers } from "../../apis/user.ts";
import { createNewRecord } from "../../apis/record.ts";
import { AxiosResponse } from "axios";

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

type ButtonType = {
  label: string;
  value: number;
  color: "primary" | "secondary";
  variant: "contained" | "outlined" | "text";
  id: number;
};

const buttons: ButtonType[] = [
  {
    label: "نقدي",
    value: 0,
    color: "primary",
    variant: "contained",
    id: 4,
  },
  {
    label: "مشتريات",
    value: -1,
    color: "secondary",
    variant: "contained",
    id: 5,
  },
  {
    label: "صرف له",
    value: 1,
    color: "primary",
    variant: "outlined",
    id: 6,
  },
  {
    label: "نقدي",
    value: 0,
    color: "primary",
    variant: "contained",
    id: 1,
  },
  {
    label: "دين",
    value: 1,
    color: "secondary",
    variant: "contained",
    id: 2,
  },
  {
    label: "دفعة",
    value: -1,
    color: "primary",
    variant: "outlined",
    id: 3,
  },
];

const Home = () => {
  // const classes = homeStyles();
  const todayDate = moment().format("YYYY-MM-DD");
  const [dateString, setDateString] = useState<string>(todayDate);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [cardId, setCardId] = useState<string>("");
  const [values, setValues] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    setSelectedUser(null);
    getUsers().then((res: AxiosResponse<[any]>) => {
      console.log(res.data)
      setUsers(res.data.reduce((acc, user) => {
        user.type = Number(user.type?.id)
        return {
          ...acc,
          [user.cardId]: user,
          // [user.id]: user,
        }
      }, {}));
    });
  }, [])

  const ButtonsSection = 
  // memo
  (() => {
    return (
      <>
        {buttons.slice(0, 3).map((button) => {
          return (
            <form
              key={button.id}
              onSubmit={(e) => {
                e.preventDefault();
                createNewRecord({
                  // ...selectedUser,
                  user: selectedUser?.id,
                  date: dateString,
                  type: button.id,
                  amount: values[button.id]*button.value,
                  notes: button.label,
                }).then(()=>{
                  if(!selectedUser?.cardId) return
                  setUsers({...users, [selectedUser?.cardId]: {...selectedUser, total: selectedUser?.total+(values[button.id]*button.value)}})
                  setValues({})
                })
              }}
              name={button.id.toString()}
              style={{ display: "flex" }}
            >
              <Button
                sx={{ minWidth: "100px", mr: "8px" }}
                variant={button.variant}
                color={button.color}
              >
                {button.label}
              </Button>
              <TextField value={values[button.id] || ""} onChange={(e) => setValues({ ...values, [button.id]: Number(e.target.value) })} size='small' fullWidth placeholder='...' />
            </form>
          );
        })}
      </>
    );
  });
  const ButtonsSection2 = 
  
  // memo
  (() => {
    return (
      <>
        {buttons.slice(3).map((button) => {
          return (
            <form
              key={button.id}
              onSubmit={(e) => {
                e.preventDefault();
                createNewRecord({
                  // ...selectedUser,
                  user: selectedUser?.id,
                  date: dateString,
                  type: button.id,
                  amount: values[button.id]*button.value,
                  notes: button.label,
                }).then(()=>{
                  if(!selectedUser?.cardId) return
                  setUsers({...users, [selectedUser?.cardId]: {...selectedUser, total: selectedUser?.total+(values[button.id]*button.value)}})
                  setValues({})                })
              }}
              name={button.id.toString()}
              style={{ display: "flex" }}
            >
              <Button
                sx={{ minWidth: "100px", mr: "8px" }}
                variant={button.variant}
                color={button.color}
              >
                {button.label}
              </Button>
              <TextField value={values[button.id] || ""} onChange={(e) => setValues({ ...values, [button.id]: Number(e.target.value) })} size='small' fullWidth placeholder='...' />
            </form>
          );
        })}
      </>
    );
  });

  useEffect(() => {
    if (cardId.length === 3) setSelectedUser(users?.[cardId] || null);
    // else setSelectedUser(null);
  }, [cardId, users]);

  return (
    <Card sx={{ maxWidth: "850px", bgcolor: "#f9f9f9", padding: "50px" }}>
      <Box sx={styles.flex}>
        <Typography variant='body1' sx={{ mr: "8px" }}>
          رقم البطاقة :
        </Typography>
        <TextField
          size='small'
          fullWidth
          placeholder='رقم البطاقة ...'
          type='search'
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

      <Box
        sx={{
          ...styles.flex,
          justifyContent: "space-between",
          paddingTop: "24px",
          mt: "18px",
          borderTop: "solid 1px #ccc ",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "45%",
            gap: "6px",
          }}
        >
          <ButtonsSection />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "45%",
            gap: "6px",
          }}
        >
          <ButtonsSection2 />
        </Box>
      </Box>
    </Card>
  );
};
export default Home;
