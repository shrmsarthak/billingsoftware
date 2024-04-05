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
} from "../../../utils/SelectOptions";
import { api_new_client, api_new_product } from "../../../utils/PageApi";
import Invoice from "../components/Invoice";
import { PDFViewer } from "@react-pdf/renderer";
import ReactDOM from "react-dom"; // Add this import

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
  {
    text: "Due On The Specified Date",
    value: "Due On The Specified Date",
  },
];

let invoice = {};
let client_option = await get_all_client_option();
let shiping_option = [];
let product_option = await get_all_product_option();
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
    Tax: "",
    Notes: "",
    Private_Notes: "",
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
  const [discountValue, setDiscountValue] = useState(""); // State to track input field value

  // Update discountValue state when input field value changes
  const handleDiscountInputChange = (e) => {
    setDiscountValue(e.target.value);
    updateRowsWithDiscount(e.target.value);
  };

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
        Discount: discount ? `${discount}%` : item.Discount, // Update Discount field
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
      discountValue !== ""
        ? discountValue + "%"
        : item.Discount
        ? item.Discount + "%"
        : "0%",
    CGST: (
      ((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
      9
    ).toFixed(2),
    SGST: (
      ((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
      10
    ).toFixed(2),
    IGST: (
      ((item.Discount === ""
        ? item.Unit_Price * (item.Qty || 1)
        : item.Unit_Price *
          (item.Qty || 1) *
          (1 - parseFloat(item.Discount) / 100)) /
        100) *
      11
    ).toFixed(2),
    Action: "DELETE",
  }));

  // Calculate total value
  const totalValue = rowData
    .reduce((accumulator, currentItem) => {
      const value = parseFloat(currentItem.Value);
      const cgst = parseFloat(currentItem.CGST);
      const sgst = parseFloat(currentItem.SGST);
      const igst = parseFloat(currentItem.IGST);

      // Add Value, CGST, SGST, and IGST to the accumulator
      return accumulator + value + cgst + sgst + igst;
    }, 0)
    .toFixed(2);
  // Move .toFixed(2) outside the reduce function

  console.log(JSON.stringify(rowData));

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
    const month = ("0" + (today.getMonth() + 1)).slice(-2); // Get month with leading zero if needed
    const hours = ("0" + today.getHours()).slice(-2); // Get hours with leading zero if needed
    const minutes = ("0" + today.getMinutes()).slice(-2); // Get minutes with leading zero if needed
    const monthAbbreviation = today
      .toLocaleString("default", { month: "short" })
      .toUpperCase(); // Get month abbreviation

    const generatedValue = `${day}${month}${monthAbbreviation}${hours}${minutes}`;

    handleFieldChange("Document_No", generatedValue);
  };

  useEffect(() => {
    generateFieldValue();
  }, []);

  const openInvoicePreviewWindow = () => {
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
    <div className="flex flex-col w-full h-full px-5">
      <div className="flex flex-col border border-gray-400 p-3 mb-3">
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

      <div className="flex w-full flex-row">
        <div className="">
          <div className="flex items-center">
            <div>
              <Checkbox
                label="Discount on all"
                checked={discountOnAll}
                onChange={() => setDiscountOnAll(!discountOnAll)}
              />
            </div>
            {discountOnAll && (
              <div>
                <input
                  type="number"
                  value={discountValue}
                  onChange={handleDiscountInputChange}
                  placeholder="Enter discount"
                  style={{
                    width: 50,
                    height: 25,
                    marginRight: 2,
                    marginLeft: 15,
                    border: "1px solid",
                  }}
                />
                %
              </div>
            )}
          </div>
          <div className="flex items-center">
            <div className="mr-7">
              <Checkbox label="Add Shipping & Packaging Cost" />
            </div>
          </div>
        </div>
        <div className="flex ml-10">
          <div className="mr-5">
            <Textarea
              label="Notes"
              onChange={(e) => handleFieldChange("Notes", e.target.value)}
            />
          </div>
          <div className="mr-5">
            <Textarea
              label="Private Notes"
              onChange={(e) =>
                handleFieldChange("Private_Notes", e.target.value)
              }
            />
          </div>
          <div
            className="py-2 self-end"
            style={{
              width: "500px",
              marginLeft: "100px",
              display: "grid",
              alignContent: "center",
              justifyContent: "end",
              justifyItems: "start",
            }}
          >
            Total: &#8377;{totalValue}
            <Button
              onClick={openInvoicePreviewWindow}
              disabled={rows.length === 0}
            >
              Preview Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
