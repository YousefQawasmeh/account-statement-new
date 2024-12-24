import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ICheck } from "../../types.ts";
import { getChecks } from "../../apis/check.ts";
import { AxiosResponse } from "axios";
import ChecksTable from "./ChecksTable.tsx";
const ChecksPage = () => {
    const [checks, setChecks] = useState<ICheck[]>([]);

    useEffect(() => {
        getChecks().then((res: AxiosResponse<ICheck[]>) => {
            setChecks(res.data);
        }).catch(err => alert(err.message || err))
    }, [])

    return <Box>
        <Box sx={{ m: "20px", display: "flex", justifyContent: "space-between" }} >
            <Typography variant="h5">
                البطاقات
                <Link style={{ display: "flex", fontSize: "14px" }} to="/account-statement-new/">
                    الصفحة الرئيسية
                </Link>
            </Typography>
        </Box>
        <ChecksTable checks={checks} setChecks={setChecks} />
    </Box>
};
export default ChecksPage