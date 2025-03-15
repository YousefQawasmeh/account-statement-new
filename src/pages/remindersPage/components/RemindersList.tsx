import { useEffect, useState, useCallback } from "react";
import { Typography, Button, Popover, IconButton, Box } from '@mui/material';
import { DataGrid, GridColDef, GridDeleteIcon, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Reminder } from "../../../types";
import { deleteReminder, getReminders, updateReminder } from "../../../apis/reminder";
import moment from "moment";
import ReminderForm from "./ReminderForm";
import DeleteDialog from "./DeleteDialog";

const RemindersList = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddReminderPopup, setOpenAddReminderPopup] = useState(false);

  const fetchReminders = useCallback(async () => {
    const reminders = await getReminders();
    setReminders(reminders);
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  useEffect(() => {
    const columns: GridColDef[] = [
      {
        field: 'createdAt',
        headerName: 'تاريخ الانشاء',
        width: 150,
        editable: false,
        type: 'date',
        valueFormatter: (params) => {
          return moment(params.value).format("YYYY-MM-DD");
        }
      },
      {
        field: 'dueDate',
        headerName: 'تاريخ التذكير',
        width: 150,
        editable: true,
        type: 'date',
        valueFormatter: (params) => {
          return moment(params.value).format("YYYY-MM-DD");
        }
      },
      {
        field: 'note',
        headerName: 'ملاحظة',
        width: 600,
        editable: true,
        sortable: false
      },
      {
        field: 'user',
        headerName: 'المستخدم',
        width: 200,
        editable: false,
        valueGetter: (params) => `${params.row.user?.name}${params.row.user?.subName ? `(${params.row.user?.subName})` : ''}`,
      },
      {
        field: ' ',
        headerName: '',
        width: 100,
        sortable: false,
        editable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return (
            <IconButton
              onClick={() => {
                setReminderToDelete(params.row);
                setOpenDeleteDialog(true);
              }}
            >
              <GridDeleteIcon sx={{ opacity: 0.7, color: 'red' }} />
            </IconButton>
          );
        },
      },
    ];
    setColumns(columns);
  }, [setColumns, reminderToDelete]);

  const handleDelete = async () => {
    if (reminderToDelete) {
      await deleteReminder(reminderToDelete.id);
      fetchReminders();
      setReminderToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleReminderCreated = () => {
    fetchReminders();
    setOpenAddReminderPopup(false);
  };

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 150px)' }}>
      <Box sx={{ m: "20px", display: "flex", justifyContent: "space-between" }} >
        <Typography variant="h5">
          التذكيرات
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenAddReminderPopup(true)}
        >
          إنشاء تذكير جديد
        </Button>
      </Box>
      <DataGrid
        rows={reminders}
        columns={columns}
        disableRowSelectionOnClick
        density="compact"
        onCellEditStop={(params, event: any) => {
          const { id, field } = params;
          const value = event.target?.value;
          const reminder = reminders.find((reminder) => reminder.id === id);
          if (reminder) {
            if (field === 'dueDate') {
              reminder.dueDate = value;
            } else if (field === 'note') {
              reminder.note = value;
            }
            updateReminder(reminder.id, reminder);
          }
        }}
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
              labelRowsPerPage: 'عدد التذكيرات في الصفحة',
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
      />
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={() => setOpenDeleteDialog(false)}
        handleDelete={handleDelete}
      />
      <Popover
        open={openAddReminderPopup}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={() => setOpenAddReminderPopup(false)}
      >
        <ReminderForm open={openAddReminderPopup} onClose={() => setOpenAddReminderPopup(false)} onSubmit={handleReminderCreated} />
      </Popover>
    </Box>
  );
};

export default RemindersList;
