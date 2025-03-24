import './App.css'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import MainPage from './views/MainPage'
import CreditPage from './views/CreditPage'
import SignOut from './views/SignOut'
import EditPage from './views/EditPage'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import { CookiesProvider } from 'react-cookie'

function App() {

  return (
      <Router>
        <CookiesProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path='/credit' element={<CreditPage />} />
          <Route path='/signout' element={<SignOut />} />
          <Route path="/activities/:id" element={<EditPage />} />
        </Routes>
        </CookiesProvider>
      </Router>
  )
}

export default App
