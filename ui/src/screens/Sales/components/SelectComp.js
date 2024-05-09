import React, { useState } from "react";

export default function SelectComp({
  label = "",
  placeholder = "",
  options = [],
  handle,
  isinput = false,
}) {
  let optionsToMap = options.map((item) => item.text);
  const [selectedValue, setSelectedValue] = useState("");

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    handle(newValue);
  };

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    handle(value);
  };

  return (
    <div className="flex flex-1 items-center w-full">
      <div className="selectCompStyle">
        <input
          autoComplete="on"
          list={label}
          value={selectedValue}
          onChange={handleInputChange}
          placeholder={placeholder ? placeholder : label}
        />
        <datalist id={label}>
          {optionsToMap.map((option, index) => (
            <option
              key={index}
              value={option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  );
}
