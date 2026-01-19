import { BrowserRouter, Routes, Route } from 'react-router';
import ChatAppPage from './pages/ChatAppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './stores/useThemeStore';
import { useEffect } from 'react';

const App = () => {

  const { isDark, setTheme } = useThemeStore();

  // Load theme dark mode
  useEffect(() => {
    setTheme(isDark);
  }, [isDark])

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* private routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App