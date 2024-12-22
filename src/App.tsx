import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import TablesProduct from './pages/TablesProduct';
import DefaultLayout from './layout/DefaultLayout';
//@ts-ignore
import Cookies from "js-cookie"
import TablesOrder from './pages/TablesOrder';
import TablesUser from './pages/TablesUser';
import AddProductForm from './pages/UiElements/AddForm';
import EditProductForm from './pages/UiElements/EditProductForm';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const token = Cookies.get('token');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            token ? <>
            <PageTitle title="Dashboard" />
            <ECommerce />
          </> : <SignIn />
          }
        />
        <Route
          path="/profile"
          element=
          {
            token ? <>
            <PageTitle title="Profile" />
            <Profile />
          </> : <SignIn />
          }
        />
        <Route
          path="/tables/products"
          element={
            <>
              <PageTitle title="Table Products" />
              <TablesProduct />
            </>
          }
        />
        <Route
          path="/tables/products/add"
          element={
            <>
              <PageTitle title="Add Products" />
              <AddProductForm />
            </>
          }
        />
        <Route
          path="/edit-product/:productId"
          element={
            <>
              <PageTitle title="Add Products" />
              <EditProductForm />
            </>
          }
        />
        <Route
          path="/tables/orders"
          element={
            <>
              <PageTitle title="Table Orders" />
              <TablesOrder />
            </>
          }
        />
        <Route
          path="/tables/users"
          element={
            <>
              <PageTitle title="Table Users" />
              <TablesUser />
            </>
          }
        />
        <Route
          path="/settings"
          element=
          {
            token ? <>
            <PageTitle title="Settings" />
            <Settings />
          </> : <SignIn />
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
