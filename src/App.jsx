import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Create from './components/Create'
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },{
      path: "/create",
      element: <Create/>
    }
  ])

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
