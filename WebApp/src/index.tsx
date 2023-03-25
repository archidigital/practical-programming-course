import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JobsPage from "./pages/jobs/JobsPage";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import LivemapPage from "./pages/livemap/LivemapPage";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/jobs/:jobID",
        element: <JobDetailPage />,
      },
      {
        path: "/livemap",
        element: <LivemapPage />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
