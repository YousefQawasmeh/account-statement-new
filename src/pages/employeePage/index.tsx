import React, { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import NewEmployee from "./components/NewEmployee.tsx";
import EmployeesList from "./components/EmployeesList.tsx.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";

const EmployeesPage: React.FC = () => {
  const [openNewEmployeePopup, setOpenNewEmployeePopup] = useState(false);
  const [refreshListTrigger, setRefreshListTrigger] = useState(0);
  const employee = useAuthStore((state) => state.employee);

  const handleEmployeeCreated = () => {
    setOpenNewEmployeePopup(false);
    setRefreshListTrigger((prev) => prev + 1);
  };

  if (employee?.role !== "admin") {
    return (
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          ليس لديك الصلاحية للوصول إلى هذه الصفحة.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ m: "20px", display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5">إدارة الحسابات</Typography>
        <Button variant="contained" onClick={() => setOpenNewEmployeePopup(true)}>
          إنشاء حساب جديد
        </Button>
      </Box>
      <EmployeesList refreshTrigger={refreshListTrigger} />

      <Popover
        open={openNewEmployeePopup}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onClose={() => setOpenNewEmployeePopup(false)}
      >
        <NewEmployee onEmployeeCreated={handleEmployeeCreated} />
      </Popover>
    </Box>
  );
};

export default EmployeesPage;
