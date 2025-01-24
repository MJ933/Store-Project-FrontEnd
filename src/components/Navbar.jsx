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
import { setSearchQuery } from "../redux/features/search/searchSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route

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
      alert("You are not logged in.");
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

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-cyan-600">
              Store
            </Link>

            {/* Employee-Specific Options (Desktop) */}
            {userType === "employee" && (
              <div className="hidden sm:flex items-center space-x-4">
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
                    className="px-3 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}

            {/* My Orders (Desktop and Tablet) */}
            {userType === "customer" && (
              <Link
                to="/orders/customer-orders"
                className="hidden sm:block px-3 py-2 text-lg font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Side: Icons (Cart, Profile, Login/Logout) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon (Only on Home Page) */}
            {location.pathname === "/" && (
              <>
                {/* Search Icon (Mobile) */}
                <button
                  onClick={toggleSearch}
                  className="sm:hidden p-1 sm:p-2 text-gray-800 hover:text-cyan-600 focus:outline-none"
                >
                  <FaSearch className="w-5 h-5" />
                </button>

                {/* Search Icon (Desktop) */}
                {!isSearchOpen && (
                  <button
                    onClick={toggleSearch}
                    className="hidden sm:block p-1 sm:p-2 text-gray-800 hover:text-cyan-600 focus:outline-none"
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
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:outline-none"
              >
                Find
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
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
  return (
    <div className="sm:hidden bg-white">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {/* Employee-Specific Options */}
        {userType === "employee" &&
          ["Products", "Categories", "Employees", "Customers", "Orders"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}/manage`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
              >
                {item}
              </Link>
            )
          )}

        {/* My Orders for Customers */}
        {userType === "customer" && (
          <Link
            to="/orders/customer-orders"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            My Orders
          </Link>
        )}
      </div>
    </div>
  );
};

// Cart Icon Component
const CartIcon = ({ cartItems }) => {
  return (
    <Link
      to="/cart"
      className="p-1 sm:p-2 text-gray-800 hover:text-cyan-600 relative"
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
  return currentCustomer || currentEmployee ? (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLogOut}
        className="p-1 sm:p-2 text-gray-800 hover:text-cyan-600"
      >
        <RiLogoutCircleFill className="w-5 h-5" />
      </button>
      <Link
        to={userType === "customer" ? "/customerProfile" : "/employeeProfile"}
        className="p-1 sm:p-2 text-gray-800 hover:text-cyan-600"
      >
        <FaRegUserCircle className="w-5 h-5" />
      </Link>
    </div>
  ) : (
    <Link to="/login" className="p-1 sm:p-2 text-gray-800 hover:text-cyan-600">
      <RiLoginCircleFill className="w-5 h-5" />
    </Link>
  );
};

export default Navbar;
