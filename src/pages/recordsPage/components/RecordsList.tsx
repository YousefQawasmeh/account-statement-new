import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon, GridFooterContainer, GridPagination, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { IRecord } from "../../../types.ts";
import { deleteRecordById, getRecords, updateRecordById } from "../../../apis/record.ts";
import { IUser } from "../../../types.ts";
import { getUserByCardId } from "../../../apis/user.ts"
import { Chip, IconButton, TextField, Typography } from "@mui/material";
import DeleteDialog from "./DeleteDialog.tsx";
import ChecksTable from "../../../components/sharedComponents/ChecksTable.tsx";
import { Gallery, GalleryIcon } from "../../../components/sharedComponents/Gallery.tsx";
import moment from "moment";
import { getCurrencySymbol, usersTypes } from "../../../utils.ts";

type Props = {
    filters?: any
}

const styles = {
    chip: {
        width: "110px",
        height: "32px",
        m: "5px",
        borderWidth: "2px",
        fontSize: "18px",
        alignItems: "baseline"
    }
};

const sortComparator = (v1: any, v2: any, param1: any, param2: any) => {
    if (param1.id === "total" || param2.id === "total" || param1.id === "firstRecord" || param2.id === "firstRecord") return 0
    return v1 - v2
}

const RecordsList = (props: Props) => {
    const [recordsRows, setRecordsRows] = useState<IRecord[]>([]);
    const [debtorSum, setDebtorSum] = useState<number>(0);
    const [creditorSum, setCreditorSum] = useState<number>(0);
    const [checksSum, setChecksSum] = useState<number>(0);
    const [user, setUser] = useState<IUser | null>(null);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [recordToDelete, setRecordToDelete] = useState<IRecord | null>(null);
    const { filters } = props || {}
    const [chipsFilters, setChipsFilters] = useState<any>({});
    const reportForUser = Object.keys(filters).length > 0
    const [displayedColumns, setDisplayedColumns] = useState<any>({
        createdAt: false,
        fullName: !reportForUser,
        typeTitle: false,
        cardId: !reportForUser,
        // subTotal: !!reportForUser,
        '': false
    });
    const dateFormat = "YYYY-MM-DD";
    const todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    // const LastMounth = moment().subtract(1, 'months').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const lastYear = moment().subtract(1, 'years').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const [dateStringFrom, setDateStringFrom] = useState<string>((reportForUser ? lastYear : todayDate).format(dateFormat));
    const [dateStringTo, setDateStringTo] = useState<string>(todayDate.format(dateFormat));
    const [imagesToShow, setImagesToShow] = useState<any[]>([]);
    const [filteredRecordsRows, setFilteredRecordsRows] = useState<IRecord[]>([]);
    const getRecordsFromDB = () => {
        getRecords({ ...filters, date: { from: dateStringFrom, to: dateStringTo } }).then((res) => {
            let preTotal: number = reportForUser ? res.data?.[0]?.user?.total - res.data.reduce((a: number, b: IRecord) => a + b.amount, 0) : 0

            const tempRecord: IRecord = { ...res.data[0] }
            const fullName = res.data[0].user?.subName ? `${res.data[0].user.name} (${res.data[0].user.subName})` : res.data[0].user.name
            tempRecord.user.fullName = fullName
            const firstRecord = {
                subTotal: preTotal,
                notes: 'رصيد سابق',
                id: 'firstRecord',
                date: tempRecord.date,
            }

            let deptorSum: number = 0
            let creditorSum: number = 0
            let checksSum: number = 0
            const recordsRows = res.data.map((record: IRecord) => {
                if (record.amount > 0) {
                    deptorSum += record.amount
                } else {
                    creditorSum += record.amount
                }
                checksSum += record.checks?.reduce((total, check) => moment(check.dueDate).isAfter(record.date) ? (total + check.amount) : total, 0) || 0
                preTotal += record.amount
                const fullName = record.user?.subName ? `${record.user.name} (${record.user.subName})` : record.user.name
                return {
                    id: record.id,
                    date: record.date,
                    type: record.type,
                    typeTitle: record.type?.title,
                    amount: record.amount,
                    notes: record.notes,
                    user: record.user,
                    fullName: fullName,
                    cardId: record.user?.cardId,
                    createdAt: record.createdAt,
                    deletedAt: record.deletedAt,
                    subTotal: preTotal,
                    checks: record.checks,
                    images: record.images

                }
            })

            const totalRecord = {
                id: 'total',
                subTotal: debtorSum + creditorSum,
                debtor: debtorSum,
                creditor: creditorSum * -1,
            };

            const recordsToDisplay = reportForUser ? [firstRecord, ...recordsRows, totalRecord] : [...recordsRows, totalRecord];
            setRecordsRows(recordsToDisplay);
            setFilteredRecordsRows(recordsToDisplay);
            setDebtorSum(deptorSum);
            setCreditorSum(creditorSum);
            setChecksSum(checksSum);
        });
    };
    useEffect(() => {
        getRecordsFromDB()
    }, [filters, dateStringFrom, dateStringTo])

    useEffect(() => {
        const applyFilters = () => {
            let filteredRecords = [...recordsRows];

            if (chipsFilters.type) {
                filteredRecords = filteredRecords.filter(record => (record.user?.type as any)?.id === chipsFilters.type || record.id === 'firstRecord' || record.id === 'total');
            }

            if (chipsFilters.currency) {
                filteredRecords = filteredRecords.filter(record => record.user?.currency === chipsFilters.currency || record.id === 'firstRecord' || record.id === 'total');
            }

            let deptorSum: number = 0
            let creditorSum: number = 0
            let checksSum: number = 0
            let preTotal = 0

            filteredRecords.map(record => {
                if (record.id === 'total' || record.id === 'firstRecord') {
                    return record
                }
                if (record.amount > 0) {
                    deptorSum += record.amount
                } else {
                    creditorSum += record.amount
                }
                preTotal += record.amount
                checksSum += record.checks?.reduce((total, check) => moment(check.dueDate).isAfter(record.date) ? (total + check.amount) : total, 0) || 0
                return { ...record, subTotal: preTotal, debtor: deptorSum, creditor: creditorSum * -1 }
            })

            setFilteredRecordsRows(filteredRecords);
        };

        applyFilters();
    }, [chipsFilters]);

    useEffect(() => {
        const columns: GridColDef[] = [
            {
                field: 'createdAt',
                headerName: 'تاريخ الانشاء',
                width: 110,
                editable: false,
                type: 'date',
                sortable: false,
                valueFormatter(params) {
                    if (!params.value) return ''
                    return moment(params.value)?.format("YYYY-MM-DD");
                }
            },
            {
                field: 'date',
                headerName: 'التاريخ',
                width: 100,
                editable: true,
                type: 'date',
                disableColumnMenu: true,
                sortable: false,
                valueFormatter(params) {
                    if (params.id === 'total') return "المجموع"
                    if (!params.value) return ''
                    return moment(params.value)?.format("YYYY-MM-DD");
                }
            },
            {
                field: 'subTotal',
                headerName: 'الرصيد',
                width: 100,
                type: 'number',
                editable: false,
                disableColumnMenu: true,
                sortable: false,
                renderCell(params) {
                    return <span style={{ color: params.value < 0 ? 'red' : 'green' }}>{params.value}</span>
                },
            },
            {
                field: 'debtor',
                headerName: 'مدين',
                width: 100,
                type: 'number',
                editable: true,
                sortComparator: sortComparator,
                valueGetter: (params) => params.value ?? (params.row.amount >= 0 ? params.row.amount : ""),
            },
            {
                field: 'creditor',
                headerName: 'دائن',
                width: 100,
                type: 'number',
                editable: true,
                sortComparator: sortComparator,
                valueGetter: (params) => params.value ?? (params.row.amount < 0 ? params.row.amount * -1 : ""),
            },
            {
                field: 'typeTitle',
                headerName: 'النوع',
                width: 80,
                editable: false,
                disableColumnMenu: true,
                sortable: false,
                // valueFormatter(params) {
                //     return params.value?.title
                // },
            },
            {
                field: 'fullName',
                headerName: 'اسم صاحب البطاقة',
                width: 180,
                disableColumnMenu: true,
                sortComparator: sortComparator,
                // valueFormatter(params) {
                //     return params.value?.name
                // }
            },
            {
                field: 'notes',
                headerName: 'ملاحظات',
                width: 600,
                editable: false,
                sortable: false,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <Box>
                        <Typography
                            onClick={(e) => {
                                e.preventDefault();
                                const target = e.target as HTMLElement;
                                target.contentEditable = "true";
                            }}
                            onKeyDown={(e) => {
                                const target = e.target as HTMLElement;
                                if (e.key === 'Enter') {
                                    target.contentEditable = "false";
                                    updateRecordById(params.row.id, { notes: target.innerText })
                                }
                                if (e.code === 'Space') {
                                    e.stopPropagation();
                                }
                            }}
                            variant="body2"
                            sx={{ whiteSpace: 'pre-wrap', py: "2px", minWidth: "200px", textAlign: "justify", "&:focus": { outline: "solid #4caf50 1px" } }}
                        >
                            {params.value}
                        </Typography>
                        {!!params.row?.checks?.length && <ChecksTable checks={params.row?.checks} />}
                    </Box>
                )
            },
            {
                field: 'cardId',
                headerName: 'رقم البطاقة',
                width: 100,
                disableColumnMenu: true,
                sortComparator: sortComparator,
            },
            {
                field: 'images',
                headerName: 'صور',
                width: 50,
                disableColumnMenu: true,
                sortable: false,
                renderCell: (params) => {
                    const imagesLength = params.value?.length || 0
                    return imagesLength ? <GalleryIcon no={params.value?.length} hiddenNo={!imagesLength} onClick={() => { setImagesToShow(params.value) }} /> : ''
                }
            },
            {
                field: '',
                headerName: '',
                width: 110,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params) => {
                    return params.row.deletedAt ? <span>محذوف</span> : <IconButton
                        size="small"
                        onClick={() => { setRecordToDelete(params.row) }}
                    >
                        <GridDeleteIcon sx={{ opacity: 0.7, color: 'red' }} />
                    </IconButton>
                }
            }
        ]
        setColumns(columns)
        // getRecordsFromDB()
        filters.cardId && getUserByCardId(filters.cardId).then(res => setUser(res.data))
    }, [])

    const updateUserAndRecords = () => {
        getUserByCardId(filters.cardId).then(res => {
            setUser(res.data);
            getRecordsFromDB();
        })
    }

    return (
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
            <DataGrid
                sx={
                    {
                        '@media print': {
                            marginBottom: 'auto !important',
                            '.MuiDataGrid-main': {
                                // width: reportForUser ? '8cm !important' : '100%',
                                // border: 'solid 2px rgba(0, 0, 0, 0.87) !important',
                                // marginLeft: 'auto',
                            },
                            '.MuiDataGrid-cellContent': {
                                // maxWidth: '80px !important',
                                textWrap: 'wrap !important',
                            },
                            "*": {
                                direction: 'ltr !important',
                                // color: 'black !important',
                                textWrap: 'wrap !important',
                            }
                        },
                        "& .MuiDataGrid-row:nth-of-type(even)": {
                            backgroundColor: '#f9f9f9',
                        },
                        "& .MuiDataGrid-aggregationColumnHeader": {
                            backgroundColor: '#f9f9f9',
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-withBorderColor": {
                            borderColor: '#4caf5050',
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: '#4caf5040',
                        },
                        '& .MuiDataGrid-cell[data-field="notes"]:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell[data-field="notes"]:focus-within': {
                            outline: 'none',
                        },
                    }
                }
                rows={filteredRecordsRows}
                columns={columns}
                disableDensitySelector
                disableColumnFilter
                columnVisibilityModel={displayedColumns}
                onColumnVisibilityModelChange={(model) => setDisplayedColumns(model)}
                onCellEditStop={(params, event: any) => {
                    let value = event.target?.value
                    let key = params.field
                    if (key === "creditor") {
                        key = "amount"
                        value = value > 0 ? -value : value
                    }
                    if (key === "debtor") {
                        key = "amount"
                        value = value > 0 ? value : -value
                    }
                    if (value !== params.value) {
                        updateRecordById(params.row.id, { [key]: value })
                            .then(res => {
                                setRecordsRows(recordsRows.map((record) => record.id === res.data?.updatedRecord?.id ? { ...record, ...res.data?.updatedRecord } : record));
                                setFilteredRecordsRows(filteredRecordsRows.map((record) => record.id === res.data?.updatedRecord?.id ? { ...record, ...res.data?.updatedRecord } : record));
                                updateUserAndRecords()
                            })
                            .catch(err => alert(err.message || err))
                    }
                }}
                getRowHeight={(params) => {
                    const baseHeight = 32;
                    const row = recordsRows.find((row) => row.id === params.id);
                    const numberOfChecks = (row?.checks?.length || 0);
                    // const lines = row?.notes?.split("\n").length || 1;
                    const lines = Math.ceil((row?.notes?.length ?? 0) / 50) || 1;
                    return (numberOfChecks ? numberOfChecks + 2 : 0) * 32 + (baseHeight * lines);
                }}
                disableRowSelectionOnClick
                density="compact"
                slots={{
                    toolbar: (props) => {
                        // const recordsTotal = recordsRows?.reduce((total, record) => total + +record.amount, 0)
                        return <>
                            <Box sx={{ textAlign: 'left', padding: '0 10px' }}>
                                <Box
                                    sx={
                                        {
                                            '@media print': {
                                                // "*": { display: 'none !important', }
                                            }
                                        }
                                    }
                                >
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        my: "6px",
                                        "& p": { minWidth: "30px", }
                                    }}>
                                        <Typography variant='body1' sx={{ mr: "8px" }}>من : </Typography>
                                        <TextField
                                            autoComplete={"off"}
                                            type='date'
                                            sx={{ width: "150px" }}
                                            size='small'
                                            defaultValue={dateStringFrom}
                                            onChange={(e) => setTimeout(() => setDateStringFrom(e.target.value), 3000)}
                                            onKeyDown={(e: any) => e.key === 'Enter' && setDateStringFrom(e.target.value)}
                                        />
                                        <Typography variant='body1' sx={{ mr: "8px", ml: "24px" }}>الى : </Typography>
                                        <TextField
                                            autoComplete={"off"}
                                            type='date'
                                            sx={{ width: "150px" }}
                                            size='small'
                                            defaultValue={dateStringTo}
                                            onChange={(e) => setTimeout(() => setDateStringTo(e.target.value), 3000)}
                                            onKeyDown={(e: any) => e.key === 'Enter' && setDateStringTo(e.target.value)}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                                    {
                                        reportForUser ? <>
                                            <p style={{ fontSize: '18px' }}> الاسم : {user?.fullName}</p>
                                            <p style={{ fontSize: '18px' }}>رقم التلفون : {user?.phone}</p>
                                            <p style={{ fontSize: '18px' }}>رقم البطاقة : {user?.cardId}</p>
                                            <p style={{ fontSize: '18px' }}>المجموع  : {user?.total}</p>
                                            <p>

                                                <Chip
                                                    variant={'outlined'}
                                                    color={(user?.type as any)?.id === 1 ? 'primary' : 'secondary'}
                                                    sx={{ ...styles.chip }}
                                                    label={usersTypes[+(user?.type as any)?.id]}
                                                />
                                                <Chip
                                                    variant={'outlined'}
                                                    color={'info'}
                                                    sx={{ ...styles.chip, width: '60px', "> span": { scale: user?.currency === 'شيكل' ? "1.7" : "1.1" } }}
                                                    label={getCurrencySymbol(user?.currency)}
                                                />
                                            </p>
                                        </>
                                            : <></>
                                    }
                                </Box>
                                {
                                    /* {
                                        reportForUser ? <>
                                            <p>كشف حساب من سوبر ماركت ابودعجان</p>
                                            <p>من تاريخ: {dateStringFrom}</p>
                                            <p>الي تاريخ: {dateStringTo}</p>
                                            <p>الاسم: {recordsRows?.[0]?.user?.name}</p>
                                            <p>رقم البطاقة: {recordsRows?.[0]?.user?.cardId}</p>
                                            <p>مجموع قبل {dateStringFrom}: {recordsRows?.[0]?.user?.total - recordsTotal}</p>
                                            <p>مجموع الحركات: {recordsTotal}</p>
                                            <p>المجموع النهائي : {recordsRows?.[0]?.user?.total}</p>
                                        </>
                                            : <>
                                                <p>من تاريخ: {dateStringFrom}</p>
                                                <p>الي تاريخ: {dateStringTo}</p>
                                            </>
                                     */
                                }
                            </Box>
                            <Box sx={{ displayPrint: 'none' }}>
                                <GridToolbarContainer {...props}>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarExport />
                                    {reportForUser ? <></>
                                        : <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "auto" }}>
                                            <Chip
                                                label="ذمم مدينة"
                                                onClick={() => {
                                                    setChipsFilters({ ...chipsFilters, type: chipsFilters.type === 1 ? "" : 1 });
                                                }}
                                                variant={chipsFilters.type === 1 ? "filled" : "outlined"}
                                                color="primary"
                                                sx={{ margin: "5px", ...(chipsFilters.type === 1 ? { border: 0, padding: "2px" } : {}) }}
                                            />
                                            <Chip
                                                label="ذمم دائنة"
                                                onClick={() => {
                                                    setChipsFilters({ ...chipsFilters, type: chipsFilters.type === 2 ? "" : 2 });
                                                }}
                                                variant={chipsFilters.type === 2 ? "filled" : "outlined"}
                                                color="secondary"
                                                sx={{ margin: "5px", ...(chipsFilters.type === 2 ? { border: 0, padding: "2px" } : {}) }}
                                            />
                                            <Box sx={{ width: "1px", height: "40px", bgcolor: "green", mx: "5px" }} />
                                            <Chip
                                                label="شيكل"
                                                onClick={() => {
                                                    setChipsFilters({ ...chipsFilters, currency: chipsFilters.currency === "شيكل" ? "" : "شيكل" });
                                                }}
                                                variant={chipsFilters.currency === "شيكل" ? "filled" : "outlined"}
                                                color="info"
                                                sx={{ margin: "5px", ...(chipsFilters.currency === "شيكل" ? { border: 0, padding: "2px" } : {}) }}
                                            />
                                            <Chip
                                                label="دينار"
                                                onClick={() => {
                                                    setChipsFilters({ ...chipsFilters, currency: chipsFilters.currency === "دينار" ? "" : "دينار" });
                                                }}
                                                variant={chipsFilters.currency === "دينار" ? "filled" : "outlined"}
                                                color="info"
                                                sx={{ margin: "5px", ...(chipsFilters.currency === "دينار" ? { border: 0, padding: "2px" } : {}) }}
                                            />
                                            <Chip
                                                label="دولار"
                                                onClick={() => {
                                                    setChipsFilters({ ...chipsFilters, currency: chipsFilters.currency === "دولار" ? "" : "دولار" });
                                                }}
                                                variant={chipsFilters.currency === "دولار" ? "filled" : "outlined"}
                                                color="info"
                                                sx={{ margin: "5px", ...(chipsFilters.currency === "دولار" ? { border: 0, padding: "2px" } : {}) }}
                                            />
                                        </Box>
                                    }
                                    <GridToolbarQuickFilter sx={{ ...(reportForUser ? { ml: 'auto' } : {}) }} />
                                </GridToolbarContainer>
                            </Box>
                        </>
                    },
                    footer: () => {
                        return (
                            <GridFooterContainer  >
                                <Box sx={{ px: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'green', mr: '16px' }}>الذمم المدينة: {debtorSum}</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px', color: 'red', mr: '16px' }}>الذمم الدائنة: {creditorSum * -1}</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '16px' }}>شيكات غير مستحقة: {checksSum}</Typography>

                                </Box>
                                <GridPagination
                                    labelRowsPerPage="عدد السجلات في الصفحة"
                                    labelDisplayedRows={({ to, from, count }) => `${to}-${from} من ${count}`}
                                />
                            </GridFooterContainer>
                        )
                    },
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        printOptions: {
                            fields: reportForUser ? ['date', 'subTotal', 'debtor', 'creditor', 'notes'] : ['date', 'subTotal', 'debtor', 'creditor', 'fullName', 'notes', 'cardId'],
                            hideFooter: true
                        }
                    },
                    pagination: {
                        labelRowsPerPage: 'عدد السجلات في الصفحة',
                        labelDisplayedRows: (paginationInfo) => {
                            const { from, to, count } = paginationInfo;
                            return `${to}-${from} من ${count}`;
                        },
                    },

                }}
            />
            {recordToDelete && <DeleteDialog
                open={!!recordToDelete}
                setOpen={() => setRecordToDelete(null)}
                handleDelete={(notes) => deleteRecordById({ id: recordToDelete?.id, notes })
                    .then(() => {
                        setRecordsRows(recordsRows.filter(record => record.id !== recordToDelete?.id));
                        setFilteredRecordsRows(filteredRecordsRows.filter(record => record.id !== recordToDelete?.id));
                        updateUserAndRecords()
                    })
                    .catch(err => alert(err.message || err))
                }
            />}
            {imagesToShow?.length > 0 && <Gallery images={imagesToShow} onClose={() => setImagesToShow([])} />}
        </Box>

    )
}

export default RecordsList
