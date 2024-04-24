import { Routes, Route, Link, useLocation } from "react-router-dom";
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
import ShowPaymentDocScreen from "./screens/Sales/PaymentDocument/ShowPaymentDocScreen";
import SelectComp from "./screens/Sales/components/SelectComp";

function convertDropdownData(data) {
  return data.map((item) => ({
    text: item,
    value: item,
  }));
}

function extractMiddleTitleCase(path) {
  const parts = path.split("/");
  const middlePart = parts.slice(2, -1).join(" ");
  const titleCaseMiddlePart = middlePart.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
  return titleCaseMiddlePart;
}

const navigateOptions = ["Invoice", "Quotation", "Debit", "Credit"];

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" ? (
        <>
          {location.pathname === "/sales/invoice/show" ||
          location.pathname === "/sales/quotation/show" ||
          location.pathname === "/sales/debit/show" ||
          location.pathname === "/sales/credit/show" ? (
            <div className="flex" style={{ alignItems: "center" }}>
              <Link to="/">
                <button
                  className="cursor-pointer duration-200 hover:scale-110 active:scale-100"
                  title="Go Back"
                  style={{ border: "1px solid", marginLeft: 20, padding: 8 }}
                >
                  <svg
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                    />
                  </svg>
                </button>
              </Link>
              <div style={{ width: "300px", margin: "5px 0px 10px 20px" }}>
                <SelectComp
                  options={convertDropdownData(navigateOptions)}
                  handle={(value) => {
                    if (value.select === "Invoice") {
                      window.location.href = "/sales/invoice/show";
                    } else if (value.select === "Quotation") {
                      window.location.href = "/sales/quotation/show";
                    } else if (value.select === "Debit") {
                      window.location.href = "/sales/debit/show";
                    } else {
                      window.location.href = "/sales/credit/show";
                    }
                  }}
                  label="Module"
                  isinput={false}
                  defaultValue={extractMiddleTitleCase(location.pathname)}
                />
              </div>
            </div>
          ) : (
            <Link to="/">
              <button
                className="cursor-pointer duration-200 hover:scale-110 active:scale-100"
                title="Go Back"
                style={{
                  border: "1px solid",
                  marginLeft: 10,
                  padding: 8,
                  marginBottom: 2,
                }}
              >
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                  />
                </svg>
              </button>
            </Link>
          )}
        </>
      ) : null}

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
        <Route path="/sales/payment/show" element={<ShowPaymentDocScreen />} />
      </Routes>
    </>
  );
}

export default App;
