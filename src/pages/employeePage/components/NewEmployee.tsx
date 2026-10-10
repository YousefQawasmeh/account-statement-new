import {
  Box,
  Button,
  Card,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { registerEmployee } from "../../../apis/employee.ts";

const styles = {
  flex: {
    display: "flex",
    alignItems: "center",
    my: "10px",
    "& p": {
      minWidth: "120px",
    },
  },
};

const NewEmployee = ({ onEmployeeCreated }: { onEmployeeCreated: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!username || !password || !role) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await registerEmployee({ username, password, role });
      setSuccess(true);
      setUsername("");
      setPassword("");
      setRole("viewer");
      onEmployeeCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || "فشل إنشاء الحساب");
    }
  };

  return (
    <Card sx={{ maxWidth: "500px", bgcolor: "#f9f9f9", padding: "30px" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        إنشاء حساب جديد
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={styles.flex}>
          <Typography variant="body1">اسم المستخدم:</Typography>
          <TextField
            size="small"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
        </Box>
        <Box sx={styles.flex}>
          <Typography variant="body1">كلمة المرور:</Typography>
          <TextField
            size="small"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Box sx={styles.flex}>
          <Typography variant="body1">الصلاحية:</Typography>
          <TextField
            select
            size="small"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="admin">مدير (Admin)</MenuItem>
            <MenuItem value="editor">محرر (Editor)</MenuItem>
            <MenuItem value="viewer">مشاهد (Viewer)</MenuItem>
          </TextField>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>تم إنشاء الحساب بنجاح</Alert>}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
        >
          إنشاء الحساب
        </Button>
      </Box>
    </Card>
  );
};

export default NewEmployee;
