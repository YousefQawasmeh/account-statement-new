import {
  Box,
  Button,
  Card,
  Chip,
  TextField,
  Typography,
  Autocomplete,
  Link,
  InputAdornment
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { ICurrency, IUser, IUsers } from "../../types.ts";
import { getUsers } from "../../apis/user.ts";
import { createNewRecord } from "../../apis/record.ts";
import { AxiosResponse } from "axios";
import Operations from "./components/Operations.tsx";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { allCurrencies, getCurrencySymbol, usersTypes, usersTypesShort } from "../../utils.ts";

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
    height: "32px",
    m: "5px",
    borderWidth: "2px",
    fontSize: "16px",
    alignItems: "baseline"
  },
  chipInList: {
    m: "5px",
    borderWidth: "2px",
    alignItems: "baseline",
    fontSize: "11px",
    width: "38px",
    height: "21px",
    ml: 0,
    fontWeight: "bold"
  }
};

const StyledNoOptions = styled(Typography)`
  padding: 8px;
  margin: -5px;
  text-align: center;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const todayDate = moment().format("YYYY-MM-DD");
  const [dateString, setDateString] = useState<string>(todayDate);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<number | null>(null);
  const [selectedUserCurrency, setSelectedUserCurrency] = useState<ICurrency | null>(null);
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
    if (!selectedUser?.cardId) {
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
      checks: values?.checks?.map((check: any) => check?.id ? ({id: check?.id}) : check)
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
      <Box sx={{ ...styles.flex, justifyContent: "space-between" }}>
        <Box sx={{ ...styles.flex, width: "50%" }} >
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
        </Box>
        <Box sx={{ ...styles.flex, width: "45%" }} >
          {Object.keys(usersTypes).map((key) => {
            const isSelected = selectedUserType === +key;
            const isPrimary = +key === 1;
            return (
              <Chip
                key={key}
                variant={isSelected ? 'filled' : 'outlined'}
                color={isPrimary ? 'primary' : 'secondary'}
                sx={{ ...styles.chip, ...(isSelected ? { border: 0, padding: "2px" } : {}) }}
                label={usersTypes[+key]}
                onClick={() => setSelectedUserType(isSelected ? null : +key)}
              />
            )
          })}
          <Box sx={{ width: "2px", height: "40px", bgcolor: "green" }} />
          {
            allCurrencies.map((currency, index) => {
              const isSelected = selectedUserCurrency === currency.name
              return (
                <Chip
                  key={index}
                  variant={selectedUserCurrency === currency.name ? 'filled' : 'outlined'}
                  color={'info'}
                  sx={{ ...styles.chip, ...(isSelected ? { border: 0, padding: "2px" } : {}) }}
                  label={currency.symbol}
                  onClick={() => setSelectedUserCurrency(isSelected ? null : currency.name)}
                />
              )
            })
          }
        </Box>
      </Box>

      <Box
        sx={{
          ...styles.flex,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ ...styles.flex, width: "50%", "&  button": { zIndex: 1 } }}>
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
                  sx={{ ...styles.chipInList, width: "49px", }}
                  size='small'
                  color={option.type === 1 ? "primary" : "secondary"}
                  label={usersTypesShort[option.type]}
                />
                <Chip
                  variant='outlined'
                  sx={{ ...styles.chipInList, "& span": { ...(option.currency === "شيكل" ? { scale: "1.9" } : { scale: "1.4" }) } }}
                  size='small'
                  color={"info"}
                  label={getCurrencySymbol(option.currency || "شيكل")}
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
              const filteredOptions = (selectedUserType || selectedUserCurrency) ? options.filter((option) => {
                if (selectedUserCurrency && !selectedUserType) return option.currency === selectedUserCurrency
                if (!selectedUserCurrency && selectedUserType) return option.type === selectedUserType
                return option.currency === selectedUserCurrency && option.type === selectedUserType
              })
                : options
              const words = inputValue.toLowerCase().split(" ").filter(Boolean);
              if (words.length === 0) return filteredOptions;

              return filteredOptions.filter((option) => {
                const normalizedName = (option.fullName || option.name || "").toLowerCase();
                return words.every(word => normalizedName.includes(word));
              });
            }}

            renderInput={(params) => (
              <Box sx={{position: "relative", display: "flex", alignItems: "center" }}>
                <TextField
                {...params}
                label="الاسم"
                onChange={(e) => {
                  setSearchName(e.target.value);
                }}
                />
                {selectedUser ? <Box sx={{ position: "absolute", right: "40px", display: "flex", alignItems: "center"}}>
                <Chip
                  variant='filled'
                  sx={{ ...styles.chipInList, width: "49px", }}
                  size='small'
                  color={selectedUser.type === 1 ? "primary" : "secondary"}
                  label={usersTypesShort[selectedUser.type]}
                  />
                <Chip
                  variant='filled'
                  sx={{ ...styles.chipInList, "& span": { ...(selectedUser.currency === "شيكل" ? { scale: "1.9" } : { scale: "1.4" }) } }}
                  size='small'
                  color={"info"}
                  label={getCurrencySymbol(selectedUser.currency || "شيكل")}
                  />
                  </Box>: null}
                </Box>
            )}
          />

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
            getOptionLabel={(option) => option.phone2 ? `${option.phone}/${option.phone2}` : `${option.phone ?? option.cardId}`}
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

        <Box sx={{ ...styles.flex, width: "50%" }}>
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
            InputProps={{
              startAdornment: <InputAdornment sx={{ "> p": { minWidth: "16px" } }} position="start">{getCurrencySymbol(selectedUser?.currency || "شيكل")}</InputAdornment>
            }}
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
        <Box sx={{ ...styles.flex, width: "50%" }}>
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
      <Operations autoFocusId={autoFocusId} values={values} setValues={setValues} onSubmit={onSubmit} selectedUser={selectedUser} />
    </Card>
  );
};
export default Home;
