import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import HomePage from "../components/HomePage";
import FindProduct from "../pages/Products/FindProduct";
import ShowAllProducts from "../pages/Products/ShowAllProducts";
import DeleteProduct from "../pages/Products/DeleteProduct";
import ShowAllCategories from "../pages/Categories/ShowAllCategory";
import ManageProducts from "../pages/Products/ManageProducts";
import AddNewUpdateProduct from "../pages/Products/AddUpdateProduct";
import ManageCategories from "../pages/Categories/ManageCategories";
import ManageCustomers from "../pages/Customers/ManageCustomers";
import ManageOrders from "../pages/Orders/ManageOrders";
import CurrentCart from "../pages/Carts/CurrentCart";
import LogIn from "../pages/Customers/LogIn";
import CustomerPage from "../pages/Customers/CustomerPage";
import AddNewUpdateCustomer from "../pages/Customers/AddUpdateCustomer";
import AddUpdateCategory from "../pages/Categories/AddUpdateCategory";
import ManageEmployees from "../pages/Employees/ManageEmployees";
import AddNewUpdateEmployee from "../pages/Employees/AddUpdateEmployee";
import EmployeePage from "../pages/Employees/EmployeePage";
import CustomerOrders from "../pages/Customers/CustomerOrders";
import ProductPage from "../pages/Products/ProductPage";
import TestErrorComponent from "../components/TestErrorComponent";
import FAQsPage from "../common/FAQsPage";
import ContactPage from "../common/ContactPage";
import PrivacyPolicyPage from "../common/PrivacyPolicyPage";
import TermsAndConditionsPage from "../common/TermsAndConditionsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/products/ShowAllProducts",
        element: <ShowAllProducts selectedCategoryId={null} />,
      },
      { path: "/products/manage", element: <ManageProducts /> },
      { path: "/categories/manage", element: <ManageCategories /> },
      { path: "/orders/manage", element: <ManageOrders /> },
      { path: "/cart", element: <CurrentCart /> },
      { path: "/login", element: <LogIn /> },
      { path: "/customerProfile", element: <CustomerPage isShow={true} /> },
      { path: "/employeeProfile", element: <EmployeePage isShow={true} /> },
      {
        path: "/employees/manage",
        element: <ManageEmployees isShow={true} employee={null} />,
      },
      { path: "/customers/manage", element: <ManageCustomers /> },
      { path: "/orders/customer-orders", element: <CustomerOrders /> },
      { path: "/products/:productID", element: <ProductPage /> },
      {
        path: "/signup",
        element: (
          <AddNewUpdateCustomer customer={null} isShow={true} isSignUp={true} />
        ),
      },
      // New routes for informational pages:
      { path: "/faqs", element: <FAQsPage /> },
      { path: "/contact-us", element: <ContactPage /> },
      // { path: "/track-order", element: <TrackOrderPage /> },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsAndConditionsPage /> },
    ],
  },
  {
    // *** Test error route ***
    path: "/test-error",
    element: <TestErrorComponent />,
  },
]);

export default router;
