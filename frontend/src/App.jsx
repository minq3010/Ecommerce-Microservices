import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminCartsPage from "./pages/AdminCartsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminPromotionsPage from "./pages/AdminPromotionsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import PaymentHistory from "./pages/PaymentHistory";
import { login, logout, verificationCompleted } from "./redux/slices/authSlice";
import { verificationClient } from "./redux/apiClient";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isVerified } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsInitialized(true);
        return;
      }
      if (isAuthenticated && isVerified) {
        setIsInitialized(true);
        return;
      }

      try {
        console.log("🔄 App.jsx: Calling /users/me to verify token...");
        const response = await verificationClient.get("/users/me");

        if (response.data && response.data.data) {
          const user = response.data.data;
          dispatch(login({ user, token }));
        } else {
          throw new Error("Invalid token response");
        }
      } catch (error) {
        console.error("❌ App.jsx: Token verification failed:", error.message);
        dispatch(logout());
      } finally {
        setIsInitialized(true);
        dispatch(verificationCompleted());
      }
    };

    verifyToken();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} />}
        />
        <Route
          path="/admin/products"
          element={<ProtectedRoute element={<AdminProductsPage />} />}
        />
        <Route
          path="/admin/orders"
          element={<ProtectedRoute element={<AdminOrdersPage />} />}
        />
        <Route
          path="/admin/carts"
          element={<ProtectedRoute element={<AdminCartsPage />} />}
        />
        <Route
          path="/admin/payments"
          element={<ProtectedRoute element={<AdminPaymentsPage />} />}
        />
        <Route
          path="/admin/categories"
          element={<ProtectedRoute element={<AdminCategoriesPage />} />}
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              element={<AdminUsersPage />}
              requiredRoles={["ADMIN"]}
            />
          }
        />
        <Route
          path="/admin/promotions"
          element={<ProtectedRoute element={<AdminPromotionsPage />} />}
        />
        <Route
          path="/admin/reports"
          element={<ProtectedRoute element={<AdminReportsPage />} />}
        />
        <Route
          path="/admin/blog"
          element={<ProtectedRoute element={<AdminBlogPage />} />}
        />
        <Route
          path="/admin/settings"
          element={<ProtectedRoute element={<AdminSettingsPage />} />}
        />
        <Route
          path="/payments/history"
          element={<ProtectedRoute element={<PaymentHistory />} />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
