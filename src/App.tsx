import { green, purple } from '@mui/material/colors';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { HomePage, UsersPage, RecordsPage, ChecksPage } from "./pages";
import { Link } from "react-router-dom";
import './App.css'

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
});

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <HomePage />,
  //   // element: <Home />,
  //   // errorElement: <div>Error!</div>,
  //   // loader: () => {
  //   //   return new Promise((resolve) => {
  //   //     setTimeout(() => {
  //   //       resolve("Hello World!000000000000")
  //   //     }, 2000)
  //   //   })
  //   // },
  //   // children: [
  //   //   {
  //   //     path: "/home",
  //   //     // element: <Home />,
  //   //     element: <p>0000000</p>,
  //   //     // children: [
  //   //     //   {
  //   //     //     path: "/about/team",
  //   //     //     element: <div>Team!</div>,
  //   //     //   }
  //   //     // ]
  //   //   },
  //   //   {
  //   //     path: "/users",
  //   //     element: <p>0000000</p>,
  //   //     // element: <Users />,
  //   //     // children: [
  //   //     //   {
  //   //     //     path: "/about/team",
  //   //     //     element: <div>Team!</div>,
  //   //     //   }
  //   //     // ]
  //   //   }
  //   // ]
  // },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/records",
    element: <RecordsPage />,
  },
  {
    path: "/checks",
    element: <ChecksPage />,
  },
  // {
  //   path: "/users/new",
  //   element: <Users />,
  // },
  // {
  //   path: "/users/list",
  //   element: <UsersList />,
  // },
  {
    path: "/account-statement-new/",
    element: <HomePage />,
  },
  {
    path: "/account-statement-new/home",
    element: <HomePage />,
  },
  {
    path: "/account-statement-new/users",
    element: <UsersPage />,
  },
  // {
  //   path: "/account-statement-new/users/new",
  //   element: <Users />,
  // },
  // {
  //   path: "/account-statement-new/users/list",
  //   element: <UsersList />,
  // },
  {
    path: "/account-statement-new/records",
    element: <RecordsPage />,
  },
  {
    path: "/account-statement-new/checks",
    element: <ChecksPage />,
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
