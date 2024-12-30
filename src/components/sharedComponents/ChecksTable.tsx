import React, { useState } from 'react';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import moment from 'moment';
import { ICheck } from '../../types.ts';
import { GalleryIcon, Gallery } from './Gallery.tsx';

type ChecksTableProps = {
    checks: ICheck[];
    onRowDoubleClick?: any;
    withSearch?: boolean;
};

const ChecksTable: React.FC<ChecksTableProps> = ({ checks, onRowDoubleClick, withSearch }) => {
    const [imagesToShow, setImagesToShow] = useState<any[]>([]);
    const columns: GridColDef[] = [
        {
            field: 'bank',
            headerName: 'اسم البنك',
            width: 140,
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
        },
        {
            field: 'images',
            headerName: '',
            // width: 50,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => {
                const imagesLength = params.value?.length || 0
                return imagesLength ? <GalleryIcon no={params.value?.length} hiddenNo={!imagesLength} onClick={() => { setImagesToShow(params.value) }} /> : ''
            }
        }
    ];

    return (<>
        <DataGrid
            density='compact'
            disableColumnFilter
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            rows={checks} columns={columns}
            sx={{ mt: "8px", }}
            onRowDoubleClick={({ row }) => onRowDoubleClick(row)}
            slots={{
                toolbar: (props) => {
                    return <>
                        <GridToolbarContainer {...props}>
                            {withSearch && <GridToolbarQuickFilter sx={{ width: '100%' }} />}
                        </GridToolbarContainer>
                    </>
                }
            }}

        />
        {imagesToShow?.length > 0 && <Gallery images={imagesToShow} onClose={() => setImagesToShow([])} />}
    </>
    );
};

export default ChecksTable;
