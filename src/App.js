import "./App.css";
import { Home, EditTask, Profile, Signin, Signup } from "./pages/index";
import RootLayout from "./layouts/RootLayout";

import ThemeContext from "./context/ThemeContext";
import { useContext } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/edit_task/:id" element={<EditTask />} />
        <Route path="profile" element={<Profile />} />
        <Route path="signin?" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="*" element={<h1>error</h1>} />
    </>
  )
);

function App() {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`App ${theme}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
