import Home from "./components/home";
import Users from "./components/users";
import { green, purple } from '@mui/material/colors';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
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
  {
    path: "/",
    element: <Home />,
    // element: <Home />,
    // errorElement: <div>Error!</div>,
    // loader: () => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve("Hello World!000000000000")
    //     }, 2000)
    //   })
    // },
    // children: [
    //   {
    //     path: "/home",
    //     // element: <Home />,
    //     element: <p>0000000</p>,
    //     // children: [
    //     //   {
    //     //     path: "/about/team",
    //     //     element: <div>Team!</div>,
    //     //   }
    //     // ]
    //   },
    //   {
    //     path: "/users",
    //     element: <p>0000000</p>,
    //     // element: <Users />,
    //     // children: [
    //     //   {
    //     //     path: "/about/team",
    //     //     element: <div>Team!</div>,
    //     //   }
    //     // ]
    //   }
    // ]
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/records",
    element: <p>000 records 000</p>,
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
    element: <div>Error!</div>,
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
