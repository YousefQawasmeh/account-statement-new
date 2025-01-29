import { Box, Switch, Typography } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridColDef } from '@mui/x-data-grid';
import { IBank, ICheck } from "../../types.ts";
import { updateCheckById } from "../../apis/check.ts";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Gallery, GalleryIcon } from "../../components/sharedComponents/Gallery.tsx";
import { allCurrencies, getCurrencySymbol } from "../../utils.ts";

type ChecksTableProps = {
    checks: ICheck[];
    setChecks?: React.Dispatch<React.SetStateAction<ICheck[]>>;
    viewOnly?: boolean;
    columnsHidden?: string[];
    onRowDoubleClick?: any;
    allBanks?: IBank[]
};
const ChecksTable = ({ checks, setChecks, viewOnly = false, columnsHidden, onRowDoubleClick, allBanks }: ChecksTableProps) => {
    const [imagesToShow, setImagesToShow] = useState<any[]>([]);
    const [displayedColumns, setDisplayedColumns] = useState<any>({
        "bank": true,
        "checkNumber": true,
        "dueDate": true,
        "amount": true,
        "currency": true,
        "notes": true,
        "userNameFrom": true,
        "userNameTo": true,
        "resceivedDate": false,
        "deliveredDate": false,
        "available": true,
        "images": true
    });
    const columns: GridColDef[] = ([
        {
            field: "bank",
            headerName: "اسم البنك",
            valueGetter: (params) => params.value?.name || allBanks?.find((bank: IBank) => bank.id === params.value)?.name,
            width: viewOnly ? 150 : 180,
            sortable: true,
            type: "singleSelect",
            editable: true && !viewOnly,
            valueOptions: allBanks?.map((bank: IBank) => bank.name)
        }, {
            field: "checkNumber",
            headerName: "رقم الشيك",
            editable: true && !viewOnly,
            width: viewOnly ? 95 : 95,
            sortable: false,
            renderCell: (params) => <Typography variant="body2" sx={{ width: "100%", textAlign: "end" }}>{params.value}</Typography>
        },
        {
            field: "dueDate",
            headerName: "تاريخ الاستحقاق",
            type: "date",
            editable: true && !viewOnly,
            width: viewOnly ? 110 : 110,
            valueFormatter(params) { return moment(params.value)?.format("YYYY-MM-DD"); }
        },
        {
            field: "amount",
            headerName: "المبلغ",
            type: "number",
            editable: true && !viewOnly,
            width: viewOnly ? 90 : 90,
            valueFormatter: (params) => (+params.value),
            // renderCell: (params) => <Typography variant="body2">{params.value} {getCurrencySymbol(params.row?.currency || "شيكل")}</Typography>
        },
        {
            field: "currency",
            headerName: "العملة",
            valueGetter: (params) => getCurrencySymbol(params.value || "شيكل"),
            width: 10,
            editable: true && !viewOnly,
            type: "singleSelect",
            valueOptions: allCurrencies.map((c) => c.name),
        },
        {
            field: "notes",
            headerName: "ملاحظات",
            editable: true && !viewOnly,
            width: 250,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "userNameFrom",
            headerName: "مُسْتَلَم من",
            valueGetter: (params) => params.row?.fromRecord?.user?.subName ? `${params.row?.fromRecord?.user?.name} (${params.row?.fromRecord?.user?.subName})` : params.row?.fromRecord?.user?.name,
            width: 125,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "userNameTo",
            headerName: "مُسَلَّم الى",
            valueGetter: (params) => params.row?.toRecord?.user?.subName ? `${params.row?.toRecord?.user?.name} (${params.row?.toRecord?.user?.subName})` : params.row?.toRecord?.user?.name,
            width: 125,
            sortable: false,
            disableColumnMenu: true
        },
        {
            field: "resceivedDate",
            type: "date",
            headerName: "تاريخ الاستلام",
            valueGetter: (params) => new Date(params.row?.fromRecord?.date),
            valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
        },
        {
            field: "deliveredDate",
            type: "date",
            headerName: "تاريخ التسليم",
            valueGetter: (params) => new Date(params.row?.toRecord?.date),
            valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
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
    return <>
        <DataGrid
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
                let value = event.target?.value
                if(params.field === "currency") value = event.target.innerText
                if(params.field === "bank") value = allBanks?.find((bank: IBank) => bank.name === event.target.innerText)?.id
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
        {imagesToShow?.length > 0 && <Gallery images={imagesToShow} onClose={() => setImagesToShow([])} />}
    </>
};
export default ChecksTable