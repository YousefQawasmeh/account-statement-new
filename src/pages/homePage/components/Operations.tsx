import React, { useRef, useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckForm from "./CheckForm";
import { getBanks } from "../../../apis/bank";
import { IBank, ICheck } from "../../../types.ts";
import ChecksTable from "../../checksPage/ChecksTable.tsx";
import { getAvailableChecks } from "../../../apis/check.ts";
import { AddedImagesViewer, AddImageIconButton } from "../../../components/sharedComponents/AddedImagesViewer.tsx";

type ButtonType = {
    label: string;
    value: number;
    color: "primary" | "secondary";
    variant: "contained" | "outlined" | "text";
    id: number;
};

const buttons: ButtonType[] = [
    // {
    //     label: "نقدي",
    //     value: 0,
    //     color: "primary",
    //     variant: "contained",
    //     id: 4,
    // },
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
        color: "secondary",
        variant: "outlined",
        id: 6,
    },
    // {
    //     label: "نقدي",
    //     value: 0,
    //     color: "primary",
    //     variant: "contained",
    //     id: 1,
    // },
    {
        label: "دين",
        value: 1,
        color: "primary",
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
    const [open, setOpen] = useState<boolean>(false);
    const [showChecksSection, setShowChecksSection] = useState<boolean>(false);
    const [banks, setBanks] = useState<IBank[]>([]);
    const [availableChecks, setAvailableChecks] = useState<ICheck[]>([]);

    const updateChecksFromDB = () => getAvailableChecks().then((res: any) => setAvailableChecks(res.data?.filter((check: any) => check.available))).catch(err => alert(err.message || err))
    const updateBanksFromDB = () => getBanks().then((res: any) => setBanks(res.data)).catch(err => alert(err.message || err))

    useEffect(() => {
        updateChecksFromDB()
        updateBanksFromDB()
    }, [])

    useEffect(() => {
        if (!values?.checks?.length) {
            updateChecksFromDB()
        }
    }, [values?.checks?.length])

    const inputRef = useRef()
    useEffect(() => {
        const inputElm: any = inputRef.current;
        inputElm?.focus()
    }, [autoFocusId])

    const onInputChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleDeleteCheck = (checkIndexToDelete: number) => {
        const newChecks = [...values?.checks].filter((_: any, index: any) => index !== checkIndexToDelete)
        onInputChange({
            target: {
                name: "checks", value: [...newChecks]
            }
        })
    }

    const setCheckDetails = (checkDetails: any, checkIndex: number) => {
        if (checkIndex === values.checks?.length) {
            onInputChange({
                target: {
                    name: "checks", value: [...(values?.checks || []), { ...checkDetails }]
                }
            })
        }
        else {

            onInputChange({
                target: {
                    name: "checks", value: values?.checks?.map((check: any, index: number) => index === checkIndex ? checkDetails : check)
                }
            })
        }
    }

    const createNewCheck = () => {
        onInputChange({
            target: {
                name: "checks",
                value: [
                    ...(values?.checks || []),
                    {
                        checkNumber: '',
                        amount: '',
                        dueDate: '',
                        bankId: null,
                        notes: '',
                    }]
            }
        })
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleImagesChange = (newImages: any) => {
        onInputChange({ target: { name: "images", value: newImages } })
    };

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
                        {buttons.slice(0, buttons.length / 2).map((button) => {
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
                        {buttons.slice(buttons.length / 2).map((button) => {
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
                <AddImageIconButton handleImagesChange={handleImagesChange} />
                <Button sx={{ minWidth: "100px", ml: "8px" }} onClick={() => setShowChecksSection(!showChecksSection)} >
                    إضافة شيك
                </Button>
            </Box>

            {values.images?.length > 0 && <AddedImagesViewer images={values.images} setNewImages={(newImages) => onInputChange({ target: { name: "images", value: newImages } })} />}

            {
                (showChecksSection || values?.checks?.length > 0) && <Box sx={{ mt: 4, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", justifyContent: "start" }}>
                    <Button sx={{}} onClick={createNewCheck} >
                        انشاء شيك جديد
                    </Button>
                    <Button sx={{}} onClick={() => setOpen(true)} >
                        اختيار شيك موجود
                    </Button>
                    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "8px", justifyContent: "space-between" }}>
                        {values?.checks?.map && values.checks?.map((checkDetails: any, i: number) =>
                            <CheckForm
                                key={`${checkDetails?.id}-${i}`}
                                checkDetails={checkDetails}
                                setCheckDetails={(checkDetails: any) => setCheckDetails(checkDetails, i)}
                                handleDelete={() => handleDeleteCheck(i)}
                                banks={banks}
                                viewOnly={!!checkDetails?.id}
                            />
                        )
                        }
                    </Box>
                </Box>
            }
            <Dialog open={open} onClose={handleClose} sx={{ "& .MuiPaper-root": { maxWidth: "60%" } }} >
                <DialogTitle sx={{ m: 0, p: 2 }}>الشيكات المتوفرة</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    {availableChecks.length > 0 ? <>
                        <DialogContentText>
                            قم باختيار الشيك الذي تريده عن طريق الضغط عليه مرتين
                        </DialogContentText>
                        <ChecksTable
                            checks={availableChecks}
                            columnsHidden={["resceivedDate", "deliveredDate", "available", "userNameTo"]}
                            viewOnly
                            onRowDoubleClick={(check: ICheck) => {
                                setCheckDetails(check, values?.checks?.length);
                                setOpen(false)
                            }} />
                    </>
                        : <DialogContentText sx={{ textAlign: "center", width: "300px" }}>لا يوجد شيكات متوفرة حاليا</DialogContentText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        الغاء
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default Operations