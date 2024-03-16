import { Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage";
import ModuleSalePage from "./screens/Sales/moduleSalePage"
import Signup from "./screens/Login/Signup";
import SignIn from "./screens/Login/SignIn";
import ShowClientPage from "./screens/Sales/Client/ShowClients";
import ShowProductsPage from "./screens/Sales/ProductService/ShowProducts";
function App() {
  
  return (
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element = {<Signup />} /> 
          <Route path="/dashboard" element = {<HomePage />} />
          <Route path="/sales/invoice/new" element = {<ModuleSalePage page = "newinvoice" /> }/> 
          <Route path="/sales/invoice/show" element = {<ModuleSalePage page = "showinvoice" /> }/>
          <Route path="/sales/client/show" element = {<ShowClientPage />} />
          <Route path="/sales/product_service/show" element = {<ShowProductsPage />} />          
      </Routes>
  )
}

export default App;
