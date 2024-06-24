import { useLocation, useNavigate } from "react-router-dom";
import Select, { components } from "react-select";

export default function ReportsDropDown() {
  const location = useLocation();
  const navigate = useNavigate();

  function extractMiddleTitleCase(path) {
    const parts = path.split("/");
    const middlePart = parts.slice(2, -1).join(" ");
    const titleCaseMiddlePart = middlePart.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
    return "Show " + titleCaseMiddlePart;
  }

  const CustomOption = (props) => {
    const { innerRef, innerProps, data } = props;

    const handleClick = (e) => {
      e.stopPropagation();
      navigate(data.to);
    };

    return (
      <div
        ref={innerRef}
        {...innerProps}
        onClick={handleClick}
        className="dropDown-menu"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          padding: 10,
        }}
      >
        <h1
          className="font-bold text-black"
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "small",
            margin: 0,
          }}
        >
          {data.label}
        </h1>
      </div>
    );
  };

  const options = [
    {
      value: "1",
      label: "Show Invoice",
      to: "/sales/invoice/show",
    },
    {
      value: "2",
      label: "Show Quotation",
      to: "/sales/quotation/show",
    },
    {
      value: "3",
      label: "Show Debit",
      to: "/sales/debit/show",
    },
    {
      value: "4",
      label: "Show Credit",
      to: "/sales/credit/show",
    },
    {
      value: "5",
      label: "Show Purchase",
      to: "/sales/purchase/show",
    },
    {
      value: "6",
      label: "Show Payment",
      to: "/sales/payment/show",
    },
    {
      value: "7",
      label: "Show Vendors",
      to: "/sales/vendors/show",
    },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      padding: "10px", // Add padding to make the area easily clickable
      cursor: "pointer",
    }),
  };

  return (
    <div style={{ width: 200, marginLeft: 20 }}>
      <Select
        options={options}
        placeholder={extractMiddleTitleCase(location.pathname)}
        components={{ Option: CustomOption }}
        styles={customStyles}
      />
    </div>
  );
}
