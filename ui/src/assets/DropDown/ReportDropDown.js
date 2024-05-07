import SelectComp from "../../screens/Sales/components/SelectComp";
import { useLocation } from "react-router-dom";

export default function ReportsDropDown() {
  const location = useLocation();

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
    return "Show " + titleCaseMiddlePart;
  }

  const navigateOptions = [
    "Show Invoice",
    "Show Quotation",
    "Show Debit",
    "Show Credit",
    "Show Purchase",
    "Show Payment",
  ];
  return (
    <div style={{ maxWidth: 300, marginLeft: 20 }}>
      <SelectComp
        options={convertDropdownData(navigateOptions)}
        handle={(value) => {
          if (value.select === "Show Invoice") {
            window.location.href = "/sales/invoice/show";
          } else if (value.select === "Show Quotation") {
            window.location.href = "/sales/quotation/show";
          } else if (value.select === "Show Debit") {
            window.location.href = "/sales/debit/show";
          } else if (value.select === "Show Credit") {
            window.location.href = "/sales/credit/show";
          } else if (value.select === "Show Payment") {
            window.location.href = "/sales/payment/show";
          } else {
            window.location.href = "/sales/purchase/show";
          }
        }}
        label="Module"
        isinput={false}
        defaultValue={extractMiddleTitleCase(location.pathname)}
      />
    </div>
  );
}
