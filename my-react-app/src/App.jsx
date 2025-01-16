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
import UserProfile from './pages/user/userProfile/userProfile'
import UserAddressPage from './pages/user/userProfile/UserAddressPage'
import UserCartPage from './pages/user/userProfile/UserCartPage'
import OrdersPage from './pages/admin/OrdersPage'
import UserAccountPage from './pages/user/userProfile/UserAccountPage'
import UserCheckoutPage from './pages/user/userProfile/UserCheckoutPage'
import UserOrdersPage from './pages/user/userProfile/UserOrdersPage'
import UserWishlistPage from './pages/user/userProfile/UserWishlistPage'
import UserWalletPage from './pages/user/userProfile/UserWalletPage'
import AdminCoupon from './pages/admin/AdminCoupon'
import CatOfferPage from './pages/admin/CatOfferPage'
import ScrollToTop from './utils/ScrollControl'
import SalesReportPage from './pages/admin/SalesReportPage'
import ProtectAdmin from './pages/protectRoutes/ProtectAdmin'

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENTID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
    <Router>
      <ScrollToTop />
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

      <Route path='/account' element={
        <ProtectedRoute>
          <UserProfile/>
        </ProtectedRoute>
        } />

      <Route path='/profile' element={
        <ProtectedRoute>
          <UserAccountPage />
        </ProtectedRoute>
        } />

      <Route path='/address' element={
        <ProtectedRoute>
          <UserAddressPage />
        </ProtectedRoute>
        } />

      <Route path='/cart' element={
        <ProtectedRoute>
          <UserCartPage />
        </ProtectedRoute>
        } />

      <Route path='/checkout' element={
        <ProtectedRoute>
          <UserCheckoutPage />
        </ProtectedRoute>
        } />

      <Route path='/orders' element={
        <ProtectedRoute>
          <UserOrdersPage />
        </ProtectedRoute>
        } />

      <Route path='/wishlist' element={
        <ProtectedRoute>
          <UserWishlistPage />
        </ProtectedRoute>
        } />

      <Route path='/wallet' element={
        <ProtectedRoute>
          <UserWalletPage />
        </ProtectedRoute>
        } />

        <Route path='/admin-login' element={
          <AuthAdmin>
            <AdminLogin/>
          </AuthAdmin>
        } />

        <Route path='/admin-dashboard' element={
          <ProtectAdmin>
            <AdminDash/>
          </ProtectAdmin>
        } />

        <Route path='/admin-products' element={
          <ProtectAdmin>
            <ProductPage/>
          </ProtectAdmin>
        } />

        <Route path='/admin-categories' element={
          <ProtectAdmin>
            <CategoryPage/>
          </ProtectAdmin>
        } />

        <Route path='/admin-users' element={
          <ProtectAdmin>
            <UserListPage/>
          </ProtectAdmin>
        } />

        <Route path='/admin-banners' element={
          <ProtectAdmin>
            <AdminBanner/>
          </ProtectAdmin>
        } />

        <Route path='/admin-orders' element={
          <ProtectAdmin>
            <OrdersPage/>
          </ProtectAdmin>
        } />

        <Route path='/admin-coupons' element={
          <ProtectAdmin>
            <AdminCoupon />
          </ProtectAdmin>
        } />

        <Route path='/admin-offers' element={
          <ProtectAdmin>
            <CatOfferPage />
          </ProtectAdmin>
        } />       

        <Route path='/admin-sales-report' element={
          <ProtectAdmin>
            <SalesReportPage />
          </ProtectAdmin>
        } />      

      </Routes>
    </Router>
    </Provider>
  </GoogleOAuthProvider>
  )
}

export default App;