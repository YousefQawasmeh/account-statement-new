import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, memo, useState } from "react";
import homePageStyles from "./index.style.ts";
import { User, Users } from "../../types.ts";
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

const usersTemp: Users = {
  "123": {
    total: 55,
    name: "يوسف خالد دلال",
    phone: "0566252561",
    type: 1,
    notes: "",
    id: "123",
  },
  "111": {
    total: 55,
    name: "خالد دلال",
    phone: "0599252561",
    type: 2,
    notes: "",
    id: "111",
  },
};
type Buttons = {
  label: string;
  value: number;
  color: "primary" | "secondary";
  variant: "contained" | "outlined" | "text";
  id: number;
};

const buttons: Buttons[] = [
  {
    label: "نقدي",
    value: 0,
    color: "primary",
    variant: "contained",
    id: 1,
  },
  {
    label: "مشتريات",
    value: -1,
    color: "secondary",
    variant: "contained",
    id: 2,
  },
  {
    label: "صرف له",
    value: 1,
    color: "primary",
    variant: "outlined",
    id: 3,
  },
  {
    label: "نقدي",
    value: 0,
    color: "primary",
    variant: "contained",
    id: 4,
  },
  {
    label: "دين",
    value: 1,
    color: "secondary",
    variant: "contained",
    id: 5,
  },
  {
    label: "دفعة",
    value: -1,
    color: "primary",
    variant: "outlined",
    id: 6,
  },
];

const HomePage = () => {
  const classes = homePageStyles();
  const todayDate = moment().format("YYYY-MM-DD");
  const [dateString, setDateString] = useState<string>(todayDate);
  const [users, setUsers] = useState<Users>(usersTemp);
  //   const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [cardId, setCardId] = useState<string>("");

  const ButtonsSection = memo(() => {
    return (
      <>
        {buttons.slice(0, 3).map((button) => {
          return (
            <form
              key={button.id}
              onSubmit={(e) => {
                e.preventDefault();
                console.log(button);
              }}
              style={{ display: "flex" }}
            >
              <Button
                sx={{ width: "130px", mr: "15px" }}
                variant={button.variant}
                color={button.color}
              >
                {button.label}
              </Button>
              <TextField size='small' fullWidth placeholder='...' />
            </form>
          );
        })}
      </>
    );
  });
  const ButtonsSection2 = memo(() => {
    return (
      <>
        {buttons.slice(3).map((button) => {
          return (
            <form
              key={button.id}
              onSubmit={(e) => {
                e.preventDefault();
                console.log(button);
              }}
              style={{ display: "flex" }}
            >
              <Button
                sx={{ width: "130px", mr: "15px" }}
                variant={button.variant}
                color={button.color}
              >
                {button.label}
              </Button>
              <TextField size='small' fullWidth placeholder='...' />
            </form>
          );
        })}
      </>
    );
  });
  useEffect(() => {
    setUsers(usersTemp);
    setSelectedUser(null);
  }, []);

  useEffect(() => {
    if (cardId.length === 3) setSelectedUser(users[cardId]);
    else setSelectedUser(null);
  }, [cardId, users]);
  return (
    <Grid>
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
            sx={{ width: 220 }}
            size='small'
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Button sx={{ width: "100%" }} variant='outlined' color='primary'>
            كشف حساب
          </Button>
          {/* <Button variant='outlined' sx={{ width: "90px", padding: "6px 0" }}>
            كشف حساب
          </Button>
          <Button variant='text'>من: </Button>
          <Button variant='text'>الى:</Button> */}
        </Box>
      </Box>
      {/* <Box
        sx={{
          ...styles.flex,
          justifyContent: "space-between",
          paddingTop: "24px",
          mt: "16px",
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("111111111111");
            }}
            style={{ display: "flex" }}
          >
            <Button
              sx={{ width: "130px", mr: "15px" }}
              variant='contained'
              color='primary'
            >
              نقدي
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>

          <form style={{ display: "flex" }}>
            <Button
              sx={{ width: "130px", mr: "15px" }}
              variant='contained'
              color='secondary'
            >
              مشتريات
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>

          <form style={{ display: "flex" }}>
            <Button sx={{ width: "130px", mr: "15px" }} variant='outlined'>
              صرف له
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>
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
          <form style={{ display: "flex" }}>
            <Button
              sx={{ width: "130px", mr: "15px" }}
              variant='contained'
              color='primary'
            >
              نقدي
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>

          <form style={{ display: "flex" }}>
            <Button
              sx={{ width: "130px", mr: "15px" }}
              variant='contained'
              color='secondary'
            >
              دين
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>

          <form style={{ display: "flex" }}>
            <Button sx={{ width: "130px", mr: "15px" }} variant='outlined'>
              قبض
            </Button>
            <TextField size='small' fullWidth placeholder='...' />
          </form>
        </Box>
      </Box> */}
      <Box
        sx={{
          ...styles.flex,
          justifyContent: "space-between",
          paddingTop: "24px",
          mt: "16px",
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
      {/* <Box sx={{ ...styles.flex, justifyContent: "space-between" }}>
        <Button variant='contained' color='primary'>
          مبيعات اليوم
        </Button>
        <Button variant='contained' color='secondary'>
          عملية جديدة
        </Button>
        <Button variant='outlined'>كشف حساب</Button>
        <Button variant='text'>من: </Button>
        <Button variant='text'>الى:</Button>
      </Box> */}
    </Grid>
  );
};
export default HomePage;
