import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { showmessage } from "../../../utils/api";
import {
  getAllCountry,
  getStates,
  getCities,
  getFilterCities,
} from "../../../utils/AddressDataApi";
import SelectComp from "../components/SelectComp";

export default function AddNewClientModal({ isOpen, handleOpen, handleClose }) {
  const [clientData, setClientData] = useState({
    client_name: "",
    contact_name: "",
    phone: "",
    email: "",
    gstin: "",
    tin: "",
    pan: "",
    billing_address: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [countries, setCountries] = useState(getAllCountry());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Save client data logic here
    const res = await window.api.invoke("add-new-client", clientData);
    showmessage(res.message);
    handleClose();
  };

  const requiredFields = [
    "client_name",
    "contact_name",
    "phone",
    "gstin",
    "billing_address",
    "address",
    "city",
    "state",
    "pincode",
    "country",
  ];

  const isFormIncomplete = requiredFields.some(
    (field) => clientData[field] === "",
  );

  const isFieldRequired = (field) =>
    requiredFields.some(
      (reqField) => reqField.toLowerCase() === field.toLowerCase(),
    );

  const getLabel = (field) =>
    isFieldRequired(field) ? (
      <>
        {field.replace(/_/g, " ")}
        <span style={{ color: "red" }}>*</span>
      </>
    ) : (
      field.replace(/_/g, " ")
    );

  return (
    <Dialog size="md" open={isOpen} handler={handleOpen}>
      <DialogHeader toggler={handleClose}>Add New Client</DialogHeader>
      <DialogBody>
        <div
          className="space-y-2"
          style={{ overflow: "auto", height: "75vh", padding: 10 }}
        >
          <Input
            variant="outlined"
            label={getLabel("client_name")}
            name="client_name"
            value={clientData.client_name}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("contact_name")}
            name="contact_name"
            value={clientData.contact_name}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("phone")}
            name="phone"
            value={clientData.phone}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("email")}
            name="email"
            value={clientData.email}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("gstin")}
            name="gstin"
            value={clientData.gstin}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("tin")}
            name="tin"
            value={clientData.tin}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("pan")}
            name="pan"
            value={clientData.pan}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("billing_address")}
            name="billing_address"
            value={clientData.billing_address}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("address")}
            name="address"
            value={clientData.address}
            onChange={handleChange}
          />
          <div style={{ display: "flex", gap: "2px" }}>
            <div className="mb-5">
              <SelectComp
                label="Country"
                isinput={false}
                options={countries}
                handle={(values) => {
                  const value = values;
                  setClientData((prevState) => ({
                    ...prevState,
                    country: value,
                  }));
                  setStates(getStates(value));
                }}
              />
            </div>
            <div className="mb-5">
              <SelectComp
                label="State"
                isinput={false}
                options={states}
                handle={(values) => {
                  const value = values;
                  setClientData((prevState) => ({
                    ...prevState,
                    state: value,
                  }));
                  setCities(getCities(value));
                }}
              />
            </div>
            <div className="mb-5">
              <SelectComp
                label="City"
                isinput={false}
                options={cities}
                handle={(values) => {
                  const value = values;
                  setClientData((prevState) => ({
                    ...prevState,
                    city: value,
                  }));
                }}
              />
            </div>
          </div>
          <Input
            variant="outlined"
            label={getLabel("pincode")}
            name="pincode"
            value={clientData.pincode}
            onChange={handleChange}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          style={{ marginRight: 5 }}
        >
          Close
        </Button>
        <Button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSave}
          disabled={isFormIncomplete}
        >
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
