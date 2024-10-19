import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon, GridToolbar } from '@mui/x-data-grid';

import { IRecord } from "../../../types.ts";
import { deleteRecordById, getRecords, updateRecordById } from "../../../apis/record.ts";
import { IconButton, TextField, Typography } from "@mui/material";
import DeleteDialog from "./DeleteDialog.tsx";
import moment from "moment";

type Props = {
    filters?: any
}

const RecordsList = (props: Props) => {
    const [recordsRows, setRecordsRows] = useState<(IRecord & { subTotal?: any })[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [recordToDelete, setRecordToDelete] = useState<IRecord | null>(null);
    const { filters } = props || {}
    const reportForUser = Object.keys(filters).length > 0
    const [displayedColumns, setDisplayedColumns] = useState<any>({
        createdAt: false,
        fullName: !reportForUser,
        typeTitle: false,
        cardId: !reportForUser,
        subTotal: !!reportForUser,
        '': false
    });
    const dateFormat = "YYYY-MM-DD";
    const todayDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    // const LastMounth = moment().subtract(1, 'months').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const lastYear = moment().subtract(1, 'years').set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const [dateStringFrom, setDateStringFrom] = useState<string>((reportForUser ? lastYear : todayDate).format(dateFormat));
    const [dateStringTo, setDateStringTo] = useState<string>(todayDate.format(dateFormat));
    useEffect(() => {
        // const elements = document.getElementsByClassName("MuiTablePagination-selectLabel");
        // Array.from(elements).forEach((element: any) => {
        //     if (element?.innerText) {
        //         // element.innerText = "عدد الصفوف بالصفحة"
        //     }
        // });
        const elements2 = document.getElementsByClassName("MuiTablePagination-displayedRows");
        Array.from(elements2).forEach((element: any) => {
            if (element?.innerText) {
                element.innerText = element?.innerText.replace("of", "من")
            }
        });
    })
    const getRecordsFromDB = () => {
        getRecords({ ...filters, date: { from: dateStringFrom, to: dateStringTo } }).then((res) => {
            let preTotal: number = res.data?.[0]?.user?.total - res.data.reduce((a: number, b: IRecord) => a + b.amount, 0)

            const tempRecord: IRecord = { ...res.data[0] }
            const fullName = res.data[0].user?.subName ? `${res.data[0].user.name} (${res.data[0].user.subName})` : res.data[0].user.name
            tempRecord.user.fullName = fullName
            const firstRecord = {
                subTotal: preTotal,
                amount: '',
                notes: 'رصيد سابق',
                id: 'firstRecord',
                date: tempRecord.date,
                type: tempRecord.type,
                typeTitle: tempRecord.type?.title,
                user: tempRecord.user,
                fullName: fullName,
                cardId: tempRecord.user?.cardId,
                createdAt: tempRecord.createdAt,
                deletedAt: tempRecord.deletedAt,
            }

            const recordsRows = res.data.map((record: IRecord) => {
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
                    subTotal: preTotal

                }
            })
            setRecordsRows([firstRecord, ...recordsRows])
        })
    }
    useEffect(() => {
        getRecordsFromDB()
    }, [filters, dateStringFrom, dateStringTo])
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
                    return moment(params.value)?.format("YYYY-MM-DD");
                }
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
                field: 'amount',
                headerName: 'المبلغ',
                width: 100,
                type: 'number',
                editable: true,
                // disableColumnMenu: true,
                // sortable: false,
                renderCell(params) {
                    return <span style={{ color: params.value < 0 ? 'red' : 'green' }}>{params.value}</span>
                },
            },
            {
                field: 'subTotal',
                headerName: 'المجموع',
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
                field: 'notes',
                headerName: 'ملاحظات',
                width: 400,
                editable: true,
                sortable: false,
                disableColumnMenu: true,
            },
            {
                field: 'cardId',
                headerName: 'رقم البطاقة',
                width: 100,
                disableColumnMenu: true,
            },
            {
                field: 'fullName',
                headerName: 'اسم صاحب البطاقة',
                width: 180,
                disableColumnMenu: true,
                // valueFormatter(params) {
                //     return params.value?.name
                // }
            },
            {
                field: '',
                headerName: '',
                width: 110,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params) => {
                    console.log(params.row)
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
    }, [])

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
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
                        }
                    }
                }
                rows={recordsRows}
                columns={columns}
                disableDensitySelector
                disableColumnFilter
                columnVisibilityModel={displayedColumns}
                onColumnVisibilityModelChange={(model) => setDisplayedColumns(model)}
                onCellEditStop={(params, event: any) => {
                    const value = event.target?.value
                    if (value !== params.value) {
                        updateRecordById(params.row.id, { [params.field]: value })
                            .catch(err => alert(err.message || err))
                    }
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
                                            value={dateStringFrom}
                                            onChange={(e) => setDateStringFrom(e.target.value)}
                                        />
                                        <Typography variant='body1' sx={{ mr: "8px", ml: "24px" }}>الى : </Typography>
                                        <TextField
                                            autoComplete={"off"}
                                            type='date'
                                            sx={{ width: "150px" }}
                                            size='small'
                                            value={dateStringTo}
                                            onChange={(e) => setDateStringTo(e.target.value)}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '50px' }}>
                                    {
                                    reportForUser && <>
                                        <p style={{ fontSize: '18px' }}> الاسم : {recordsRows?.[0]?.user?.fullName}</p>
                                        <p style={{ fontSize: '18px' }}>رقم التلفون : {recordsRows?.[0]?.user?.phone}</p>
                                        <p style={{ fontSize: '18px' }}>رقم البطاقة : {recordsRows?.[0]?.user?.cardId}</p>
                                        <p style={{ fontSize: '18px' }}>المجموع  : {recordsRows?.[0]?.user?.total}</p>
                                    </>
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
                                <GridToolbar {...props} />
                                {/* <GridToolbarQuickFilter/> */}
                            </Box>
                        </>
                    }
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        printOptions: {
                            fields: reportForUser ? ['date', 'amount', 'subTotal', 'notes'] : ['date', 'amount', 'subTotal', 'notes', 'fullName', 'cardId'],
                            hideFooter: true
                        }
                    },
                    pagination: {
                        // rowsPerPageOptions: [5, 10, 20, 50, 100],
                        labelRowsPerPage: 'عدد الحركات في الصفحة',
                    },

                }}
            />
            {recordToDelete && <DeleteDialog
                open={!!recordToDelete}
                setOpen={() => setRecordToDelete(null)}
                handleDelete={(notes) => deleteRecordById({ id: recordToDelete?.id, notes })
                    .then(() => setRecordsRows(recordsRows.filter(record => record.id !== recordToDelete?.id)))
                    .catch(err => alert(err.message || err))
                }
            />}
        </Box>

    )
}

export default RecordsList