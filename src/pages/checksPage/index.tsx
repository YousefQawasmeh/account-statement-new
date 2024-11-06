import { useEffect, useState } from "react";
import { Box, Typography, Switch } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { ICheck } from "../../types.ts";
import { getChecks, updateCheckById } from "../../apis/check.ts";
import { AxiosResponse } from "axios";
import moment from "moment";
const ChecksPage = () => {
    const [checks, setChecks] = useState<ICheck[]>([]);

    useEffect(() => {
        getChecks().then((res: AxiosResponse<ICheck[]>) => {
            setChecks(res.data);
        }).catch(err => alert(err.message || err))
    }, [])

    return <Box>
        <Box sx={{ m: "20px", display: "flex", justifyContent: "space-between" }} >
            <Typography variant="h5">
                البطاقات
                <Link style={{ display: "flex", fontSize: "14px" }} to="/account-statement-new/">
                    الصفحة الرئيسية
                </Link>
            </Typography>
        </Box>
        <DataGrid
            rows={checks}
            columns={[
                {
                    field: "bank",
                    headerName: "اسم البنك",
                    valueGetter: (params) => params.value?.name,
                    width: 200,
                    sortable: true,
                    disableColumnMenu: true
                }, {
                    field: "checkNumber",
                    headerName: "رقم الشيك",
                    type: "number",
                    editable: true,
                    width: 150,
                    sortable: false,
                    disableColumnMenu: true
                },
                {
                    field: "dueDate",
                    headerName: "تاريخ الاستحقاق",
                    type: "date",
                    editable: true,
                    disableColumnMenu: true,
                    width: 125,
                    valueFormatter(params) { return moment(params.value)?.format("YYYY-MM-DD"); }
                },
                {
                    field: "amount",
                    headerName: "المبلغ",
                    type: "number",
                    editable: true,
                },
                {
                    field: "notes",
                    headerName: "ملاحظات",
                    editable: true,
                    width: 250,
                    disableColumnMenu: true
                },
                {
                    field: "userName",
                    headerName: "اسم الزبون",
                    valueGetter: (params) => params.row?.record?.user?.subName ? `${params.row?.record?.user?.name} (${params.row?.record?.user?.subName})` : params.row?.record?.user?.name,
                    width: 180,
                    sortable: false,
                    disableColumnMenu: true
                },
                {
                    field: "record",
                    headerName: "تاريخ الاستلام",
                    valueGetter: (params) => moment(params.value?.date).format("YYYY-MM-DD"),
                },
                {
                    field: "available",
                    headerName: "متوفر",
                    type: "boolean",
                    editable: false,
                    renderCell: (params) => {
                        return <Switch
                            checked={params.value}
                            onChange={(e) => {
                                setChecks(checks.map((check: ICheck) => check.id === params.row.id ? { ...check, available: e.target.checked } : check))
                                updateCheckById(params.row.id + "", { available: e.target.checked }).then((res: AxiosResponse<ICheck>) => {
                                    setChecks(checks.map((check: ICheck) => check.id === res.data.id ? { ...check, ...res.data } : check))
                                }).catch(err => alert(err.message || err))
                            }} />
                    }
                }
            ]}
            disableRowSelectionOnClick
            density="compact"
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
                    labelRowsPerPage: 'عدد الشيكات في الصفحة',
                    labelDisplayedRows: (paginationInfo) => {
                      const { from, to, count } = paginationInfo;
                      return `${to}-${from} من ${count}`;
                    },
                },

            }}
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
            onCellEditStop={(params, event: any) => {
                const value = event.target?.value
                if (value !== params.value) {
                    updateCheckById(params.row?.id, { [params.field]: value }).then((res: AxiosResponse<ICheck>) => {
                        setChecks(checks.map((check: ICheck) => check.id === res.data.id ? { ...check, ...res.data } : check))
                    }).catch(err => alert(err.message || err))
                }
            }}
        />
    </Box>
};
export default ChecksPage