import {
  Box,
  Button,
  Card,
  Chip,
  TextField,
  Typography,
  Autocomplete,
  Link
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { IUser, IUsers } from "../../types.ts";
import { getUsers } from "../../apis/user.ts";
import { createNewRecord } from "../../apis/record.ts";
import { AxiosResponse } from "axios";
import Operations from "./components/Operations.tsx";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

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
    height: "32px",
    m: "5px",
    borderWidth: "2px",
    fontSize: "16px",
    alignItems: "baseline"
  },
};

const StyledNoOptions = styled(Typography)`
  padding: 8px;
  margin: -5px;
  text-align: center;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const usersTypes: { [key: number]: string } = {
  1: "زبون",
  2: "تاجر",
}

const Home = () => {
  const navigate = useNavigate();

  const todayDate = moment().format("YYYY-MM-DD");
  const [dateString, setDateString] = useState<string>(todayDate);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
  const [cardId, setCardId] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchPhoneNo, setSearchPhoneNo] = useState<string>("");
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
  }) => {
    e.preventDefault();
    if (!selectedUser?.cardId)
    {
      alert("ادخل رقم البطاقة")
      return
    }
    const { type, amount } = data
    createNewRecord({
      user: selectedUser?.id,
      date: dateString,
      type,
      amount,
      notes: values?.notes,
      images: values?.images,
      checks: values?.checks
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
    setAutoFocusId(user ? user.type === 1 ? 2 : 5 : 0)
    // else setSelectedUser(null);
  }, [cardId, users]);

  return (
    <Card sx={{ maxWidth: "850px", bgcolor: "#f9f9f9", padding: "50px" }}>
      <Box sx={styles.flex}>
        <Typography variant='body1' sx={{ mr: "8px" }}>
          رقم البطاقة :
        </Typography>
        <TextField
          autoComplete={"off"}
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
          variant={selectedUserType === 1 ? 'filled' : 'outlined'}
          color={'primary'}
          sx={{ ...styles.chip }}
          label={usersTypes[1]}
          onClick={() => setSelectedUserType(selectedUserType === 1 ? null : 1)}
        />
        <Chip
          variant={selectedUserType === 2 ? 'filled' : 'outlined'}
          color={'secondary'}
          sx={{ ...styles.chip }}
          label={usersTypes[2]}
          onClick={() => setSelectedUserType(selectedUserType === 2 ? null : 2)}
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
          <Autocomplete
            disablePortal
            options={Object.values(users || {})}
            noOptionsText={
              <StyledNoOptions onClick={() => navigate(`/account-statement-new/users?name=${searchName}`)}>
                غير موجود، إضغط للإضافة
              </StyledNoOptions>
            }
            getOptionLabel={(option) => (option.fullName || option.name || "")}
            renderOption={(props, option: IUser) => (
              <Box component="li" {...props} sx={{ display: "flex", justifyContent: "space-between", paddingRight: "0px !important" }} >
                <Typography sx={{ textAlign: "start", flex: 1 }}>{option.fullName || option.name}</Typography>
                <Chip
                  variant='outlined'
                  sx={{ ...styles.chip, fontSize: "11px", width: "48px", height: "21px", ml: 0, fontWeight: "bold" }}
                  size='small'
                  color={option.type === 1 ? "primary" : "secondary"}
                  label={usersTypes[option.type]}
                />
              </Box>
            )}
            size='small'
            fullWidth
            value={selectedUser}
            onChange={(_, value) => {
              setSelectedUser(value || null);
              setCardId((value?.cardId || "").toString());
            }}
            filterOptions={(options, { inputValue }) => {
              const filteredOptions = selectedUserType ? options.filter((option) => option.type === selectedUserType) : options

              const words = inputValue.toLowerCase().split(" ").filter(Boolean);
              if (words.length === 0) return filteredOptions;

              return filteredOptions.filter((option) => {
                const normalizedName = (option.fullName || option.name || "").toLowerCase();
                return words.every(word => normalizedName.includes(word));
              });
            }}

            renderInput={(params) => (
              <TextField
                {...params}
                label="الاسم"
                onChange={(e) => {
                  setSearchName(e.target.value);
                  // You can also call setSelectedUser here if needed to reset selection
                }}
              />
            )}
          />

          {/* <TextField
            value={selectedUser?.name || ""}
            size='small'
            fullWidth
            placeholder='الاسم'
          /> */}
        </Box>

        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            رقم التلفون :
          </Typography>
          <Autocomplete
            disablePortal
            options={Object.values(users || {})}
            noOptionsText={<StyledNoOptions
              onClick={() => navigate(`/account-statement-new/users?phone=${searchPhoneNo}`)} >
              غير موجود، إضغط للإضافة
            </StyledNoOptions>}
            // noOptionsText="لا يوجد رقم مشابه"
            getOptionLabel={(option) => option.phone}
            size='small'
            fullWidth
            value={selectedUser}
            onChange={(_, value) => {
              setSelectedUser(value || null)
              setCardId((value?.cardId || "").toString())
            }
            }
            renderInput={(params) => <TextField onChange={(e) => setSearchPhoneNo(e.target.value)} {...params} label="رقم التلفون" />}
          />
        </Box>

        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            الرصيد :
          </Typography>
          <TextField
            autoComplete={"off"}
            value={selectedUser?.total || ""}
            size='small'
            fullWidth
            placeholder='الرصيد'
            disabled
          />
        </Box>

        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            ملاحظات :
          </Typography>
          <TextField
            autoComplete={"off"}
            value={selectedUser?.notes || ""}
            size='small'
            fullWidth
            placeholder='ملاحظات'
            disabled

          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Typography variant='body1' sx={{ mr: "8px" }}>
            التاريخ :
          </Typography>
          <TextField
            autoComplete={"off"}
            type='date'
            sx={{ width: "100%" }}
            // sx={{ width: 220 }}
            size='small'
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
          />
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }}>
          <Button sx={{ width: "100%" }} variant='outlined' color='primary' component={Link} href={`/account-statement-new/records${selectedUser?.cardId ? ("?cardId=" + selectedUser?.cardId) : ""}`}>
            كشف حساب
          </Button>
        </Box>
      </Box>
      <Operations autoFocusId={autoFocusId} values={values} setValues={setValues} onSubmit={onSubmit} />
    </Card>
  );
};
export default Home;
