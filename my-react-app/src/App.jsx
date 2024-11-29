import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import LoginPage from './pages/user/LoginPage'
import SignUpPage from './pages/user/SignUpPage'
import OtpPage from './pages/user/OtpPage'
import Home from './pages/user/Home'
import ProtectedRoute from './pages/protectRoutes/ProtectedRoute'
import AuthProtect from './pages/protectRoutes/AuthProtect'
import store from './redux/store'
import AdminLogin from './pages/admin/AdminLogin'
import AuthAdmin from './pages/protectRoutes/AuthAdmin'
import AdminDash from './pages/admin/AdminDash'
import ProductPage from './pages/admin/ProductPage'
import CategoryPage from './pages/admin/CategoryPage'
import UserListPage from './pages/admin/UserListPage'
import ProductDetailPage from './pages/user/ProductDetailPage'
import ProductsPageUser from './pages/user/ProductsPageUser'
import GoogleOAuthStart from './components/auth/GoogleAuth'
import GoogleOAuthCallback from './components/auth/GoogleCallback'
import GoogleRedirect from './components/auth/GoogleRedirect'
import ProtectGoogle from './pages/protectRoutes/ProtectGoogle'


const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>

      <Route path='/login' element={<AuthProtect> <LoginPage /> </AuthProtect>} />
      <Route path='/signup' element={<AuthProtect> <SignUpPage /> </AuthProtect>} />
      <Route path='/otpverify' element={<AuthProtect> <OtpPage /> </AuthProtect>} />
      <Route path="/oauth/start" element={<ProtectGoogle> <GoogleOAuthStart /> </ProtectGoogle>} />
      <Route path="/oauth/callback" element={<ProtectGoogle> <GoogleOAuthCallback /> </ProtectGoogle>} />
      <Route path='/google-success' element={ <ProtectGoogle> <GoogleRedirect/> </ProtectGoogle> } />

        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
          } />

      <Route path='/products' element={
            <ProtectedRoute>
             <ProductsPageUser/>
            </ProtectedRoute>
          } />
          
      <Route path='/product-detail/:productId' element={
          <ProtectedRoute>
            <ProductDetailPage/>
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
        
      </Routes>
    </Router>
    </Provider>
  )
}

export default App;