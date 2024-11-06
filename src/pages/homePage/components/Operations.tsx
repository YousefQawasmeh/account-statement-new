import React, { useRef, useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import CheckForm from "./CheckForm";
import { getBanks } from "../../../apis/bank";
import { IBank } from "../../../types.ts";

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

type OperationsProps = {
    values: any;
    setValues: React.Dispatch<React.SetStateAction<any>>;
    onSubmit: any;
    autoFocusId: number;
}

const Operations = ({ values, setValues, onSubmit, autoFocusId }: OperationsProps) => {
    const [banks, setBanks] = useState<IBank[]>([]);
    useEffect(() => {
        getBanks().then((res: any) => {
            setBanks(res.data)
        }).catch(err => alert(err.message || err))
    }, [])

    const inputRef = useRef()
    useEffect(() => {
        const inputElm: any = inputRef.current;
        inputElm?.focus()
    }, [autoFocusId])

    const onInputChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleDeleteCheck = (checkIndexToDelete: number) => {
        onInputChange({
            target: {
                name: "checks", value: values?.checks?.filter((_: any, index: any) => index !== checkIndexToDelete)
            }
        })
    }

    const setCheckDetails = (checkDetails: any, checkIndex: number) => {
        onInputChange({
            target: {
                name: "checks", value: values?.checks?.map((check: any, index: number) => index === checkIndex ? checkDetails : check)
            }
        })
    }

    const createNewCheck = () => {
        onInputChange({
            target: {
                name: "checks", value: [...(values?.checks || []), {
                    checkNumber: '',
                    amount: '',
                    dueDate: ''
                }]
            }
        })
    }

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
                                        autoComplete={"off"}
                                        value={(values[button.id]) || ""}
                                        onChange={onInputChange}
                                        size='small'
                                        fullWidth
                                        placeholder='...'
                                        name={`${button.id}`}
                                    />
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
                                        autoComplete={"off"}
                                        value={(values[button.id]) || ""}
                                        onChange={onInputChange}
                                        size='small'
                                        fullWidth
                                        placeholder='...'
                                        name={`${button.id}`}
                                    />
                                </form>
                            );
                        })}
                    </>
                </Box>
            </Box>

            <Box sx={{ display: "flex" }} >
                <TextField
                    autoComplete={"off"}
                    value={values["notes"] || ""}
                    onChange={onInputChange}
                    size='small'
                    fullWidth
                    placeholder='ملاحظات ...'
                    name="notes"
                />
                <Button sx={{ minWidth: "100px", mr: "8px" }} onClick={createNewCheck} >
                    إضافة شيك
                </Button>
            </Box>
            <Box sx={{ mt: 4, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", justifyContent: "space-between" }}>
                {values?.checks?.map && values.checks?.map((checkDetails: any, i: number) =>
                    <CheckForm
                        key={i}
                        checkDetails={checkDetails}
                        setCheckDetails={(checkDetails: any) => setCheckDetails(checkDetails, i)}
                        handleDelete={() => handleDeleteCheck(i)}
                        banks={banks}
                    />
                )
                }
            </Box>
        </>
    )

}

export default Operations