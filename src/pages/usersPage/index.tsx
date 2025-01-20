import { useState } from "react";
import UsersList from "./components/UsersList";
import NewUser from "./components/NewUser";
import { Box, Button, Popover, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const UsersPage = () => {
    const { search } = useLocation();
    const query: any = new URLSearchParams(search);
    const [openAddUserPopup, setOpenAddUserPopup] = useState<boolean>(!!query.get('name') || !!query.get('phone'));

    return (
        <Box>
            <Box sx={{ m: "20px", display: "flex", justifyContent: "space-between" }} >
                <Typography variant="h5">
                    البطاقات
      
      </Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenAddUserPopup(true)}
                >
                    إنشاء بطاقة جديدة
                </Button>
            </Box>
            <UsersList />
            <Popover
                open={openAddUserPopup}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                onClose={() => setOpenAddUserPopup(false)}
            >
                <NewUser />
            </Popover>
        </Box>
    )
}

export default UsersPage