// E:\My Projects\Store Project\Store FrontEnd\i18next-parser.config.cjs
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  RiLoginCircleFill,
  RiLogoutCircleFill,
  RiCloseLine,
} from "react-icons/ri";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutCustomer } from "../redux/features/auth/authCustomerSlice";
import { logoutEmployee } from "../redux/features/auth/authEmployeeSlice";
import { FaCartPlus } from "react-icons/fa6";
import {
  clearSearchQuery,
  setSearchQuery,
} from "../redux/features/search/searchSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route
  const { t, i18n } = useTranslation(); // Initialize useTranslation hook

  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentCustomer = useSelector(
    (state) => state.authCustomer.currentCustomer
  );
  const currentEmployee = useSelector(
    (state) => state.authEmployee.currentEmployee
  );
  const userType = localStorage.getItem("userType");

  const handleLogOut = () => {
    if (currentCustomer) {
      dispatch(logoutCustomer());
    } else if (currentEmployee) {
      dispatch(logoutEmployee());
    } else {
      alert(t("navbar.notLoggedInAlert")); // Use translation key for alert message
    }
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = () => {
    const query = localSearchQuery.trim();
    dispatch(setSearchQuery(query));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        {" "}
        {/* Use container for max-width and responsiveness */}
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {" "}
            {/* Reduced gap on smaller screens */}
            {/* Logo */}
            <Link to="/" className="store-logo text-xl font-bold text-cyan-600">
              {t("navbar.store")} {/* Translation key for Store */}
            </Link>
            {/* Employee-Specific Options (Desktop) */}
            {userType === "employee" && (
              <div className="hidden sm:flex items-center gap-2 lg:gap-4">
                {" "}
                {/* Reduced gap on smaller screens, adjust lg:gap-4 as needed */}
                {[
                  "Products",
                  "Categories",
                  "Employees",
                  "Customers",
                  "Orders",
                ].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}/manage`}
                    className="px-2 py-2 text-sm lg:text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" // Reduced padding and font-size on smaller screens
                  >
                    {t(`navbar.${item.toLowerCase()}`)}{" "}
                    {/* Translation keys for employee menu items */}
                  </Link>
                ))}
              </div>
            )}
            {/* My Orders (Desktop and Tablet) */}
            {userType === "customer" && (
              <Link
                to="/orders/customer-orders"
                className="hidden sm:block px-2 py-2 text-sm lg:text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" // Reduced padding and font-size on smaller screens
              >
                {t("navbar.myOrders")} {/* Translation key for My Orders */}
              </Link>
            )}
          </div>

          {/* Right Side: Icons (Cart, Profile, Login/Logout) */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {" "}
            {/* Adjusted gaps for different screen sizes */}
            {/* Language Switch Button */}
            <button
              onClick={() =>
                changeLanguage(i18n.resolvedLanguage === "en" ? "ar" : "en")
              }
              className=" p-1 sm:p-2 text-gray-800 hover:text-cyan-600 focus:outline-none text-sm" // Reduced padding and font size
            >
              {i18n.resolvedLanguage === "en" ? "العربية" : "English"}
            </button>
            {/* Search Icon (Only on Home Page) */}
            {["/", "/products/ShowAllProducts"].includes(location.pathname) && (
              <>
                {/* Search Icon (Mobile) */}
                <button
                  onClick={toggleSearch}
                  className="sm:hidden p-1 text-gray-800 hover:text-cyan-600 focus:outline-none" // Reduced padding
                >
                  <FaSearch className="w-5 h-5" />
                </button>

                {/* Search Icon (Desktop) */}
                {!isSearchOpen && (
                  <button
                    onClick={toggleSearch}
                    className="hidden sm:block p-1 text-gray-800 hover:text-cyan-600 focus:outline-none" // Reduced padding
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
            {/* Cart Icon */}
            <CartIcon cartItems={cartItems} />
            {/* Profile and Login/Logout */}
            <ProfileSection
              userType={userType}
              currentCustomer={currentCustomer}
              currentEmployee={currentEmployee}
              handleLogOut={handleLogOut}
            />
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden text-gray-800 hover:text-cyan-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-5 h-5" />
              ) : (
                <HiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {/* Search Bar (Full Width) */}
        {isSearchOpen && (
          <div className="w-full px-2 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder")} // Translation key for search placeholder
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none text-sm" // Added text-sm to reduce font size
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:outline-none text-sm" // Added text-sm to reduce font size
              >
                {t("navbar.find")} {/* Translation key for Find button */}
              </button>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  clearSearchQuery();
                  dispatch(clearSearchQuery());
                }}
                className="p-2 text-gray-800 hover:text-cyan-600 focus:outline-none"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <MobileMenu
            userType={userType}
            currentCustomer={currentCustomer}
            currentEmployee={currentEmployee}
          />
        )}
      </div>
    </nav>
  );
};

// Mobile Menu Component
const MobileMenu = ({ userType, currentCustomer, currentEmployee }) => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation hook // ADDED HERE
  return (
    <div className="sm:hidden bg-white">
      <div className="px-2 pt-2 pb-3 grid gap-y-1">
        {" "}
        {/* Using grid for vertical spacing */}
        {/* Employee-Specific Options */}
        {userType === "employee" &&
          ["Products", "Categories", "Employees", "Customers", "Orders"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}/manage`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {t(`navbar.${item.toLowerCase()}`)}{" "}
                {/* Translation keys for mobile employee menu items */}
              </Link>
            )
          )}
        {/* My Orders for Customers */}
        {userType === "customer" && (
          <Link
            to="/orders/customer-orders"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            {t("navbar.myOrders")} {/* Translation key for mobile My Orders */}
          </Link>
        )}
        {/* Language Switch Button in Mobile Menu */}
        <button
          onClick={() =>
            changeLanguage(i18n.resolvedLanguage === "en" ? "ar" : "en")
          }
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left" // Added text-left for alignment
        >
          {i18n.resolvedLanguage === "en" ? "العربية" : "English"}
        </button>
        {/* Profile and Login/Logout in Mobile Menu */}
        <div className="border-t border-gray-200 pt-2">
          {" "}
          {/* Separator line */}
          <MobileProfileSection
            userType={userType}
            currentCustomer={currentCustomer}
            currentEmployee={currentEmployee}
          />
        </div>
      </div>
    </div>
  );
};

