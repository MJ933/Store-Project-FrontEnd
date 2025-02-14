import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();

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
      alert(t("navbar.notLoggedInAlert"));
    }
    navigate("/");
  };

  const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 300) {
        setIsSearchOpen(true);
      } else {
        setIsSearchOpen(false);
      }
    };

    // Listen to window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left Side: Toggle Button & Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSideMenu}
              className="text-gray-800 hover:text-cyan-600 focus:outline-none"
            >
              {isSideMenuOpen ? (
                <HiX className="w-5 h-5" />
              ) : (
                <HiMenu className="w-5 h-5" />
              )}
            </button>
            {!["/"].includes(location.pathname) && (
              <Link
                to="/"
                className="store-logo text-xl font-bold text-cyan-600"
              >
                {t("navbar.store")}
              </Link>
            )}
          </div>

          {/* Right Side: Essential Icons */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
            <button
              onClick={() =>
                changeLanguage(i18n.resolvedLanguage === "en" ? "ar" : "en")
              }
              className="p-1 mb-1 sm:p-2 text-gray-800 hover:text-cyan-600 focus:outline-none text-lg"
            >
              <span className="hidden sm:inline">
                {i18n.resolvedLanguage === "en" ? "العربية" : "English"}
              </span>
              <span className="sm:hidden">
                {i18n.resolvedLanguage === "en" ? "ع" : "En"}
              </span>
            </button>

            {["/", "/products/ShowAllProducts"].includes(location.pathname) &&
              !isSearchOpen && (
                <>
                  <button
                    onClick={toggleSearch}
                    className="sm:hidden p-1 text-gray-800 hover:text-cyan-600 focus:outline-none"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                  {!isSearchOpen && (
                    <button
                      onClick={toggleSearch}
                      className="hidden sm:block p-1 text-gray-800 hover:text-cyan-600 focus:outline-none"
                    >
                      <FaSearch className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}

            <CartIcon cartItems={cartItems} />
            <ProfileSection
              userType={userType}
              currentCustomer={currentCustomer}
              currentEmployee={currentEmployee}
              handleLogOut={handleLogOut}
            />
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="w-full px-2 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder")}
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none text-sm"
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:outline-none text-sm"
              >
                {t("navbar.find")}
              </button>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  dispatch(clearSearchQuery());
                }}
                className="p-2 text-gray-800 hover:text-cyan-600 focus:outline-none"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (hidden links) */}
      {isSideMenuOpen && (
        <SideMenu
          userType={userType}
          currentCustomer={currentCustomer}
          currentEmployee={currentEmployee}
          toggleSideMenu={toggleSideMenu}
          changeLanguage={changeLanguage}
        />
      )}
    </nav>
  );
};

// ─── SIDE MENU COMPONENT ──────────────────────────────────────────────

const SideMenu = ({
  userType,
  currentCustomer,
  currentEmployee,
  toggleSideMenu,
  changeLanguage,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Semi-transparent overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={toggleSideMenu}
      ></div>
      {/* Sidebar */}
      <div className="relative w-64 bg-white shadow-xl p-4">
        <button
          onClick={toggleSideMenu}
          className="mb-4 text-gray-800 hover:text-cyan-600 focus:outline-none"
        >
          <HiX className="w-6 h-6" />
        </button>
        {/* Navigation Links */}
        {userType === "employee" && (
          <>
            {["Products", "Categories", "Employees", "Customers", "Orders"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}/manage`}
                  onClick={toggleSideMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                >
                  {t(`navbar.${item.toLowerCase()}`)}
                </Link>
              )
            )}
          </>
        )}
        {userType === "customer" && (
          <Link
            to="/orders/customer-orders"
            onClick={toggleSideMenu}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
          >
            {t("navbar.myOrders")}
          </Link>
        )}

        {/* Language Switch */}
        <button
          onClick={() => {
            changeLanguage(i18n.resolvedLanguage === "en" ? "ar" : "en");
            toggleSideMenu();
          }}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
        >
          {i18n.resolvedLanguage === "en" ? "العربية" : "English"}
        </button>

        {/* Profile / Login Section */}
        <div className="border-t border-gray-200 mt-4 pt-4">
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

// ─── CART ICON COMPONENT ───────────────────────────────────────────────

const CartIcon = ({ cartItems }) => {
  return (
    <Link to="/cart" className="p-1 text-gray-800 hover:text-cyan-600 relative">
      <FaCartPlus className="w-5 h-5" />
      {cartItems.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
};

// ─── PROFILE SECTION COMPONENT ─────────────────────────────────────────

const ProfileSection = ({
  userType,
  currentCustomer,
  currentEmployee,
  handleLogOut,
}) => {
  const { t } = useTranslation();
  return currentCustomer || currentEmployee ? (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLogOut}
        className="flex items-center gap-2 p-3 text-gray-800 hover:text-cyan-600"
      >
        <span className=" text-sm mb-1">{t("navbar.logout")}</span>
        {/* <RiLogoutCircleFill className="w-5 h-5" /> */}
      </button>
      <span className="hidden sm:inline">
        <Link
          to={userType === "customer" ? "/customerProfile" : "/employeeProfile"}
          className="p-1 text-gray-800 hover:text-cyan-600"
        >
          <FaRegUserCircle className="w-5 h-5" />
        </Link>
      </span>
    </div>
  ) : (
    <Link
      to="/login"
      className="flex items-center gap-2 p-1 text-gray-800 hover:text-cyan-600"
    >
      <span className="  text-sm mb-1">{t("navbar.login")}</span>
      {/* <RiLoginCircleFill className="w-5 h-5" /> */}
    </Link>
  );
};

// ─── MOBILE PROFILE SECTION (For SideMenu) ───────────────────────────

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
        <FaRegUserCircle className="inline w-5 h-5 mr-2" />
        {t("navbar.profile")}
      </Link>
      <button
        onClick={mobileHandleLogOut}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
      >
        <RiLogoutCircleFill className="inline w-5 h-5 mr-2" />
        {t("navbar.logout")}
      </button>
    </div>
  ) : (
    <Link
      to="/login"
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 text-left"
    >
      <RiLoginCircleFill className="inline w-5 h-5 mr-2" />
      {t("navbar.login")}
    </Link>
  );
};

export default Navbar;
