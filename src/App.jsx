import Header from "./components/Header";
import "./App.css";
import { Outlet, Route, Routes } from "react-router";
import RateGame from "./components/RateGame";

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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"></Route>
        <Route path="/game/:id" element={<RateGame />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
