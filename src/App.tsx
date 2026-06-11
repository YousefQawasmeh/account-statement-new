import { green, purple } from '@mui/material/colors';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { HomePage, UsersPage, RecordsPage, ChecksPage, RemindersPage, ReportsPage, LoginPage } from "./pages";
import './App.css'
import { Box, styled, Typography, Button } from '@mui/material';
import { useAuthStore } from "./store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

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
  width: 100%;
  max-width: 1200px;
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

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/account-statement-new/login" replace />;
};

const Layout = () => {
  return (
    <Box
      sx={{
        minWidth: "calc(100vw - 64px)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Menu />
      <Outlet />
    </Box>
  );
};

const router = createBrowserRouter([
  {
    path: "/account-statement-new/login",
    element: <LoginPage />,
  },
  {
    path: "/account-statement-new/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <h1>Home Page</h1>,
      },

    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/account-statement-new/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "checks",
            element: <ChecksPage />,
          },
          {
            path: "reminders",
            element: <RemindersPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "records",
            element: <RecordsPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/usersTypes",
    element: <p>000 usersTypes 000</p>,
  },
  {
    path: "/recordsTypes",
    element: <p>000 recordsTypes 000</p>,
  },
  {
    path: "*",
    element: (
      <div>
        <div>Error! 404</div>

        <Link
          style={{ display: "flex", fontSize: "24px" }}
          to="/account-statement-new/"
        >
          الصفحة الرئيسية
        </Link>
      </div>
    ),
  },
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
