import Header from "./components/pages/Header";
import "./App.css";
import { Outlet, Route, Routes } from "react-router";
import RateGame from "./components/pages/RateGame";
import LoginPage from "./components/auth/LoginPage";
import Home from "./components/pages/Home";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center w-full h-full bg-gray-400 px-8 py-4">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
<<<<<<< Updated upstream
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="/game/:id" element={<RateGame />}></Route>
        <Route path="/Login" element={<LoginPage />}></Route>
      </Route>
    </Routes>
=======
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="game/:id" element={<RateGame />}></Route>
          <Route path="login" element={<LoginPage />}></Route>
        </Route>
      </Routes>
    </AuthProvider>
>>>>>>> Stashed changes
  );
}

export default App;
