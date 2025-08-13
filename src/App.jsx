import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Editor from './components/Editor/Editor'
function App() {
 // React Router For Routing to different routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },{
      path: "/editor",
      element: <Editor/>
    }
  ])

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
