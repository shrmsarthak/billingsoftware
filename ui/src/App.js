import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./screens/HomePage";
import ModuleSalePage from "./screens/Sales/moduleSalePage";
import Signup from "./screens/Login/Signup";
import SignIn from "./screens/Login/SignIn";
import ShowClientPage from "./screens/Sales/Client/ShowClients";
import ShowProductsPage from "./screens/Sales/ProductService/ShowProducts";
import ShowInvoicePage from "./screens/Sales/Invoice/ShowInvoices";
import AddCompanyDetails from "./screens/Settings/CompanyDetails";
import NewQuotationPage from "./screens/Sales/Quotation/NewQuotationPage";
import ShowQuotationPage from "./screens/Sales/Quotation/ShowQuotationPage";
import NewDebitNotePage from "./screens/Sales/DebitNote/NewDebitNotePage";
import ShowDebitNotePage from "./screens/Sales/DebitNote/ShowDebitNotePage";
import NewCreditNotePage from "./screens/Sales/CreditNote/NewCreditNotePage";
import ShowCreditNotePage from "./screens/Sales/CreditNote/ShowCreditNotePage";
import NewPaymentPage from "./screens/Sales/PaymentDocument/NewPaymentDocScreen";
import ShowPaymentDocScreen from "./screens/Sales/PaymentDocument/ShowPaymentDocScreen";
import ShowLedgerPage from "./screens/Sales/Ledger/ShowLedger";
import ShowPurchase from "./screens/Sales/Purchase/ShowPurchase";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route
          path="/sales/invoice/new"
          element={<ModuleSalePage page="newinvoice" />}
        />
        <Route path="/sales/invoice/show" element={<ShowInvoicePage />} />
        <Route path="/sales/client/show" element={<ShowClientPage />} />
        <Route
          path="/sales/product_service/show"
          element={<ShowProductsPage />}
        />
        <Route path="/settings/company/new" element={<AddCompanyDetails />} />
        <Route path="/sales/quotation/new" element={<NewQuotationPage />} />
        <Route path="/sales/quotation/show" element={<ShowQuotationPage />} />
        <Route path="/sales/debit/new" element={<NewDebitNotePage />} />
        <Route path="/sales/debit/show" element={<ShowDebitNotePage />} />
        <Route path="/sales/credit/new" element={<NewCreditNotePage />} />
        <Route path="/sales/credit/show" element={<ShowCreditNotePage />} />
        <Route path="/sales/payment/new" element={<NewPaymentPage />} />
        <Route path="/sales/payment/show" element={<ShowPaymentDocScreen />} />
        <Route path="/sales/ledger/show" element={<ShowLedgerPage />} />
        <Route path="/sales/purchase/show" element={<ShowPurchase />} />
      </Routes>
    </>
  );
}

export default App;
