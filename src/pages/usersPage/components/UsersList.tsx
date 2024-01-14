import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';

import { IUser } from "../../../types.ts";
import { getUsers, updateUserById } from "../../../apis/user.ts";
import { IconButton } from "@mui/material";

const UsersList = () => {
    const [usersRows, setUsersRows] = useState<IUser[]>([]);
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
                field: 'cardId',
                headerName: 'رقم البطاقة',
                width: 110,
                sortable: false,
            },
            {
                field: 'name',
                headerName: 'الاسم',
                width: 170,
                editable: true,
            },
            {
                field: 'phone',
                headerName: 'رقم التلفون',
                sortable: false,
        
                width: 130,
                editable: true,
            },
            {
                field: 'type',
                headerName: 'فئة البطاقة',
                sortable: false,
        
                width: 130,
                valueFormatter(params) {
                    return params.value?.title
                },
            },
            {
                field: 'notes',
                headerName: 'ملاحظات',
                width: 130,
                editable: true,
                sortable: false,
        
            },
            {
                field: 'total',
                headerName: 'الرصيد',
                width: 130,
                type: 'number',
            },
            {
                field: 'limit',
                headerName: 'اعلى حد',
                width: 130,
                editable: true,
                type: 'number',
            },
            {
                field: 'active',
                headerName: 'مفعل',
                sortable: false,
        
                renderCell(params) {
                    return <Switch
                        size="small"
                        defaultChecked={params.value}
                        onChange={(e) => {
                            updateUserById(params.row.id, { active: e.target.checked }).then()
                                .catch(err => alert(err.message || err))
                        }}
                    />
                },
            },
            {
                field: ' ',
                sortable: false,
                width: 60,
                disableColumnMenu: true,
                renderCell(_params) {
                    return <IconButton size="small" onClick={() => {
                        alert("تم ايقاف عملية الحذف، يمكنك التعديل فقط")
                        // deleteUserById(params.row.id)
                        // .then(()=>{
                        //     setUsersRows(usersRows.filter(user => user.id !== params.row.id))
                        // })
                        //     .catch(err => alert(err.message || err))
                    }}
                    >
                        <GridDeleteIcon sx={{ opacity: 0.7, color: 'red' }} />
                    </IconButton>
                },
            }
        
        ]
        setColumns(columns)
        getUsers().then((res) => {
            setUsersRows(res.data.map((user: IUser) => {
                return {
                    id: user.id,
                    cardId: user.cardId,
                    name: user.name,
                    phone: user.phone,
                    type: user.type,
                    notes: user.notes,
                    total: user.total,
                    limit: user.limit,
                    active: user.active
                }
            }))
        })
    }, [])

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
                rows={usersRows}
                columns={columns}
                onCellEditStop={(params, event: any) => {
                    const value = event.target?.value
                    if (value !== params.value) {
                        updateUserById(params.row.id, { [params.field]: value })
                            .catch(err => alert(err.message || err))
                    }
                }}
                // pageSizeOptions={[5, 10, 20, 50, 100]}
                // checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>

    )
}

export default UsersList