import {
  Button,
  Select,
  Textarea,
  Typography,
  Option,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { ProductInvoiceTable } from "../components/ProductInvoiceTable";
import SelectComp from "../components/SelectComp";
import { get_all_vendor_option } from "../../../utils/SelectOptions";
import { saveAs } from "file-saver";
import HomeButton from "../../../assets/Buttons/HomeButton";
import { showmessage } from "../../../utils/api";
import {
  getAllCountry,
  getStates,
  getCities,
  getFilterCities,
} from "../../../utils/AddressDataApi";

const TABLE_HEAD = [
  "No",
  "Type",
  "Document No",
  "Issue Date",
  "Sold QTY",
  "Purchase QTY",
];

const TABLE_HEAD_MAIN = [
  "No",
  "Vendor Name",
  "Created At",
  "City",
  "State",
  "Contact No",
  "Action",
];

const initialValue = {
  Vendor: "",
  Vendor_email: "",
  Contact_number: "",
  Address: "",
  City: "",
  State: "",
  Country: "",
  GSTIN: "",
};

function convertDateToString(date) {
  const dateString = date.toISOString().split("T")[0];
  return dateString;
}

const vendors = await get_all_vendor_option();
vendors.shift();

const handleDeleteVendor = async (obj) => {
  const res = await window.api.invoke(
    "delete-vendor-by-contact-number",
    obj.number,
  );
  showmessage(res.message);
};

const VENDOR_ROWS = vendors.map((x) => {
  return {
    "Vendor Name": x.text,
    "Created At": convertDateToString(x.created),
    City: x.city,
    State: x.state,
    "Contact No": x.number,
    Action: (
      <Tooltip content="Delete">
        <Button
          color="white"
          size="xs" // Adjusted button size to xs
          onClick={() => handleDeleteVendor(x)}
          className="py-1 px-2" // Adjusted padding
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
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>
        </Button>
      </Tooltip>
    ),
  };
});
export default function ShowVendors() {
  useEffect(() => {
    document.title = "Show Vendors";
  });

  const [filterValues, setFilterValues] = useState({
    Product: "",
    Type: "",
    Location: "",
  });
  const [fields, setFields] = useState(initialValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [countries, setCountries] = useState(getAllCountry());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const openModal = (data) => {
    setSelectedProduct(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    delete fields.Country;
    const res = await window.api.invoke("add-new-vendor", fields);
    showmessage(res.message);
  };

  const requiredFields = [
    "Vendor",
    "Vendor_email",
    "Contact_number",
    "Address",
    "City",
    "State",
    "GSTIN",
  ];

  const isFormIncomplete = requiredFields.some((field) => fields[field] === "");
  // const nonEmptyValues = () => {
  //   return Object.keys(filterValues).filter((key) => filterValues[key] !== "");
  // };
  // let nonEmptyFields = nonEmptyValues();
  function getTextForValue(option, value) {
    const clients = option;
    const client = clients.find((client) => client.value === value);
    return client ? client.text : "Unknown";
  }
  // const unfilteredData = adjustedData.map((obj) => {
  //   return {
  //     Product: obj.Product,
  //     Description: obj.Description,
  //     Type: obj.Type,
  //     Price: obj.Price,
  //     Location: obj.Location,
  //     Quantity: obj.Quantity,
  //     ActionButton: (
  //       <>
  //         <Tooltip content="View">
  //           <Button
  //             size="xs"
  //             className="py-1 px-2"
  //             style={{ background: "none" }}
  //             onClick={() => openModal(obj)}
  //           >
  //             <svg
  //               class="w-6 h-6 text-gray-800 dark:text-white"
  //               aria-hidden="true"
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 stroke="currentColor"
  //                 stroke-width="2"
  //                 d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
  //               />
  //               <path
  //                 stroke="currentColor"
  //                 stroke-width="2"
  //                 d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  //               />
  //             </svg>
  //           </Button>
  //         </Tooltip>
  //       </>
  //     ),
  //   };
  // });
  // useEffect(() => {
  //   let nonEmptyFields = nonEmptyValues();
  //   let filteredData = adjustedData
  //     .flat()
  //     .filter((object) => {
  //       return nonEmptyFields.every((field) => {
  //         if (field !== "Product") {
  //           return object[field]?.includes(filterValues[field]);
  //         } else {
  //           return object[field] === filterValues[field];
  //         }
  //       });
  //     })
  //     .map((obj) => {
  //       return {
  //         Product: obj.Product,
  //         Description: obj.Description,
  //         Type: obj.Type,
  //         Price: obj.Price,
  //         Location: obj.Location,
  //         Quantity: obj.Quantity,
  //         ActionButton: (
  //           <>
  //             <Tooltip content="View">
  //               <Button
  //                 size="xs"
  //                 className="py-1 px-2"
  //                 style={{ background: "none" }}
  //                 onClick={() => openModal(obj)}
  //               >
  //                 <svg
  //                   class="w-6 h-6 text-gray-800 dark:text-white"
  //                   aria-hidden="true"
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   width="24"
  //                   height="24"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path
  //                     stroke="currentColor"
  //                     stroke-width="2"
  //                     d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
  //                   />
  //                   <path
  //                     stroke="currentColor"
  //                     stroke-width="2"
  //                     d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  //                   />
  //                 </svg>
  //               </Button>
  //             </Tooltip>
  //           </>
  //         ),
  //       };
  //     });
  //   setFilterData(filteredData);
  // }, [filterValues]);

  const handleFilterChange = (fieldName, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };
  const handleFieldChange = (fieldName, value) => {
    setFields((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  //console.log(removeStatusField(VENDOR_ROWS));

  function removeStatusField(objectsArray) {
    // Iterate through each object in the array
    return objectsArray.map((obj) => {
      // Destructure the object to remove the "Status" field
      const { Action, ...rest } = obj;
      // Return the object without the "Status" field
      return rest;
    });
  }

  const exportVendors = async () => {
    try {
      const response = await window.api.invoke(
        "export-vendor-report-to-excel",
        removeStatusField(VENDOR_ROWS),
      );
      if (response?.success) {
        const buffer = response.buffer;
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `export_vendors.xlsx`);
      } else {
        //console.error("Error:", response?.error);
      }
      //console.log("Export response:", response);
    } catch (error) {
      //console.error("Export error:", error);
    }
  };

  const resetFilterValues = () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-col w-full h-full px-5">
      <div className="flex flex-col border border-gray-400 p-3 mb-3">
        <div className="my-2 flex-1">
          <div className="flex items-center">
            <Typography variant="h6">Search Vendor</Typography>
            <HomeButton />
          </div>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div className="flex mr-12 gap-x-2">
            <SelectComp
              label="Vendor"
              options={vendors}
              isInput={false}
              handle={(values) => {
                handleFilterChange("Product", values);
              }}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Type"
              placeholder="Type"
              onChange={(e) => handleFilterChange("Type", e.target.value)}
            />
          </div>
          <div className="flex mr-12 gap-x-2">
            <Input
              variant="outlined"
              label="Location"
              placeholder="Location"
              onChange={(e) => handleFilterChange("Location", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between my-2"></div>
        <div className="flex justify-center">
          <div className="mx-3">
            <Button
              onClick={resetFilterValues}
              style={{ margin: "30px 40px 0 0" }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex my-2 flex-row-reverse">
        <div className="mx-3">
          <Button onClick={() => exportVendors()}>Export</Button>
        </div>
        <div className="mx-3">
          <Button onClick={openModal}>Add New Vendor</Button>
        </div>
      </div>

      <div className="flex flex-1 mb-2">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD_MAIN}
          TABLE_ROWS={VENDOR_ROWS}
        />
      </div>
      <>
        <Dialog size="l" open={isModalOpen} handleOpen={openModal}>
          <DialogHeader toggler={closeModal}>
            Add New Vendor Details
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-1 gap-4">
              {/* Vendor Name */}
              <div>
                <Input
                  variant="outlined"
                  label={
                    <>
                      Vendor Name<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="Vendor Name"
                  onChange={(e) => handleFieldChange("Vendor", e.target.value)}
                />
              </div>
              {/* Vendor Email */}
              <div>
                <Input
                  variant="outlined"
                  label={
                    <>
                      Vendor Email<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  onChange={(e) =>
                    handleFieldChange("Vendor_email", e.target.value)
                  }
                  placeholder="Vendor email"
                />
              </div>
              {/* Contact Number */}
              <div>
                <Input
                  variant="outlined"
                  label={
                    <>
                      Contact Number<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  type="number"
                  onChange={(e) =>
                    handleFieldChange("Contact_number", e.target.value)
                  }
                  placeholder="Contact Number"
                />
              </div>
              {/* Address */}
              <div>
                <Input
                  variant="outlined"
                  label={
                    <>
                      Address<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  onChange={(e) => handleFieldChange("Address", e.target.value)}
                  placeholder="Address"
                ></Input>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                <div className="mb-5">
                  <SelectComp
                    label="Country"
                    isinput={false}
                    options={countries}
                    handle={(values) => {
                      const value = values;
                      setFields((prevState) => ({
                        ...prevState,
                        Country: value,
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
                      setFields((prevState) => ({
                        ...prevState,
                        State: value,
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
                      setFields((prevState) => ({
                        ...prevState,
                        City: value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div>
                <Input
                  variant="outlined"
                  label={
                    <>
                      GSTIN<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  onChange={(e) => handleFieldChange("GSTIN", e.target.value)}
                  placeholder="GSTIN"
                ></Input>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              style={{ marginRight: 5 }}
            >
              Close
            </Button>
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSave}
              disabled={
                fields.Vendor === "" ||
                fields.Vendor_email === "" ||
                fields.Contact_number === "" ||
                fields.Address === "" ||
                fields.City === "" ||
                fields.State === "" ||
                fields.GSTIN === ""
              }
            >
              Save
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  );
}
