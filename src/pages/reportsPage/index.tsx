import { useState } from "react";
import { Box, Typography, List, ListItemButton, ListItemText, Paper, Divider } from "@mui/material";
import OverdueUsers from "./components/OverdueUsers";

interface Report {
    id: string;
    name: string;
    component?: React.ReactNode;
}

const reports: Report[] = [
    {
        id: 'overdue-users',
        name: 'الأشخاص المتخلفين عن الدفع',
        component: <OverdueUsers />
    },
    {
        id: 'monthly-summary',
        name: 'ملخص شهري للحسابات',
    },
    {
        id: 'checks-status',
        name: 'تقرير حالة الشيكات',
    },
    {
        id: 'top-customers',
        name: 'أكثر العملاء نشاطاً',
    },
    {
        id: 'payment-trends',
        name: 'اتجاهات الدفع الشهرية',
    }
];

const ReportsPage = () => {
    const [selectedReport, setSelectedReport] = useState<string>('overdue-users');

    const getCurrentReport = () => {
        const report = reports.find(r => r.id === selectedReport);
        if (report?.component) {
            return report.component;
        }
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                    هذا التقرير قيد التطوير
                </Typography>
            </Box>
        );
    };

    return (
        <Box sx={{ m: "20px", height: 'calc(100vh - 100px)', width: 'calc(100vw - 40px)' }}>
            {/* <Typography variant="h5" sx={{ mb: 3 }}>
                التقارير
            </Typography>
             */}
            <Box sx={{ display: 'flex', gap: 2, height: 'calc(100% - 60px)' }}>
                {/* قائمة التقارير الجانبية */}
                <Paper 
                    elevation={2} 
                    sx={{ 
                        width: 280, 
                        minWidth: 280,
                        height: '100%',
                        overflow: 'auto',
                        py: 3
                    }}
                >
                    <Box sx={{ p: 2, backgroundColor: '#4caf5040' }}>
                        <Typography variant="h6" fontWeight={600}>
                            التقارير المتاحة
                        </Typography>
                    </Box>
                    <Divider />
                    <List component="nav">
                        {reports.map((report) => (
                            <ListItemButton
                                key={report.id}
                                selected={selectedReport === report.id}
                                onClick={() => setSelectedReport(report.id)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: '#4caf5030',
                                        borderRight: '4px solid #4caf50',
                                        '&:hover': {
                                            backgroundColor: '#4caf5040',
                                        }
                                    },
                                    py: 1.5,
                                }}
                            >
                                <ListItemText 
                                    primary={report.name}
                                    primaryTypographyProps={{
                                        fontWeight: selectedReport === report.id ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>

                {/* منطقة عرض التقرير */}
                <Paper 
                    elevation={2} 
                    sx={{ 
                        flexGrow: 1,
                        p: 3,
                        height: '100%',
                        overflow: 'auto'
                    }}
                >
                    {getCurrentReport()}
                </Paper>
            </Box>
        </Box>
    );
};

export default ReportsPage;
