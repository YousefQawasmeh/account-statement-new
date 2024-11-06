import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import { ICheck } from '../../types.ts';

type ChecksTableProps = {
    checks: ICheck[];
};

const ChecksTable: React.FC<ChecksTableProps> = ({ checks }) => {
    const columns: GridColDef[] = [
        {
            field: 'bank',
            headerName: 'اسم البنك',
            width: 150,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
            valueFormatter(params) {
                return params.value?.name
            },

        },
        {
            field: 'checkNumber',
            headerName: 'رقم الشيك',
            width: 100,
            editable: false,
            type: 'number',
            disableColumnMenu: true,
            sortable: false,

        },
        {
            field: 'amount',
            headerName: 'المبلغ',
            width: 75,
            editable: false,
            type: 'number',
            disableColumnMenu: true,
            sortable: false,
            
        },
        {
            field: 'dueDate',
            headerName: 'تاريخ الاستحقاق',
            width: 100,
            disableColumnMenu: true,
            sortable: false,
            valueFormatter: (params) => moment(params.value).format("YYYY-MM-DD"),
        },
        {
            field: 'notes',
            headerName: 'ملاحظات',
            width: 130,
            editable: false,
            disableColumnMenu: true,
            sortable: false,
        }
    ];

    return (
        <DataGrid
            density='compact'
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            rows={checks} columns={columns}
            sx={{ mt: "8px", }}
        />
    );
};

export default ChecksTable;
