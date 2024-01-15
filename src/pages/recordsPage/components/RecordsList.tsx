import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon, GridToolbar } from '@mui/x-data-grid';

import { IRecord } from "../../../types.ts";
import { deleteRecordById, getRecords, updateRecordById } from "../../../apis/record.ts";
import { IconButton } from "@mui/material";
import DeleteDialog from "./DeleteDialog.tsx";

type Props = {
    filters?: any
}

const RecordsList = (props: Props) => {
    const [recordsRows, setRecordsRows] = useState<IRecord[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [displayedColumns, setDisplayedColumns] = useState<any>({ createdAt: false });
    const [recordToDelete, setRecordToDelete] = useState<IRecord | null>(null);
    const { filters } = props || {}
    const reportForUser = Object.keys(filters).length > 0
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
    useEffect(() => {
        const columns: GridColDef[] = [
            {
                field: 'createdAt',
                headerName: 'تاريخ الانشاء',
                width: 110,
                editable: false,
                type: 'date',
                valueFormatter(params) {
                    return new Date(params.value)?.toLocaleDateString()
                }
            },
            {
                field: 'date',
                headerName: 'التاريخ',
                width: 100,
                editable: true,
                type: 'date',
                disableColumnMenu: true,
                valueFormatter(params) {
                    return new Date(params.value)?.toLocaleDateString()
                }
            },
            {
                field: 'typeTitle',
                headerName: 'النوع',
                width: 80,
                editable: false,
                disableColumnMenu: true,
                // sortable: false,
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
                disableColumnMenu: true,
                renderCell(params) {
                    return <span style={{ color: params.value < 0 ? 'red' : 'green' }}>{params.value}</span>
                },
            },
            {
                field: 'notes',
                headerName: 'ملاحظات',
                width: 180,
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
                field: 'userName',
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
        getRecords(filters).then((res) => {
            setRecordsRows(res.data.map((record: IRecord) => {
                return {
                    id: record.id,
                    date: record.date,
                    type: record.type,
                    typeTitle: record.type?.title,
                    amount: record.amount,
                    notes: record.notes,
                    user: record.user,
                    userName: record.user?.name,
                    cardId: record.user?.cardId,
                    createdAt: record.createdAt,
                    deletedAt: record.deletedAt,

                }
            }))
        })
    }, [])

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
            <DataGrid
                sx={
                    {
                        '@media print': {
                            '.MuiDataGrid-main': {
                                width: reportForUser ? '8cm !important' : '100%',
                                border: 'solid 2px rgba(0, 0, 0, 0.87) !important',
                                marginLeft: 'auto',
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
                        const recordsTotal = recordsRows?.reduce((total, record) => total + record.amount, 0)
                        return <>
                            <Box sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                {
                                    reportForUser ? <>
                                        <p>كشف حساب من سوبر ماركت ابودعجان</p>
                                        <p>من تاريخ: {recordsRows?.[0]?.date?.split('T')[0]}</p>
                                        <p>الي تاريخ: {recordsRows?.[recordsRows.length - 1]?.date?.split('T')[0]}</p>
                                        <p>الاسم: {recordsRows?.[0]?.user?.name}</p>
                                        <p>رقم البطاقة: {recordsRows?.[0]?.user?.cardId}</p>
                                        {/* <p>مجموع قبل الحركات: {recordsRows?.[0]?.user?.total - recordsTotal}</p> */}
                                        <p>مجموع الحركات: {recordsTotal}</p>
                                        <p>المجموع النهائي : {recordsRows?.[0]?.user?.total}</p>
                                    </>
                                        : <>
                                            <p>من تاريخ: {recordsRows?.[0]?.date?.split('T')[0]}</p>
                                            <p>الي تاريخ: {recordsRows?.[recordsRows.length - 1]?.date?.split('T')[0]}</p>
                                        </>
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
                            fields: reportForUser ? ['date', 'amount', 'notes'] : ['date', 'amount', 'notes', 'userName', 'cardId'],
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