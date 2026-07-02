import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import WelcomePage from "./pages/WelcomePage";
import SearchPage from "./pages/Search";
import DogsPage from "./pages/DogsPage";
import UserPage from "./pages/UserPage";
import Messages from "./pages/Messages";

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
        <Route path="/dogs/:dogId" element={<DogsPage />} />
        <Route path="/messages" element={<Messages />} />
      </Route>
    </Routes>
  );
}
