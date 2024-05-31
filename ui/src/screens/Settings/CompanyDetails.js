import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import HomeButton from "../../assets/Buttons/HomeButton";
import { get_company_details } from "../../utils/SelectOptions";
import { Link, useNavigate } from "react-router-dom";

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
  KEY: "",
};

const KEY = "HSNAMU-4444-KAHTRAS-8888";
let companyDetails = await get_company_details();
let keyToCompare = companyDetails.data[0]?.KEY;

export default function AddCompanyDetails() {
  const [formData, setFormData] = useState(initialValues);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const res = await window.api.invoke("add-company-details", formData);
    alert(res.message);
    window.location.reload();
  };

  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (KEY === keyToCompare ){
  //   const timer = setTimeout(() => {
  //     navigate('/dashboard');
  //   }, 3000);

  //   return () => clearTimeout(timer);}
  // }, [keyToCompare])

  return (
    <>
      <div style={{ position: "absolute", marginLeft: -15 }}>
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
                  defaultValue={companyDetails.data[0]?.companyName}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  style={{ width: "100%" }}
                  className="mb-4"
                />
              ))}
              <>
                {KEY !== keyToCompare ? (
                  <div style={{ color: "red", marginTop: 10 }}>
                    ERR: Please Enter Correct KEY
                  </div>
                ) : (
                  <Link to="/dashboard">
                    <Button className="rounded-full" color="green">
                      Happy Invoicing ❤️
                    </Button>
                  </Link>
                )}
              </>
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
                  formData.Phone === "" ||
                  formData.KEY === ""
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
