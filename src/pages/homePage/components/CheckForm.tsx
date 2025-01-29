import { Autocomplete, IconButton, InputAdornment, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react'
import { IBank, IUser } from '../../../types';
import { AddedImagesViewer, AddImageIconButton } from "../../../components/sharedComponents/AddedImagesViewer.tsx";
import moment from 'moment';
import { allCurrencies } from '../../../utils.ts';

type CheckFormProps = {
    handleDelete: () => void,
    checkDetails: any,
    setCheckDetails: any,
    banks: IBank[],
    viewOnly?: boolean
}

const CheckForm = ({ handleDelete, checkDetails, setCheckDetails, banks, viewOnly }: CheckFormProps) => {

    const handleChange = (e: { target: { name: string; value: any; }; }) => {
        if (viewOnly) return
        setCheckDetails({ ...checkDetails, [e.target.name]: e.target.value });
    };

    const handleImagesChange = (newImages: any) => {
        handleChange({ target: { name: "images", value: newImages } })
    };


    const [selectedCurrency, setSelectedCurrency] = useState(allCurrencies.find((currency) => currency.name === checkDetails.currency));
    const [currencyOpen, setCurrencyOpen] = useState(false);

    const handleCurrencyClick = () => {
        setCurrencyOpen(true);
    };

    const handleCurrencyChange = (_: any, value: any) => {
        setSelectedCurrency(value);
        setCurrencyOpen(false);
        setCheckDetails({ ...checkDetails, currency: value.name });
    };

    // const banks = [
    //     { id: 73, name: "البنك الاسلامي العربي" },
    //     { id: 82, name: "بنك القدس" },
    //     { id: 49, name: "البنك العربي" },
    //     { id: 67, name: "البنك العقاري المصري العربي" },
    //     { id: 37, name: "بنك الأردن" },
    //     { id: 66, name: "بنك القاهرة عمان" },
    //     { id: 84, name: "بنك الاسكان للتجارة والتمويل" },
    //     { id: 71, name: "البنك التجاري الأردني" },
    //     { id: 43, name: "البنك الأهلي الأردني" },
    //     { id: 89, name: "بنك فلسطين" },
    //     { id: 81, name: "البنك الإسلامي الفلسطيني" },
    //     { id: 76, name: "بنك الاستثمار الفلسطيني" },
    //     { id: 27, name: "البنك الوطني" },
    //     { id: 10, name: "بنك اسرائيلي" }
    // ]

    const [selectedBank, setSelectedBank] = useState(null);
    useEffect(() => {
        if (checkDetails?.bank) {
            setSelectedBank(checkDetails.bank)
        }
        else {
            const bank: any = banks.find(bank => bank.id === checkDetails.bankId)
            setSelectedBank(bank)
        }
    }, [checkDetails.bank, checkDetails.bankId])

    return (
        <form autoComplete="off" style={{ border: "1px dashed #ccc", padding: "12px", position: "relative" }}>
            <fieldset disabled={viewOnly} style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", margin: 0, padding: 0, border: 0, }}>

                <TextField
                    label="المبلغ"
                    name="amount"
                    value={checkDetails.amount}
                    onChange={handleChange}
                    sx={{ m: 0, width: "150px" }}
                    size="small"
                    margin="normal"
                    InputProps={{
                        startAdornment: currencyOpen ? <Autocomplete
                            disablePortal
                            size='small'
                            open={currencyOpen}
                            onClose={() => setCurrencyOpen(false)}
                            onChange={handleCurrencyChange}
                            options={allCurrencies}
                            getOptionLabel={(option) => (option.symbol)}
                            renderInput={(params) => (
                                <TextField sx={{ background: "transparent" }} {...params} label="العملة" />
                            )}
                            value={selectedCurrency}
                            sx={{ width: "100%", m: 0, p: 0, height: "100%", "*": { border: 0 } }}
                        />
                            : <InputAdornment onClick={handleCurrencyClick} sx={{ width: "16px", minWidth: "16px", cursor: "pointer" }} position="start">{selectedCurrency?.symbol || " - "}</InputAdornment>
                    }}
                />
                <TextField
                    label="تاريخ الاستحقاق"
                    name="dueDate"
                    type="date"
                    value={moment(checkDetails.dueDate).format("YYYY-MM-DD")}
                    onChange={handleChange}
                    sx={{ width: "210px", m: 0 }}
                    size="small"
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Autocomplete
                    disablePortal
                    options={banks}
                    value={selectedBank}
                    onChange={(_, newValue: any) => {
                        setSelectedBank(newValue);
                        setCheckDetails({
                            ...checkDetails,
                            bankId: newValue?.id
                        });
                    }}
                    noOptionsText="لا يوجد بنوك"
                    getOptionLabel={(option) => (option.name)}
                    size='small'
                    sx={{ width: 270 }}
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            label="اسم البنك"
                        />
                    )}
                />
                <TextField
                    label="ملاحظات"
                    name="notes"
                    value={checkDetails.notes}
                    onChange={handleChange}
                    sx={{ m: 0 }}
                    size="small"
                    margin="normal"
                />
                <AddImageIconButton handleImagesChange={handleImagesChange} />
            </fieldset>
            <IconButton
                size="small"
                sx={(theme) => ({
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: theme.palette.error.main,
                    color: "#fff",
                    "&:hover": { opacity: 1, backgroundColor: theme.palette.error.main + "88", color: "#fff" },
                    outline: "none !important",
                    zIndex: 10,
                    width: "8px",
                    height: "8px",
                })}
                onClick={handleDelete}
            >
                <CancelIcon />
            </IconButton>
            {checkDetails.images?.length > 0 && <AddedImagesViewer images={checkDetails.images} setNewImages={handleImagesChange} />}
        </form>
    );
};

export default CheckForm;