import SelectComp from "../../screens/Sales/components/SelectComp";
import { Routes, Route, Link, useLocation } from "react-router-dom";

export default function ModuleDropDown() {
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
    return "New " + titleCaseMiddlePart;
  }

  const navigateOptions = [
    "New Invoice",
    "New Quotation",
    "New Debit",
    "New Credit",
  ];
  return (
    <div style={{maxWidth: 300, marginLeft: 20}}>
    <SelectComp
      options={convertDropdownData(navigateOptions)}
      handle={(value) => {
        if (value.select === "New Invoice") {
          window.location.href = "/sales/invoice/new";
        } else if (value.select === "New Quotation") {
          window.location.href = "/sales/quotation/new";
        } else if (value.select === "New Debit") {
          window.location.href = "/sales/debit/new";
        } else {
          window.location.href = "/sales/credit/new";
        }
      }}
      label="Module"
      isinput={false}
      defaultValue={extractMiddleTitleCase(location.pathname)}
    />
    </div>
  );
}
