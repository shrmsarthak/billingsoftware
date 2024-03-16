import React, { useState } from "react";
import { Option, Select } from "@material-tailwind/react";

export default function SelectComp({
  defaultValue = "",
  options = [],
  handle,
  isinput,
  label,
  disabled = "",
}) {
  // const [selectedOption, setSelectedOption] = useState(
  //   defaultValue || (options.length ? options[0].value : "")
  // );
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [inputValue, setInputValue] = useState("");

  const handleOnChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    handle({ select: selectedValue, input: inputValue });
  };

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    handle({ select: selectedOption, input: newInputValue });
  };
  return (
    <div className="flex flex-1 items-center w-full">
      <Select
        disabled={disabled || options.length === 0}
        label={label}
        value={selectedOption}
        onChange={(value) => {
          handleOnChange(value);
        }}
        key={selectedOption}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.text}
          </Option>
        ))}
      </Select>

      {isinput && (
        <div className="ml-5">
          <input className="border rounded-md" onChange={handleInputChange} />
        </div>
      )}
    </div>
  );
}
