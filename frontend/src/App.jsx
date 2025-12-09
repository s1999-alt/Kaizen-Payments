import AppRouter from "./router/AppRouter.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
