import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import HomeButton from "../../assets/Buttons/HomeButton";
const { ipcRenderer } = window.require("electron");

const initialValues = {
  CompanyName: "",
  Address: "",
  Pincode: "",
  City: "",
  State: "",
  Country: "",
  Phone: "",
  Email: "",
  Website: "",
  PAN: "",
  GSTNO: "",
  TIN: "",
};

export default function AddCompanyDetails() {
  const [formData, setFormData] = useState(initialValues);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const res = await ipcRenderer.invoke("add-company-details", formData);
    alert(res.message);
  };

  return (
    <>
      <div style={{ position: "absolute" }}>
        {" "}
        <HomeButton />
      </div>
      <div
        className="flex justify-center items-center h-screen"
        style={{ background: "linear-gradient(19deg, #6396b9c7, transparent)" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ display: "flex", justifyContent: "center" }}
          >
            Add Company Details
          </h1>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <Input
                  key={key}
                  type="text"
                  color="grey"
                  placeholder={key}
                  label={key}
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  style={{ width: "100%" }}
                  className="mb-4"
                />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleSubmit}
                disabled={
                  formData.CompanyName === "" ||
                  formData.Address === "" ||
                  formData.Pincode === "" ||
                  formData.City === "" ||
                  formData.State === "" ||
                  formData.Country === "" ||
                  formData.Phone === ""
                }
                style={{ width: "-webkit-fill-available" }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
