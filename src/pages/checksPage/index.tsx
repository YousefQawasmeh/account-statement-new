import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { IBank, ICheck } from "../../types.ts";
import { getChecks } from "../../apis/check.ts";
import { AxiosResponse } from "axios";
import ChecksTable from "./ChecksTable.tsx";
import { getBanks } from "../../apis/bank.ts";
const ChecksPage = () => {
    const [checks, setChecks] = useState<ICheck[]>([]);
    const [allBanks, setAllBanks] = useState<IBank[]>([]);

    useEffect(() => {
        getChecks().then((res: AxiosResponse<ICheck[]>) => {
            setChecks(res.data);
        }).catch(err => alert(err.message || err))
        getBanks().then((res: AxiosResponse<IBank[]>) => {
            setAllBanks(res.data);
        }).catch(err => alert(err.message || err))
    }, [])

    return <Box>
        <ChecksTable checks={checks} setChecks={setChecks} allBanks={allBanks} />
    </Box>
};
export default ChecksPage