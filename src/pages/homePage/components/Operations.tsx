import React, { useRef, useEffect } from "react";
// import React, { /useState } from "react";
import {
    Box,
    Button,
    // Card,
    // Chip,
    TextField,
    // Typography,
} from "@mui/material";

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

const styles = {
    flex: {
        display: "flex",
        alignItems: "center",
        my: "6px",
        "& p": {
            minWidth: "100px",
        },
    }
}
// const Operations = ({createNewRecord}:  {createNewRecord: (data: any)=>void}) => {
const Operations = ({ values, setValues, onSubmit, autoFocusId }: { autoFocusId: number, onSubmit: any, values: any, setValues: React.Dispatch<React.SetStateAction<any>> }) => {
    const inputRef = useRef()
    useEffect(() => {
        const inputElm: any =  inputRef.current;
        inputElm?.focus()
    }, [autoFocusId])
    
    return (
        <>
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
                    <>
                        {buttons.slice(0, 3).map((button) => {
                            return (
                                <form
                                    key={button.id}
                                    onSubmit={(e) => onSubmit(e, {
                                        type: button.id,
                                        amount: +values[button.id] * button.value,
                                        notes: values?.notes || button.label
                                    })}
                                    name={button.id.toString()}
                                    style={{ display: "flex" }}
                                >
                                    <Button
                                        type={"submit"}
                                        sx={{ minWidth: "100px", mr: "8px" }}
                                        variant={button.variant}
                                        color={button.color}
                                    >
                                        {button.label}
                                    </Button>
                                    <TextField
                                        inputRef={autoFocusId === button.id ? inputRef : null}
                                        autoComplete={"off"} value={values[button.id] || ""} onChange={(e) => setValues({ ...values, [button.id]: Number(e.target.value) })} size='small' fullWidth placeholder='...' />
                                </form>
                            );
                        })}
                    </>
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
                    <>
                        {buttons.slice(3).map((button) => {
                            return (
                                <form
                                    key={button.id}
                                    onSubmit={(e) => onSubmit(e, {
                                        type: button.id,
                                        amount: values[button.id] * button.value,
                                        notes: values?.notes || button.label
                                    })}
                                    name={button.id.toString()}
                                    style={{ display: "flex" }}
                                >
                                    <Button
                                        type={"submit"}
                                        sx={{ minWidth: "100px", mr: "8px" }}
                                        variant={button.variant}
                                        color={button.color}
                                    >
                                        {button.label}
                                    </Button>
                                    <TextField
                                        inputRef={autoFocusId === button.id ? inputRef : null}
                                        autoComplete={"off"} value={values[button.id] || ""} onChange={(e) => setValues({ ...values, [button.id]: Number(e.target.value) })} size='small' fullWidth placeholder='...' />
                                </form>
                            );
                        })}
                    </>
                </Box>

            </Box>
            <TextField autoComplete={"off"} value={values["notes"] || ""} onChange={(e) => setValues({ ...values, notes: e.target.value })} size='small' fullWidth placeholder='ملاحظات ...' />
        </>
    )

}

export default Operations