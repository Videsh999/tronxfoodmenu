import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers from shared
import { AuthProvider } from '@shared/context/AuthContext';
import { OrderProvider } from '@shared/context/OrderContext';
import { MenuProvider } from '@shared/context/MenuContext';
import { ThemeProvider } from '@shared/context/ThemeContext';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { RouteGuard } from '@shared/components/RouteGuard';
import { TronxCursor } from '@shared/components/CraftslandCursor';

// Admin Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminMenuPage } from './pages/AdminMenuPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminReservationsPage } from './pages/AdminReservationsPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminReviewsPage } from './pages/AdminReviewsPage';
import { AdminOffersPage } from './pages/AdminOffersPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminGalleryPage } from './pages/AdminGalleryPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RouteGuard
    allowedRoles={['ADMIN', 'SUPER_ADMIN']}
    appName="Admin Executive Suite"
    loginPath="/login"
  >
    {children}
  </RouteGuard>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrderProvider>
          <MenuProvider>
            <ThemeProvider>
              <TronxCursor />
              <Router>
                <Routes>
                  <Route path="/login" element={<AdminLoginPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboardPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedAdminRoute>
                        <AdminOrdersPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/menu"
                    element={
                      <ProtectedAdminRoute>
                        <AdminMenuPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCategoriesPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/reservations"
                    element={
                      <ProtectedAdminRoute>
                        <AdminReservationsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCustomersPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/reviews"
                    element={
                      <ProtectedAdminRoute>
                        <AdminReviewsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/offers"
                    element={
                      <ProtectedAdminRoute>
                        <AdminOffersPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/events"
                    element={
                      <ProtectedAdminRoute>
                        <AdminEventsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/gallery"
                    element={
                      <ProtectedAdminRoute>
                        <AdminGalleryPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedAdminRoute>
                        <AdminAnalyticsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedAdminRoute>
                        <AdminSettingsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </ThemeProvider>
          </MenuProvider>
        </OrderProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
