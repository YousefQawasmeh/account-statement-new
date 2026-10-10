import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getEmployees, updateEmployee, deleteEmployee } from "../../../apis/employee.ts";
enum EmployeeRole {
    ADMIN = "admin",
    EDITOR = "editor",
    VIEWER = "viewer",
}
interface Employee {
  id: string;
  username: string;
  role: EmployeeRole;
  active: boolean;
  createdAt: string;
}

const EmployeesList: any = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editRole, setEditRole] = useState<EmployeeRole>(EmployeeRole.VIEWER);
  const [editPassword, setEditPassword] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل تحميل قائمة الموظفين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id);
        fetchEmployees();
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "فشل حذف الحساب");
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setEditUsername(employee.username);
    setEditRole(employee.role);
    setEditPassword(""); // Password should not be pre-filled for security reasons
    setEditDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (employeeToEdit) {
      try {
        const updateData: { username?: string; role?: EmployeeRole; password?: string } = {};
        if (editUsername !== employeeToEdit.username) {
          updateData.username = editUsername;
        }
        if (editRole !== employeeToEdit.role) {
          updateData.role = editRole;
        }
        if (editPassword) {
          updateData.password = editPassword;
        }

        await updateEmployee(employeeToEdit.id, updateData);
        fetchEmployees();
        setEditDialogOpen(false);
        setEmployeeToEdit(null);
        setEditPassword("");
      } catch (err: any) {
        setError(err.response?.data?.message || "فشل تحديث بيانات الموظف");
      }
    }
  };

  if (loading) {
    return <Typography>جاري تحميل قائمة الموظفين...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        قائمة الموظفين
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>اسم المستخدم</TableCell>
              <TableCell>الصلاحية</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تاريخ الإنشاء</TableCell>
              <TableCell align="right">إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.active ? "نشط" : "غير نشط"}</TableCell>
                <TableCell>{new Date(employee.createdAt).toLocaleDateString("ar-EG")}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(employee)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"تأكيد الحذف"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            هل أنت متأكد أنك تريد حذف الحساب "{employeeToDelete?.username}"؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>تعديل الحساب</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            margin="dense"
            label="اسم المستخدم"
            type="text"
            fullWidth
            variant="outlined"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="كلمة المرور الجديدة (اتركها فارغة لعدم التغيير)"
            type="password"
            fullWidth
            variant="outlined"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="الصلاحية"
            select
            fullWidth
            variant="outlined"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value as EmployeeRole)}
          >
            {Object.values(EmployeeRole).map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption === EmployeeRole.ADMIN && "مدير"}
                {roleOption === EmployeeRole.EDITOR && "محرر"}
                {roleOption === EmployeeRole.VIEWER && "مشاهد"}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleConfirmEdit} color="primary">
            حفظ التغييرات
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmployeesList;
