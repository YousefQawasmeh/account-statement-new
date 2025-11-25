import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter, GridRowSelectionModel } from "@mui/x-data-grid";
import { getOverdueUsers } from "../../../apis/reports";
import { sendRemindersToOverdueUsersByIds } from "../../../apis/reminder";
import { getCurrencySymbol } from "../../../utils";
import moment from "moment";
import SendIcon from '@mui/icons-material/Send';

const OverdueUsers = () => {
    const [days, setDays] = useState<number>(35);
    const [usersRows, setUsersRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsersIds, setSelectedUsersIds] = useState<GridRowSelectionModel>([]);
    const [sendingReminders, setSendingReminders] = useState(false);

    const handleGetReport = async () => {
        setLoading(true);
        try {
            const data = await getOverdueUsers(days);
            setUsersRows(data.map((user: any, index: number) => ({
                id: index,
                ...user
            })));
        } catch (error: any) {
            alert(error.message || "حدث خطأ في جلب التقرير");
        } finally {
            setLoading(false);
        }
    };

    const handleSendReminders = async () => {
        if (selectedUsersIds.length === 0) {
            alert("يرجى اختيار مستخدم واحد على الأقل");
            return;
        }

        const selectedUsers = usersRows.filter(user => selectedUsersIds.includes(user.id));
        const actualUsersIds = selectedUsers.map(user => user.id);

        const confirmMessage = `هل تريد إرسال تذكير لـ ${selectedUsersIds.length} مستخدم؟`;
        if (!window.confirm(confirmMessage)) {
            return;
        }

        setSendingReminders(true);
        try {
            await sendRemindersToOverdueUsersByIds(actualUsersIds);
            alert("تم إرسال التذكيرات بنجاح");
            setSelectedUsersIds([]);
        } catch (error: any) {
            alert(error.message || "حدث خطأ في إرسال التذكيرات");
        } finally {
            setSendingReminders(false);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'الاسم',
            width: 190,
        },
        // {
        //     field: 'cardId',
        //     headerName: 'رقم البطاقة',
        //     width: 110,
        //     sortable: true,
        // },
        {
            field: 'subName',
            headerName: 'الاسم الفرعي',
            width: 140,
        },
        {
            field: 'total',
            headerName: 'الرصيد',
            width: 130,
            type: 'number',
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value} {getCurrencySymbol(params.row?.currency || "شيكل")}
                </Typography>
            )
        },
        {
            field: 'phone',
            headerName: 'رقم التلفون',
            width: 130,
        },
        {
            field: 'daysSinceLastPayment',
            headerName: 'متخلف منذ (يوم)',
            width: 180,
            type: 'number',
            renderCell: (params) => (
                <Typography variant="body2">
                    {moment().diff(params.row.lastPaymentDate, 'days') || "∞"}
                    {/* {moment().diff(params.row.lastPaymentDate, 'days')} يوم */}
                </Typography>
            )
        },
        {
            field: 'lastPaymentDate',
            headerName: 'تاريخ آخر دفعة',
            width: 150,
            valueFormatter: (params) => {
                if (!params.value) return 'لا يوجد';
                return moment(params.value)?.format("YYYY-MM-DD");
            }
        },
        {
            field: 'lastPurchaseDate',
            headerName: 'تاريخ آخر حركة',
            width: 150,
            valueFormatter: (params) => {
                if (!params.value) return 'لا يوجد';
                return moment(params.value)?.format("YYYY-MM-DD");
            }
        }
    ];

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 16 }}>
                    <TextField
                        label="عدد الأيام"
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        size="small"
                        sx={{ width: 200 }}
                        InputProps={{ inputProps: { min: 1 } }}
                        autoFocus
                    />
                    <Button
                        type={"submit"}
                        variant="contained"
                        onClick={handleGetReport}
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : 'عرض التقرير'}
                    </Button>
                </form>
                {usersRows.length > 0 && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon />}
                        onClick={handleSendReminders}
                        disabled={sendingReminders || selectedUsersIds.length === 0}
                        sx={{ mr: 'auto' }}
                    >
                        {sendingReminders ? 'جاري الإرسال...' : `إرسال تذكير (${selectedUsersIds.length})`}
                    </Button>
                )}
            </Box>

            {usersRows.length > 0 && (
                <Box sx={{ flexGrow: 1, height: 'calc(100vh - 250px)' }}>
                    <DataGrid
                        sx={{
                            '@media print': {
                                "*": {
                                    direction: 'ltr !important',
                                }
                            },
                            "& .MuiDataGrid-row:nth-of-type(even)": {
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
                        }}
                        rows={usersRows}
                        columns={columns}
                        density="compact"
                        checkboxSelection
                        disableRowSelectionOnClick
                        rowSelectionModel={selectedUsersIds}
                        onRowSelectionModelChange={(newSelection) => {
                            setSelectedUsersIds(newSelection);
                        }}
                        slots={{
                            toolbar: (props) => {
                                return (
                                    <Box sx={{ displayPrint: 'none' }}>
                                        <GridToolbarContainer {...props}>
                                            <GridToolbarExport />
                                            <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
                                        </GridToolbarContainer>
                                    </Box>
                                );
                            }
                        }}
                        slotProps={{
                            toolbar: {
                                printOptions: {
                                    hideFooter: true
                                }
                            },
                            pagination: {
                                // labelSelectedRowCount: 'صفوف محددة',
                                labelRowsPerPage: 'عدد الصفوف في الصفحة',
                                labelDisplayedRows: (paginationInfo) => {
                                    const { from, to, count } = paginationInfo;
                                    return `${to}-${from} من ${count}`;
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default OverdueUsers;
