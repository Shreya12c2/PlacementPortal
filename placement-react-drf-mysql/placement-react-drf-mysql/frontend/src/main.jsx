import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Companies from "./pages/Companies.jsx";
import Login from "./pages/Login.jsx";
const qc = new QueryClient();
const Frame = ({children}) => (<div style={{padding:16}}>
  <nav style={{display:'flex', gap:12, marginBottom:12}}>
    <Link to="/">Companies</Link>
    <Link to="/login">Login</Link>
  </nav><hr/>{children}</div>);
const router = createBrowserRouter([
  { path:"/", element:<Frame><Companies/></Frame> },
  { path:"/login", element:<Frame><Login/></Frame> },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider></React.StrictMode>
);
