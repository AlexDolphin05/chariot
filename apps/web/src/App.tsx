import { Route, Routes } from "react-router-dom";
import { AppShell } from "./shell/AppShell";

/**
 * 第一阶段只有一个壳路由。
 * 预留 React Router 是为了后续加 /settings、深链到某个 workspace 等。
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
    </Routes>
  );
}
