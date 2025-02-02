import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridDeleteIcon, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton } from '@mui/x-data-grid';
import Switch from '@mui/material/Switch';

import { IUser } from "../../../types.ts";
import { getUsers, updateUserById } from "../../../apis/user.ts";
import { IconButton, Typography } from "@mui/material";
import { allCurrencies, getCurrencySymbol } from "../../../utils.ts";

const UsersList = () => {
    const [usersRows, setUsersRows] = useState<IUser[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const savedDisplayedColumns = localStorage.getItem('displayedColumns');
    const parsedDisplayedColumns = savedDisplayedColumns ? JSON.parse(savedDisplayedColumns) : {
        'cardId': true,
        'name': true,
        'subName': true,
        'phone': true,
        'type': true,
        'notes': true,
        'total': true,
        'currency': false,
        'limit': false,
        'active': false,
    };
    const [displayedColumns, setDisplayedColumns] = useState<any>(parsedDisplayedColumns);

    useEffect(() => {
        const columns: GridColDef[] = [
            {
                field: 'cardId',
                headerName: 'رقم البطاقة',
                width: 110,
                sortable: false,
            },
            {
                field: 'total',
                headerName: 'الرصيد',
                width: 130,
                type: 'number',
                renderCell: (params) => <Typography variant="body2">{params.value} {!displayedColumns.currency && getCurrencySymbol(params.row?.currency || "شيكل")}</Typography>
            },
            {
                field: 'currency',
                headerName: 'العملة',
                width: 30,
                type: 'singleSelect',
                valueOptions: allCurrencies.map((currency) => ({ label: currency.name + " (" + currency.symbol + ")", value: currency.name })),
                valueFormatter(params) {
                    return getCurrencySymbol(params.value || "شيكل")
                },
            },
            {
                field: 'name',
                headerName: 'الاسم',
                width: 170,
                editable: true,
            },
            {
                field: 'subName',
                headerName: 'الاسم الفرعي',
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
                field: 'phone2',
                headerName: 'رقم التلفون 2',
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

        ];
        setColumns(columns);
        getUsers().then((res) => {
            setUsersRows(res.data.map((user: IUser) => ({
                id: user.id,
                cardId: user.cardId,
                name: user.name,
                subName: user.subName,
                phone: user.phone,
                phone2: user.phone2,
                type: user.type,
                notes: user.notes,
                total: user.total,
                limit: user.limit,
                active: user.active,
                currency: user.currency
            })))
        })
    }, []);

    useEffect(() => {
        localStorage.setItem('displayedColumns', JSON.stringify(displayedColumns));
    }, [displayedColumns]);

    return (
        <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
            <DataGrid
                sx={
                    {
                        '@media print': {
                            marginBottom: 'auto !important',
                            '.MuiDataGrid-main': {
                                margin: 'auto',
                            },
                            '.MuiDataGrid-cellContent': {
                                textWrap: 'wrap !important',
                            },
                            "*": {
                                direction: 'ltr !important',
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
                rows={usersRows}
                columns={columns}
                onCellEditStop={(params, event: any) => {
                    const value = event.target?.value
                    if (value !== params.value) {
                        updateUserById(params.row.id, { [params.field]: value })
                            .catch(err => alert(err.message || err))
                    }
                }}
                density="compact"
                disableRowSelectionOnClick
                slots={{
                    toolbar: (props) => {
                        return <>
                            <Box sx={{ displayPrint: 'none' }}>
                                <GridToolbarContainer {...props}>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarExport />
                                    <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
                                </GridToolbarContainer>
                            </Box>
                        </>
                    }
                }}
                slotProps={{
                    toolbar: {
                        printOptions: {
                            hideFooter: true
                        }
                    },
                    pagination: {
                        labelRowsPerPage: 'عدد الزبائن في الصفحة',
                        labelDisplayedRows: (paginationInfo) => {
                            const { from, to, count } = paginationInfo;
                            return `${to}-${from} من ${count}`;
                        },
                    },

                }}
                columnVisibilityModel={displayedColumns}
                onColumnVisibilityModelChange={(model) => setDisplayedColumns(model)}
            />
        </Box>

    );
}

export default UsersList;
