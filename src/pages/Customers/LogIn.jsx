import React, { useEffect, useState } from "react";
import axios from "axios"; // or use fetch if preferred
import API from "../../Classes/clsAPI";
import { useDispatch } from "react-redux";
import { loginSuccessCustomer } from "../../redux/features/auth/authCustomerSlice";
import { clearSearchQuery } from "../../redux/features/search/searchSlice";
import { useNavigate, useLocation } from "react-router-dom"; // Add this for navigation
import { useTranslation } from "react-i18next";

const LogIn = () => {
  const location = useLocation(); // Initialize useLocation
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Combined input for email or phone
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("phone"); // Default to email
  const [userType, setUserType] = useState("customer"); // Default to customer
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this for navigation
  const api = new API();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.state?.email) {
      setLoginMethod("email");
      setEmailOrPhone(location.state.email);
    } else if (location.state?.phone) {
      setLoginMethod("phone");
      setEmailOrPhone(location.state.phone);
    }
    if (location.state?.password) {
      setPassword(location.state.password);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let endpoint;
      if (userType === "customer") {
        endpoint =
          loginMethod === "email"
            ? `${api.baseURL()}/API/Auth/LoginCustomerByEmail`
            : `${api.baseURL()}/API/Auth/LoginCustomerByPhone`;
      } else {
        endpoint =
          loginMethod === "email"
            ? `${api.baseURL()}/API/Auth/LoginEmployeeByEmail`
            : `${api.baseURL()}/API/Auth/LoginEmployeeByPhone`;
      }

      const response = await axios.post(endpoint, {
        [loginMethod === "email" ? "email" : "phone"]: emailOrPhone,
        password: password,
      });

      const { token } = response.data;
      if (token) {
        // Decode the token to get user info (e.g., email or phone)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userIdentifier = decodedToken.sub; // This will be the email or phone

        // Store the token and user info in localStorage
        localStorage.setItem("token", token);

        // Update Redux state
        dispatch(loginSuccessCustomer({ identifier: userIdentifier }));

        console.log(t("login.loginSuccess"), userIdentifier);
        fetchUserData(userIdentifier);

        // Redirect after successful login
        navigate("/"); // Change this to your desired route
      } else {
        setError(t("login.invalidCredentials"));
      }
    } catch (error) {
      setError(t("login.loginFailed"));
      console.error(t("login.loginError"), error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userIdentifier) => {
    try {
      const response = await fetch(
        userType === "customer"
          ? loginMethod === "phone"
            ? `${api.baseURL()}/API/CustomersAPI/GetCustomerByPhone/${userIdentifier}`
            : `${api.baseURL()}/API/CustomersAPI/GetCustomerByEmail/${userIdentifier}`
          : loginMethod === "phone"
          ? `${api.baseURL()}/API/EmployeesAPI/GetEmployeeByPhone/${userIdentifier}`
          : `${api.baseURL()}/API/EmployeesAPI/GetEmployeeByEmail/${userIdentifier}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(t("login.networkError"));
      }
      const data = await response.json();
      dispatch(loginSuccessCustomer({ identifier: data }));
      if (userType === "employee") {
        localStorage.setItem("currentEmployee", JSON.stringify(data));
      } else {
        localStorage.setItem("currentCustomer", JSON.stringify(data));
      }
      dispatch(clearSearchQuery());
      localStorage.setItem("userType", userType);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t("login.signIn")}
        </h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Toggle between Customer and Employee */}
        <div className="mb-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setUserType("customer")}
            className={` mx-4 px-4 py-2 rounded-md font-medium ${
              userType === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("login.customer")}
          </button>
          <button
            type="button"
            onClick={() => setUserType("employee")}
            className={`mx-4 px-4 py-2 rounded-md font-medium ${
              userType === "employee"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("login.employee")}
          </button>
        </div>

        {/* Toggle between Email and Phone */}
        <div className=" mb-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setEmailOrPhone("");
            }}
            className={`mx-4 px-4 py-2 rounded-md font-medium ${
              loginMethod === "email"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("login.email")}
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("phone");
              setEmailOrPhone("");
            }}
            className={`mx-4 px-4 py-2 rounded-md font-medium ${
              loginMethod === "phone"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {t("login.phone")}
          </button>
        </div>

        {/* Input for Email or Phone */}
        <div className="mb-4">
          <label
            htmlFor="emailOrPhone"
            className="block text-sm font-medium text-gray-700"
          >
            {loginMethod === "email" ? t("login.email") : t("login.phone")}
          </label>
          <input
            type={loginMethod === "email" ? "email" : "tel"}
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {t("login.password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? t("login.loggingIn") : t("login.login")}
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t("login.dontHaveAccount")}
            <button
              type="button"
              onClick={() => navigate("/signup")} // Navigate to the sign-up page
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {t("login.signUp")}
            </button>
          </p>
        </div>

        {/* Optional: Forgot Password Link */}
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")} // Navigate to the forgot password page
            className="text-blue-600 hover:underline focus:outline-none text-sm"
          >
            {t("login.forgotPassword")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
