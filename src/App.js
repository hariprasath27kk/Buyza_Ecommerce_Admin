import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from './pages/Login';
import DashBoard from "./pages/DashBoard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import OrderList from "./pages/OrderList";
import ForgetPassword from "./pages/ForgetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import AddProduct from "./pages/AddProduct";
import { useEffect, useState } from "react";
import axios from "axios";

const PrivateRoute = ({ profile }) => { 
  const token = localStorage.getItem('token');

  return token ? (
    <>
      <Navbar profile={profile} /> 
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}

const PublicRoute = () => {
  const token = localStorage.getItem('token');

  return !token ? <Outlet /> : <Navigate to="/" />;
}

function App() {
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState({});

  useEffect(() => {

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/form/getuser`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Response admin:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.log("Error in admin profile", error);
    }
  }

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute profile={profile} />}> {/* Pass profile to PrivateRoute */}
              <Route path='/users' element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path='/' element={<DashBoard profile={profile} />} />
              <Route path="/order-list" element={<OrderList />} />
              <Route path="/category" element={<Category />} />
              <Route path="/subcategory" element={<SubCategory />} />
              <Route path="/addproduct" element={<AddProduct />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
