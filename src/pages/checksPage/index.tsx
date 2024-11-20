import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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
        <ChecksTable checks={checks} setChecks={setChecks} />
    </Box>
};
export default ChecksPage