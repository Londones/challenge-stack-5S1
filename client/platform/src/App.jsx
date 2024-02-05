import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { LoadScript } from "@react-google-maps/api";
import PrestataireRegister from "./pages/PrestataireRegister";
import PlatformLayout from "./layouts/PlatformLayout";
import Home from "./pages/Home";
import { PageEtablissement } from "./pages/PageEtablissement";
import Reservation from "./pages/Reservation";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./pages/UserProfile";
import { AppProvider } from "./context";
import UserInformations from "./components/UserInformations";
import resourcesLoaded from "./i18n";
import ContentLoader from "react-content-loader";
import React, { useState, useEffect } from "react";

const routes = [
  {
    path: "/",
    element: <PlatformLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "prestataire-register", element: <PrestataireRegister /> },
      { path: "etablissement/:id", element: <PageEtablissement /> },
      { path: "/reservation", element: <Reservation /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourcesLoaded.then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <ContentLoader
        speed={2}
        width={"100%"}
        height="100vh"
        backgroundColor="#c4c4c4"
        foregroundColor="#ececec"
      >
        <rect x="25%" y="300" rx="2" ry="2" width="800" height="100" />
        <rect x="0" y="0" rx="2" ry="2" width="100%" height="50" />
      </ContentLoader>
    );
  }

  return (
    <>
      <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </LoadScript>
    </>
  );
}

export default App;
