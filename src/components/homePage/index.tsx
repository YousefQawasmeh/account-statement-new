import { Box, Button, Grid, TextField, Typography } from '@mui/material';
// import homePageStyles from "./index.style.ts"
const classes = {
    flex: {
        display: 'flex',
        alignItems: 'center',
        my: "6px",
        "& p": {
            minWidth: "70px",
        }
    }
}
const HomePage = () => {

    return (
        <Grid>
            <Box sx={classes.flex} >
                <Typography variant="body1" sx={{ mr: "8px" }}> رقم الزبون : </Typography>
                <TextField size='small' fullWidth label="... رقم الزبون" type="search" />
            </Box>
            <Box sx={{ ...classes.flex, flexWrap: "wrap" }}>
                <Box sx={{ ...classes.flex, width: "50%" }} >
                    <Typography variant="body1" sx={{ mr: "8px" }}> اسم الزبون : </Typography>
                    <TextField size='small' fullWidth label="اسم الزبون" />
                </Box>
                <Box sx={{ ...classes.flex, width: "50%" }} >
                    <Typography variant="body1" sx={{ mr: "8px" }}> رقم التلفون : </Typography>
                    <TextField size='small' fullWidth label="رقم التلفون" />
                </Box>
                <Box sx={{ ...classes.flex, width: "50%" }} >
                    <Typography variant="body1" sx={{ mr: "8px" }}> المجموع : </Typography>
                    <TextField size='small' fullWidth label="المجموع" />
                </Box>
                <Box sx={{ ...classes.flex, width: "50%" }} >
                    <Typography variant="body1" sx={{ mr: "8px" }}> ملاحظات : </Typography>
                    <TextField size='small' fullWidth label="ملاحظات" />
                </Box>
            </Box>
            <Box sx={{ ...classes.flex, justifyContent: "space-between" }} >
                <Button variant="contained" color="primary" >مبيعات اليوم</Button>
                <Button variant="contained" color="secondary" >عملية جديدة</Button>
                <Button variant="outlined" >كشف حساب</Button>
                <Button variant="text" >من: </Button>
                <Button variant="text" >الى:</Button>
            </Box>
        </Grid>
    )
}
export default HomePage