// Cart Icon Component
const CartIcon = ({ cartItems }) => {
  return (
    <Link
      to="/cart"
      className="p-1 text-gray-800 hover:text-cyan-600 relative" // Reduced padding
    >
      <FaCartPlus className="w-5 h-5" />
      {cartItems.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
};

// Profile Section Component
const ProfileSection = ({
  userType,
  currentCustomer,
  currentEmployee,
  handleLogOut,
}) => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  return currentCustomer || currentEmployee ? (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogOut}
        className=" p-1 text-gray-800 hover:text-cyan-600" // Reduced padding
      >
        <RiLogoutCircleFill className="w-5 h-5" />
      </button>
      <Link
        to={userType === "customer" ? "/customerProfile" : "/employeeProfile"}
        className="p-1 text-gray-800 hover:text-cyan-600" // Reduced padding
      >
        <FaRegUserCircle className=" w-5 h-5" />
      </Link>
    </div>
  ) : (
    <Link to="/login" className=" p-1 text-gray-800 hover:text-cyan-600">
      {" "}
      {/* Reduced padding */}
      <RiLoginCircleFill className="w-5 h-5" />
    </Link>
  );
};

// Mobile Profile Section Component - For Mobile Menu
const MobileProfileSection = ({
  userType,
  currentCustomer,
  currentEmployee,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mobileHandleLogOut = () => {
    if (currentCustomer) {
      dispatch(logoutCustomer());
    } else if (currentEmployee) {
      dispatch(logoutEmployee());
    } else {
      alert(t("navbar.notLoggedInAlert"));
    }
    navigate("/");
  };

  return currentCustomer || currentEmployee ? (
    <div className="grid gap-y-2">
      <Link
        to={userType === "customer" ? "/customerProfile" : "/employeeProfile"}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
      >
        <FaRegUserCircle className="inline w-5 h-5 mr-2" />{" "}
        {t("navbar.profile")}
      </Link>
      <button
        onClick={mobileHandleLogOut}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
      >
        <RiLogoutCircleFill className="inline w-5 h-5 mr-2" />{" "}
        {t("navbar.logout")}
      </button>
    </div>
  ) : (
    <Link
      to="/login"
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
    >
      <RiLoginCircleFill className="inline w-5 h-5 mr-2" /> {t("navbar.login")}
    </Link>
  );
};

export default Navbar;
