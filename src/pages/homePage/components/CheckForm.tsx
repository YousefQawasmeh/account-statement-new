import { Autocomplete, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react'
import { IBank } from '../../../types';

type CheckFormProps = {
    handleDelete: () => void,
    checkDetails: any,
    setCheckDetails: any,
    banks: IBank[]
}

const CheckForm = ({ handleDelete, checkDetails, setCheckDetails, banks }: CheckFormProps) => {

    const handleChange = (e: { target: { name: string; value: string | number; }; }) => {
        setCheckDetails({ ...checkDetails, [e.target.name]: e.target.value });
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

    return (
        <form autoComplete="off" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center", border: "1px dashed #ccc", padding: "12px" }}>
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
                sx={{ width: 360 }}
                renderInput={(params: any) => (
                    <TextField
                        {...params}
                        label="اسم البنك"
                    />
                )}
            />
            <TextField
                label="رقم الشيك"
                name="checkNumber"
                value={checkDetails.checkNumber}
                onChange={handleChange}
                size="small"
                sx={{ m: 0 }}
                margin="normal"
            />
            <TextField
                label="المبلغ"
                name="amount"
                value={checkDetails.amount}
                onChange={handleChange}
                sx={{ m: 0, width: "150px" }}
                size="small"
                margin="normal"
            />
            <TextField
                label="تاريخ الاستحقاق"
                name="dueDate"
                type="date"
                value={checkDetails.dueDate}
                onChange={handleChange}
                sx={{ width: "210px", m: 0 }}
                size="small"
                margin="normal"
                InputLabelProps={{ shrink: true }}
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
            <CloseIcon fontSize="small" color="error" sx={{ cursor: "pointer", ":hover": { backgroundColor: "#eee" }, borderRadius: "50%" }} onClick={handleDelete} />
        </form>
    );
};

export default CheckForm;