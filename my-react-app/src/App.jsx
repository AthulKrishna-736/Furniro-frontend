import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './redux/store'
import LoginPage from './pages/user/LoginPage'
import SignUpPage from './pages/user/SignUpPage'
import Home from './pages/user/Home'
import ProtectedRoute from './pages/protectRoutes/ProtectedRoute'
import AuthProtect from './pages/protectRoutes/AuthProtect'
import AdminLogin from './pages/admin/AdminLogin'
import AuthAdmin from './pages/protectRoutes/AuthAdmin'
import AdminDash from './pages/admin/AdminDash'
import ProductPage from './pages/admin/ProductPage'
import CategoryPage from './pages/admin/CategoryPage'
import UserListPage from './pages/admin/UserListPage'
import ProductDetailPage from './pages/user/ProductDetailPage'
import ProductsPageUser from './pages/user/ProductsPageUser'
import AdminBanner from './pages/admin/AdminBanner'
import LandingPage from './pages/user/LandingPage'
import ForgotPassPage from './pages/user/ForogotPassPage'
import WebSocketHandler from './utils/webSockets/WebSocketHandler'

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENTID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
      <WebSocketHandler />
    <Router>
      <Routes>

      <Route path='/' element={<LandingPage/>} />
      <Route path='/products' element={ <ProductsPageUser/>  } />
      <Route path='/product-detail/:productId' element={<ProductDetailPage/>} />
      <Route path='forgot-password' element={<ForgotPassPage/>} />

      <Route path='/login' element={<AuthProtect> <LoginPage /> </AuthProtect>} />
      <Route path='/signup' element={<AuthProtect> <SignUpPage /> </AuthProtect>} />

      <Route path='/home' element={
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
        } />
          
        <Route path='/admin-login' element={
          <AuthAdmin>
            <AdminLogin/>
          </AuthAdmin>
        } />

        <Route path='/admin-dashboard' element={
          <AdminDash/>
        } />

        <Route path='/admin-products' element={
          <ProductPage/>
        } />

        <Route path='/admin-categories' element={
          <CategoryPage/>
        } />

        <Route path='/admin-users' element={
          <UserListPage/>
        } />

        <Route path='/admin-banners' element={
          <AdminBanner/>
        } />
        
      </Routes>
    </Router>
    </Provider>
  </GoogleOAuthProvider>
  )
}

export default App;