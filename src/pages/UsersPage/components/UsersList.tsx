import { useEffect, useState } from "react";
// import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon, GridValueGetterParams } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';

import { IUser } from "../../../types.ts";
import { getUsers, deleteUserById, updateUserById } from "../../../apis/user.ts";
import { IconButton } from "@mui/material";

const columns: GridColDef[] = [
    {
        field: 'cardId',
        headerName: 'رقم البطاقة',
        width: 110,
        sortable: false,

        // type: 'number',

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
        width: 90,
        disableColumnMenu: true,
        renderCell(params) {
            return <IconButton onClick={() => {
                deleteUserById(params.row.id)
                    .catch(err => alert(err.message || err))
            }}
            >
                <GridDeleteIcon sx={{ opacity: 0.7, color: 'red' }} />
            </IconButton>
            // return <button
            //     onClick={() => {
            //         deleteUserById(params.row.id)
            //         .catch(err => alert(err.message || err))
            //     }}
            // >حذف</button>
        },
    }

]
const UsersList = () => {
    useEffect(() => {
        const elements = document.getElementsByClassName("MuiTablePagination-selectLabel muirtl-pdct74-MuiTablePagination-selectLabel");
        Array.from(elements).forEach((element: any) => {
            if (element?.innerText) {
                element.innerText = "عدد الصفوف بالصفحة"
            }
        });
        const elements2 = document.getElementsByClassName("MuiTablePagination-displayedRows muirtl-levciy-MuiTablePagination-displayedRows");
        Array.from(elements2).forEach((element: any) => {
            if (element?.innerText) {
                element.innerText = element?.innerText.replace("of", "من")
            }
        });
    })
    const [users, setUsers] = useState<IUser[]>([]);
    const [usersRows, setUsersRows] = useState<IUser[]>([]);
    useEffect(() => {
        getUsers().then((res) => {
            setUsers(res.data);
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
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={usersRows}
                columns={columns}
                onCellEditStop={(params, event: any) => {
                    const value = event.target?.value
                    if (value !== params.value) {
                        updateUserById(params.row.id, { [params.field]: value })
                            .catch(err => alert(err.message || err))
                    }
                }}


                // checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>

    )
}

export default UsersList