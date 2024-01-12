import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { IRecord } from "../../../types.ts";
import { getRecords, updateRecordById } from "../../../apis/record.ts";

const RecordsList = () => {
    const [recordsRows, setRecordsRows] = useState<IRecord[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);

    useEffect(() => {
        const elements = document.getElementsByClassName("MuiTablePagination-selectLabel");
        Array.from(elements).forEach((element: any) => {
            if (element?.innerText) {
                element.innerText = "عدد الصفوف بالصفحة"
            }
        });
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
                headerName: 'التاريخ',
                width: 110,
                editable: false,
                valueFormatter(params) {
                    return new Date(params.value)?.toLocaleDateString()
                }
            },
            {
                field: 'date',
                headerName: 'التاريخ',
                width: 110,
                editable: true,
                valueFormatter(params) {
                    return new Date(params.value)?.toLocaleDateString()
                }
            },
            {
                field: 'type',
                headerName: 'النوع',
                width: 110,
                editable: true,
                valueFormatter(params) {
                    return params.value?.title
                },
            },
            {
                field: 'amount',
                headerName: 'المبلغ',
                width: 110,
                editable: true,
            },
            {
                field: 'notes',
                headerName: 'ملاحظات',
                width: 130,
                editable: true,
            },
            {
                field: 'cardId',
                headerName: 'رقم البطاقة',
                width: 110,
            },
            {
                field: 'user',
                headerName: 'اسم البطاقة',
                width: 110,
                valueFormatter(params) {
                    console.log(params)
                    return params.value?.name
                }
            }        
        ]
        setColumns(columns)
        getRecords().then((res) => {
            setRecordsRows(res.data.map((record: IRecord) => {
                return {
                    id: record.id,
                    date: record.date,
                    type: record.type,
                    amount: record.amount,
                    notes: record.notes,
                    user: record.user,
                    cardId: record.user?.cardId,
                    createdAt: record.createdAt,

                }
            }))
        })
    }, [])
    console.log(recordsRows)
    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
            <DataGrid
                sx={
                    {
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
                onCellEditStop={(params, event: any) => {
                    const value = event.target?.value
                    if (value !== params.value) {
                        updateRecordById(params.row.id, { [params.field]: value })
                            .catch(err => alert(err.message || err))
                    }
                }}
                disableRowSelectionOnClick
            />
        </Box>

    )
}

export default RecordsList