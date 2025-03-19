import { green, purple } from '@mui/material/colors';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { HomePage, UsersPage, RecordsPage, ChecksPage, RemindersPage } from "./pages";
import { Link } from "react-router-dom";
import './App.css'
import { Box, styled, Typography } from '@mui/material';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
  direction: 'rtl',
  typography: {
    fontFamily: 'Almarai, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Almarai';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap') format('woff2');
          unicodeRange: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F-2053, U+2E41, U+FB1D-FB4F;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          ":focus": {
            outline: "none",
          },
        },
        contained: {
          color: "white",
        }
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          ":focus": {
            outline: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          color: 'white',
          border: "solid"
        },
        label: {
          paddingRight: "11px",
          paddingLeft: "11px",
        },
      },
    },
  },
});

const NavWrapper = styled(Box)`
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  font-size: 16px;
  margin: 0 10px;
  text-decoration: none;
  color: #000;
  font-weight: 500;

  &:hover {
    color: #1976d2;
  }

  &.active {
    color: #1976d2;
    font-weight: 600;
  }
`;

const Menu = ()=><NavWrapper>
<Typography variant="h5">
  <NavLink to="/account-statement-new/" className={window.location.pathname === "/account-statement-new/" ? "active" : ""}>
    {"الصفحة الرئيسية"}
  </NavLink>
  <NavLink to="/account-statement-new/users" className={window.location.pathname === "/account-statement-new/users" ? "active" : ""}>
    {" البطاقات "}
  </NavLink>
  <NavLink to="/account-statement-new/records" className={window.location.pathname === "/account-statement-new/records" ? "active" : ""}>
    {" السجلات "}
  </NavLink>
  <NavLink to="/account-statement-new/checks" className={window.location.pathname === "/account-statement-new/checks" ? "active" : ""}>
    {" الشيكات "}
  </NavLink>
  <NavLink to="/account-statement-new/reminders" className={window.location.pathname === "/account-statement-new/reminders" ? "active" : ""}>
    {" التذكيرات "}
  </NavLink>
</Typography>
</NavWrapper>

const PageWithMenu = (page: JSX.Element) => {
  return (
    <Box sx={{ minWidth: "calc(100vw - 64px)", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Menu />
      {page}
    </Box>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: PageWithMenu(<HomePage />),
  },
  {
    path: "/users",
    element: PageWithMenu(<UsersPage />),
  },
  {
    path: "/records",
    element: PageWithMenu(<RecordsPage />),
  },
  {
    path: "/checks",
    element: PageWithMenu(<ChecksPage />),
  },
  {
    path: "/reminders",
    element: PageWithMenu(<RemindersPage />),
  },
  {
    path: "/account-statement-new/",
    element: PageWithMenu(<HomePage />),
  },
  {
    path: "/account-statement-new/users",
    element: PageWithMenu(<UsersPage />),
  },
  {
    path: "/account-statement-new/records",
    element: PageWithMenu(<RecordsPage />),
  },
  {
    path: "/account-statement-new/checks",
    element: PageWithMenu(<ChecksPage />),
  },
  {
    path: "/account-statement-new/reminders",
    element: PageWithMenu(<RemindersPage />),
  },
  {
    path: "/usersTypes",
    element: <p>000 usersTypes 000 </p>
  },
  {
    path: "/recordsTypes",
    element: <p>000 recordsTypes 000</p>
  },
  {
    path: "*",
    element: 
    <div>
    <div>Error! 404</div>
    <Link style={{ display: "flex", fontSize: "14px" }} to="/account-statement-new/">
        الصفحة الرئيسية
        </Link>
    </div>
    ,
  }
]);

function App() {

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
