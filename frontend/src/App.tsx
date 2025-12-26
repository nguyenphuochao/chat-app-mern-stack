import { BrowserRouter, Routes, Route } from 'react-router';
import ChatAppPage from './pages/ChatAppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Toaster } from 'sonner'

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* private routes */}
          <Route path="/" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App