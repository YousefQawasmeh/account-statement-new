import HomePage from "./components/homePage";
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
    element: <HomePage />,
    errorElement: <div>Error!</div>,
    // loader: () => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve("Hello World!000000000000")
    //     }, 2000)
    //   })
    // },
    // children: [
    //   {
    //     path: "/about",
    //     element: <div>About!</div>,
    //     children: [
    //       {
    //         path: "/about/team",
    //         element: <div>Team!</div>,
    //       }
    //     ]
    //   }
    // ]
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
