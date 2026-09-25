import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers from shared
import { AuthProvider } from '@shared/context/AuthContext';
import { CartProvider } from '@shared/context/CartContext';
import { MenuProvider } from '@shared/context/MenuContext';
import { OrderProvider } from '@shared/context/OrderContext';
import { ThemeProvider } from '@shared/context/ThemeContext';
import { MusicProvider } from '@shared/context/MusicContext';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { RouteGuard } from '@shared/components/RouteGuard';
import { TronxCursor } from '@shared/components/CraftslandCursor';

// Customer Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AskAuraDrawer } from './components/AskAuraDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DishDetailPage } from './pages/DishDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ReservationPage } from './pages/ReservationPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { EventsPage } from './pages/EventsPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <MenuProvider>
            <OrderProvider>
              <ThemeProvider>
                <MusicProvider>
                  <TronxCursor />
                  <Router>
                    <div className="flex flex-col min-h-screen bg-[#FFF5EC] text-[#241416]">
                      <Navbar onOpenCart={() => setCartDrawerOpen(true)} />
                      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
                      <AskAuraDrawer />

                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/menu" element={<MenuPage />} />
                        <Route path="/menu/:category" element={<MenuPage />} />
                        <Route path="/menu/item/:id" element={<DishDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order/:id" element={<OrderStatusPage />} />
                        <Route path="/reservation" element={<ReservationPage />} />
                        <Route path="/reservations" element={<ReservationPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route
                          path="/account"
                          element={
                            <RouteGuard
                              allowedRoles={['CUSTOMER', 'ADMIN', 'SUPER_ADMIN']}
                              appName="Customer Concierge Portal"
                              loginPath="/login"
                            >
                              <AccountPage />
                            </RouteGuard>
                          }
                        />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>

                    <Footer />
                  </div>
                </Router>
                </MusicProvider>
              </ThemeProvider>
            </OrderProvider>
          </MenuProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
