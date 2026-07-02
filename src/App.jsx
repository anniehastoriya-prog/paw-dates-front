import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import WelcomePage from "./pages/WelcomePage";
import SearchPage from "./pages/Search";
import DogPage from "./pages/DogPage";
import UserPage from "./pages/UserPage";
import Messages from "./pages/Messages";

/** Import the new user profile page*/
import UserPage from "./pages/UserPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/dogs/:dogId" element={<DogPage />} />
        <Route path="/messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}
