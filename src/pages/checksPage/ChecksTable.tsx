import { Box, Switch } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridColDef } from '@mui/x-data-grid';
import { ICheck } from "../../types.ts";
import { updateCheckById } from "../../apis/check.ts";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

type ChecksTableProps = {
    checks: ICheck[];
    setChecks?: React.Dispatch<React.SetStateAction<ICheck[]>>;
    viewOnly?: boolean;
    columnsHidden?: string[];
    onRowDoubleClick?: any;
};
const ChecksTable = ({ checks, setChecks, viewOnly = false, columnsHidden, onRowDoubleClick }: ChecksTableProps) => {
    const [displayedColumns, setDisplayedColumns] = useState<any>({
        "bank": true,
        "checkNumber": true,
        "dueDate": true,
        "amount": true,
        "notes": true,
        "userName": true,
        "record": true,
        "available": true,
    });
    const columns: GridColDef[] = ([
        {
            field: "bank",
            headerName: "اسم البنك",
            valueGetter: (params) => params.value?.name,
            width: viewOnly?150:200,
            sortable: true,
            disableColumnMenu: true
        }, {
            field: "checkNumber",
            headerName: "رقم الشيك",
            type: "number",
            editable: true && !viewOnly,
            width: viewOnly?100:150,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "dueDate",
            headerName: "تاريخ الاستحقاق",
            type: "date",
            editable: true && !viewOnly,
            disableColumnMenu: true,
            width: viewOnly?100:125,
            valueFormatter(params) { return moment(params.value)?.format("YYYY-MM-DD"); }
        },
        {
            field: "amount",
            headerName: "المبلغ",
            type: "number",
            editable: true && !viewOnly,
            width: viewOnly?90:120,
            valueFormatter: (params) => (+params.value),
        },
        {
            field: "notes",
            headerName: "ملاحظات",
            editable: true && !viewOnly,
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
                        if (viewOnly || !setChecks) return
                        setChecks(checks.map((check: ICheck) => check.id === params.row.id ? { ...check, available: e.target.checked } : check))
                        updateCheckById(params.row.id + "", { available: e.target.checked }).then((res: AxiosResponse<ICheck>) => {
                            setChecks(checks.map((check: ICheck) => check.id === res.data.id ? { ...check, ...res.data } : check))
                        }).catch(err => alert(err.message || err))
                    }} />
            }
        }
    ]);

    useEffect(() => {
        const newDisplayedColumns: any = {}
        for (const key in displayedColumns) {
            newDisplayedColumns[key] = displayedColumns[key] && !columnsHidden?.includes(key);
        }
        setDisplayedColumns(newDisplayedColumns)
    }, [])
    return <DataGrid
        rows={checks}
        columns={columns}
        disableRowSelectionOnClick
        density="compact"
        slots={{
            toolbar: (props) => {
                return <>
                    <Box sx={{ displayPrint: 'none' }}>
                        <GridToolbarContainer {...props}>
                            {viewOnly ?
                                <GridToolbarQuickFilter sx={{ width: '100%' }} />
                                : <>
                                    <GridToolbarColumnsButton />
                                    <GridToolbarExport />
                                    <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
                                </>
                            }
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
            if (viewOnly || !setChecks) return
            const value = event.target?.value
            if (value !== params.value) {
                updateCheckById(params.row?.id, { [params.field]: value }).then((res: AxiosResponse<ICheck>) => {
                    setChecks(checks.map((check: ICheck) => check.id === res.data.id ? { ...check, ...res.data } : check))
                }).catch(err => alert(err.message || err))
            }
        }}
        columnVisibilityModel={displayedColumns}
        onColumnVisibilityModelChange={(model) => setDisplayedColumns(model)}
        onRowDoubleClick={({ row }) => { onRowDoubleClick(row) }}
    />
};
export default ChecksTable