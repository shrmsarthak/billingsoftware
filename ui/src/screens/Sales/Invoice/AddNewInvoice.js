import {
  Button,
  Select,
  Textarea,
  Typography,
  Option,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { ProductInvoiceTable } from "../components/ProductInvoiceTable";
// import { Table } from "../components/Table";
import SelectComp from "../components/SelectComp";
import {
  get_all_client_option,
  get_all_product_option,
  tax_type,
  uom_type,
  get_all_invoices,
} from "../../../utils/SelectOptions";
import { api_new_client, api_new_product } from "../../../utils/PageApi";
import Invoice from "../components/Invoice";
import { PDFViewer } from "@react-pdf/renderer";
import ReactDOM from "react-dom"; // Add this import
const { ipcRenderer } = window.require("electron");

const TABLE_HEAD = [
  "No",
  "Product Service",
  "HSNSAC",
  "Description",
  "UoM",
  "Qty",
  "Unit Price",
  "Value",
  "Discount",
  "CGST",
  "SGST",
  "IGST",
  "Action",
];

const select_option = [];

const payemnt_options = [
  {
    text: "7 days",
    value: "7 days",
  },
  {
    text: "10 days",
    value: "10 days",
  },
  {
    text: "15 days",
    value: "15 days",
  },
  {
    text: "30 days",
    value: "30 days",
  },
  {
    text: "45 days",
    value: "45 days",
  },
  {
    text: "60 days",
    value: "60 days",
  },
  {
    text: "90 days",
    value: "90 days",
  },
];

let invoice = {};
let client_option = await get_all_client_option();
let shiping_option = [];
let product_option = await get_all_product_option();
let invoices = await get_all_invoices();
let tax_option = tax_type();
let uom_option = uom_type();
export default function NewInvoicePage() {
  useEffect(() => {
    document.title = "New Invoice";
  });
  const initialValues = {
    Client: "",
    Document_No: "",
    Issue_Date: new Date().toISOString().split("T")[0],
    Ship_To: "",
    PO_Number: "",
    Payment_Term: "30 days",
    PO_Date: "",
    Due_Date: "",
    Place_Of_Supply: "",
    Product: "",
    Description: "",
    UoM: "",
    Qty: "",
    Unit_Price: "",
    Discount: "",
    Tax: "GST Rate 18%",
    Notes: "",
    Private_Notes: "",
    Shipping_Charges: 0,
    Shipping_Tax: 0,
  };
  const [formData, setFormData] = useState(initialValues);
  useEffect(() => {
    // Convert the issue date to a Date object
    const issueDate = new Date(formData.Issue_Date);

    // Extract the number of days from the Payment_Term string
    const paymentTermParts = formData.Payment_Term.split(" ");
    const daysToAdd = parseInt(paymentTermParts[0]);

    // Check if daysToAdd is a valid number
    if (isNaN(daysToAdd)) {
      // Handle invalid payment term
      console.error("Invalid Payment_Term:", formData.Payment_Term);
      return;
    }

    // Check if issueDate is a valid date
    if (isNaN(issueDate.getTime())) {
      // Handle invalid issue date
      console.error("Invalid Issue_Date:", formData.Issue_Date);
      return;
    }

    // Calculate the due date by adding days to the issue date
    const dueDate = new Date(
      issueDate.setDate(issueDate.getDate() + daysToAdd)
    );

    // Check if dueDate is a valid date
    if (isNaN(dueDate.getTime())) {
      // Handle invalid due date
      return;
    }

    // Format the due date as YYYY-MM-DD
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    // Update the formData state with the calculated due date
    setFormData((prevFormData) => ({
      ...prevFormData,
      Due_Date: formattedDueDate,
    }));
  }, [formData.Issue_Date, formData.Payment_Term]);

  const [rows, setRows] = useState([]);
  const [discountOnAll, setDiscountOnAll] = useState(false);
  const [discountValue, setDiscountValue] = useState(-1);
  const handleDiscountInputChange = (e) => {
    setDiscountValue(e.target.value);
    updateRowsWithDiscount(e.target.value);
  };
  const [shippingChecked, setShippingChecked] = useState(false);

  const updateRowsWithDiscount = (discount) => {
    const updatedRows = rows.map((item) => {
      const discountPercentage = parseFloat(discount) || 0;
      const discountedUnitPrice =
        parseFloat(item.UnitPrice) * (1 - discountPercentage / 100);
      const discountedValue = discountedUnitPrice * parseFloat(item.Qty);
      const cgst = discountedValue * 0.09;
      const sgst = discountedValue * 0.1;
      const igst = discountedValue * 0.11;

      return {
        ...item,
        Discount: discount ? `${discount}%` : 0, // Update Discount field
        Value: discountedValue.toFixed(2),
        CGST: cgst.toFixed(2),
        SGST: sgst.toFixed(2),
        IGST: igst.toFixed(2),
      };
    });

    setRows(updatedRows);
  };
  const handleDeleteRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };
  function getIntegerFromPercentageString(percentageString) {
    // Using a regular expression to extract the integer before '%'
    const match = percentageString.match(/\d+/);

    // Checking if a match is found
    if (match) {
      // Extracting the matched integer and converting it to a number
      const integer = parseInt(match[0], 10);
      return integer;
    }

    // If no match is found, return NaN or any other default value as needed
    return NaN;
  }

  const rowData = rows.map((item, index) => ({
    Product: item.Product,
    HSNSAC: "HSN-" + item.Product.substring(0, 3),
    Description: item.Description || "Sample Service Description",
    UoM: item.UoM || "Boxes",
    Qty: item.Qty ? item.Qty : "1",
    UnitPrice: item.Unit_Price ? item.Unit_Price : "1.00",
    Value:
      item.Discount === ""
        ? (item.Unit_Price * (item.Qty || 1)).toFixed(2)
        : (
            item.Unit_Price *
            (item.Qty || 1) *
            (1 - parseFloat(item.Discount) / 100)
          ).toFixed(2),
    Discount:
      discountValue !== -1
        ? discountValue + "%"
        : item.Discount
        ? item.Discount + "%"
        : "0%",
    CGST: (
      (((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
        getIntegerFromPercentageString(item.Tax)) /
      2
    ).toFixed(2),
    SGST: (
      (((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
        getIntegerFromPercentageString(item.Tax)) /
      2
    ).toFixed(2),
    IGST: (
      ((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
      9
    ).toFixed(2),
    Action: "DELETE",
  }));

  console.log(JSON.stringify(formData));

  // Calculate total value
  const totalValue = rowData
    .reduce((accumulator, currentItem) => {
      const value = parseFloat(currentItem.Value);
      return accumulator + value;
    }, 0)
    .toFixed(2);

  const totalTax = rowData
    .reduce((accumulator, currentItem) => {
      const cgst = parseFloat(currentItem.CGST);
      const sgst = parseFloat(currentItem.SGST);
      const igst = parseFloat(currentItem.IGST);

      return accumulator + cgst + sgst + igst;
    }, 0)
    .toFixed(2);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  function getTextForValue(option, value) {
    const clients = option;
    const client = clients.find((client) => client.value === value);
    return client ? client.text : "Unknown";
  }
  const getProductUOM = (productText, data) => {
    const product = data.find((item) => item.text === productText);
    return product ? product.uom : null;
  };
  const getProductPrice = (productText, data) => {
    const product = data.find((item) => item.text === productText);
    return product ? product.price : null;
  };
  const generateFieldValue = () => {
    const today = new Date();
    const day = ("0" + today.getDate()).slice(-2); // Get day with leading zero if needed
    const hours = ("0" + today.getHours()).slice(-2); // Get hours with leading zero if needed
    const minutes = ("0" + today.getMinutes()).slice(-2); // Get minutes with leading zero if needed
    const monthAbbreviation = today
      .toLocaleString("default", { month: "short" })
      .toUpperCase(); // Get month abbreviation

    const generatedValue = `${day}${monthAbbreviation}-${hours}${minutes}`;

    handleFieldChange("Document_No", generatedValue);
  };

  useEffect(() => {
    generateFieldValue();
  }, []);
  useEffect(() => {
    if (!shippingChecked) {
      handleFieldChange("Shipping_Charges", 0);
      handleFieldChange("Shipping_Tax", 0);
    }
  }, [shippingChecked]);
  useEffect(() => {
    if (!discountOnAll) {
      setDiscountValue(-1);
      updateRowsWithDiscount(0); // Use false instead of 0
    }
  }, [discountOnAll]);

  const openInvoicePreviewWindow = async () => {
    const invoiceData = {
      rowData: rowData,
      Client: formData.Client,
      Document_No: formData.Document_No,
      Issue_Date: formData.Issue_Date,
      Ship_To: formData.Ship_To,
      PO_Number: formData.PO_Number,
      Payment_Term: formData.Payment_Term,
      PO_Date: formData.PO_Date,
      Due_Date: formData.Due_Date,
      Place_Of_Supply: formData.Place_Of_Supply,
      Notes: formData.Notes,
      Private_Notes: formData.Private_Notes,
      Shipping_Charges: formData.Shipping_Charges,
      Shipping_Tax: formData.Shipping_Tax,
      Discount_on_all: formData.Discount_on_all,
    };
    const res = await ipcRenderer.invoke("add-new-invoice", invoiceData);
    console.log(res);
    const win = window.open("", "_blank");
    win.document.title = "Invoice Preview";
    win.document.body.style.margin = "0";
    win.document.body.style.padding = "0";
    win.document.body.style.overflow = "hidden";
    win.document.body.innerHTML = `
      <div id="root"></div>
    `;
    ReactDOM.render(
      <React.StrictMode>
        <PDFViewer
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
          }}
        >
          <Invoice
            data={rowData.flat()}
            details={{
              Client: formData.Client,
              Issue_Date: formData.Issue_Date,
              Document_No: formData.Document_No,
              Ship_To: formData.Ship_To,
              PO_Number: formData.PO_Number,
              PO_Date: formData.PO_Date,
              Due_Date: formData.Due_Date,
              Payment_Term: formData.Payment_Term,
              Place_Of_Supply: formData.Place_Of_Supply,
              Notes: formData.Notes,
            }}
          />
        </PDFViewer>
      </React.StrictMode>,
      win.document.getElementById("root")
    );
  };
  return (
    <div className="flex flex-col w-full h-full px-1">
      {" "}
      {/* Decrease the padding */}
      <div className="flex flex-col border border-gray-400 p-1 mb-1">
        <div className="my-2 flex-1">
          <Typography variant="h6">Document Data</Typography>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div className=" mr-12">
            <SelectComp
              label="Client"
              options={client_option}
              isinput={false}
              handle={(values) => {
                if (values.select == "*") {
                  api_new_client();
                  return;
                } else {
                  handleFieldChange(
                    "Client",
                    getTextForValue(client_option, values.select)
                  );
                }
              }}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Document No"
              placeholder="Document No"
              value={formData.Document_No}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Issue Date"
              placeholder="Issue Date"
              type="date"
              value={formData.Issue_Date}
              onChange={(e) => handleFieldChange("Issue_Date", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between my-2">
          <div className="mr-12">
            <SelectComp
              label="Ship To"
              options={select_option}
              isinput={false}
              handle={(values) => {
                handleFieldChange(
                  "Ship_To",
                  getTextForValue(select_option, values.select)
                );
              }}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="PO Number"
              placeholder="PO Number"
              onChange={(e) => handleFieldChange("PO_Number", e.target.value)}
            />
          </div>
          <div className=" mr-12">
            <SelectComp
              label="Payment Term"
              options={payemnt_options}
              isinput={false}
              value={formData.Payment_Term}
              handle={(values) => {
                handleFieldChange(
                  "Payment_Term",
                  getTextForValue(payemnt_options, values.select)
                );
              }}
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between my-2">
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="PO Date"
              placeholder="PO Date"
              type="date"
              onChange={(e) => handleFieldChange("PO_Date", e.target.value)}
            />
          </div>
          <div className="mr-12">
            <Input
              variant="outlined"
              label="Due Date"
              placeholder="Due Date"
              type="date"
              value={formData.Due_Date}
              onChange={(e) => handleFieldChange("Due_Date", e.target.value)}
            />
          </div>
          <div className=" mr-12">
            <SelectComp
              label="Place Of Supply"
              options={select_option}
              isinput={false}
              handle={(values) => {
                handleFieldChange(
                  "Place_Of_Supply",
                  getTextForValue(select_option, values.select)
                );
              }}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="my-2 ">
        <div className="flex my-2">
          <div className="mr-12">
            <SelectComp
              label="Product"
              options={product_option}
              isinput={false}
              handle={(values) => {
                if (values.select == "*") {
                  api_new_product();
                  return;
                } else {
                  handleFieldChange(
                    "Product",
                    getTextForValue(product_option, values.select)
                  );
                  handleFieldChange(
                    "Unit_Price",
                    getProductPrice(
                      getTextForValue(product_option, values.select),
                      product_option
                    )
                  );
                }
              }}
            />
          </div>
          <div className="mr-12">
            <Input
              variant="outlined"
              label="Description"
              placeholder="Description"
              onChange={(e) => handleFieldChange("Description", e.target.value)}
            />
          </div>
          <div className="mr-12">
            <SelectComp
              label="UoM"
              options={uom_option}
              isinput={false}
              handle={(values) => {
                handleFieldChange(
                  "UoM",
                  getTextForValue(uom_option, values.select)
                );
              }}
            />
          </div>
          <div className="mr-12">
            <Input
              variant="outlined"
              label="Qty"
              placeholder="Qty"
              onChange={(e) => handleFieldChange("Qty", e.target.value)}
            />
          </div>
          <div className="mr-12">
            <Input
              variant="outlined"
              label="Unit Price"
              placeholder="Unit Price"
              value={
                formData.Product !== ""
                  ? getProductPrice(formData.Product, product_option)
                  : ""
              }
            />
          </div>
        </div>
        <div className="flex">
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Discount"
              placeholder="Discount"
              onChange={(e) => handleFieldChange("Discount", e.target.value)}
            />
          </div>
          <div className="mr-12">
            <SelectComp
              label="Tax"
              options={tax_option}
              isinput={false}
              handle={(values) => {
                handleFieldChange(
                  "Tax",
                  getTextForValue(tax_option, values.select)
                );
              }}
            />
          </div>

          <div className="mr-12">
            <Button
              onClick={() => setRows((pre) => [...pre, formData])}
              disabled={formData.Client === "" || formData.Product === ""}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-1 mb-2 h-full">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD}
          TABLE_ROWS={rowData.flat()}
          handleDeleteRow={handleDeleteRow}
        />
      </div>
      <div
        className="flex w-full flex-row"
        style={{ justifyContent: "space-between" }}
      >
        {/* First Column */}
        <div className="mr-10">
          <div className="flex flex-col">
            <div className="flex items-center">
              <div>
                <Checkbox
                  label="Discount on all"
                  checked={discountOnAll}
                  onChange={() => setDiscountOnAll(!discountOnAll)}
                />
                {discountOnAll && (
                  <div className="flex items-center" style={{ maxWidth: 120 }}>
                    <Input
                      type="number"
                      value={discountValue === -1 ? 0 : discountValue}
                      label="Enter discount"
                      onChange={handleDiscountInputChange}
                      placeholder="Enter discount"
                    />
                    %
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="mr-7">
                <Checkbox
                  label="Add Shipping & Packaging Cost"
                  onChange={() => setShippingChecked(!shippingChecked)}
                  checked={shippingChecked}
                />
                {shippingChecked && (
                  <div className="flex items-center" style={{ maxWidth: 120 }}>
                    <Input
                      variant="outlined"
                      label="Shipping Charges"
                      type="number"
                      placeholder="Shipping Charges"
                      onChange={(e) =>
                        handleFieldChange("Shipping_Charges", e.target.value)
                      }
                    />
                    <SelectComp
                      label="Shipping Tax"
                      options={tax_option}
                      isinput={false}
                      handle={(values) => {
                        handleFieldChange(
                          "Shipping_Tax",
                          getIntegerFromPercentageString(
                            getTextForValue(tax_option, values.select)
                          )
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Second Column */}
        <div className="mr-10">
          <div className="flex flex-col">
            <div className="mr-5">
              <Textarea
                label="Notes"
                onChange={(e) => handleFieldChange("Notes", e.target.value)}
              />
            </div>
            <div className="mr-5 mt-3">
              <Textarea
                label="Private Notes"
                onChange={(e) =>
                  handleFieldChange("Private_Notes", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        {/* Third Column */}
        <div className="py-2 self-end" style={{ marginRight: 40 }}>
          <div style={{ textAlign: "left", marginRight: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "10px",
              }}
            >
              <div>Total Before Tax:</div>
              <div style={{ textAlign: "right" }}>&#8377;{totalValue}</div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "10px",
              }}
            >
              <div>Total Tax</div>
              <div style={{ textAlign: "right" }}>
                &#8377;{totalTax ? totalTax : "0.00"}
              </div>
            </div>
            {formData.Shipping_Charges !== 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "10px",
                }}
              >
                <div>Shipping Charges:</div>
                <div style={{ textAlign: "right" }}>
                  &#8377;{formData.Shipping_Charges}
                </div>
              </div>
            )}
            {formData.Shipping_Charges !== 0 && formData.Shipping_Tax !== 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "10px",
                }}
              >
                <div>Shipping Tax @{formData.Shipping_Tax}:</div>
                <div style={{ textAlign: "right" }}>
                  &#8377;
                  {(
                    (formData.Shipping_Charges / 100) *
                    formData.Shipping_Tax
                  ).toFixed(2)}
                </div>
              </div>
            )}
            <br />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "10px",
                fontWeight: 600,
              }}
            >
              <div>Total:</div>
              <div style={{ textAlign: "right" }}>
                &#8377;
                {(
                  Number(totalValue) +
                    Number(totalTax) +
                    Number(formData.Shipping_Charges) ||
                  0 +
                    Number(
                      (formData.Shipping_Charges / 100) * formData.Shipping_Tax
                    ) ||
                  0
                ).toFixed(2)}
              </div>
            </div>
          </div>
          <Button
            onClick={openInvoicePreviewWindow}
            disabled={rows.length === 0}
          >
            Preview & Save Document
          </Button>
        </div>
      </div>
    </div>
  );
}
