import { useNavigate, useLocation } from "react-router-dom";
import Select, { components } from "react-select";

export default function ModuleDropDown() {
  const location = useLocation();
  const navigate = useNavigate();

  function extractMiddleTitleCase(path) {
    const parts = path.split("/");
    const middlePart = parts.slice(2, -1).join(" ");
    const titleCaseMiddlePart = middlePart.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
    return "New " + titleCaseMiddlePart;
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
          padding: 10, // Ensure padding to make the area easily clickable
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
      label: "New Invoice",
      to: "/sales/invoice/new",
    },
    {
      value: "2",
      label: "New Quotation",
      to: "/sales/quotation/new",
    },
    {
      value: "3",
      label: "New Debit",
      to: "/sales/debit/new",
    },
    {
      value: "4",
      label: "New Credit",
      to: "/sales/credit/new",
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
