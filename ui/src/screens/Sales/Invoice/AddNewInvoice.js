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
    Issue_Date: "",
    Ship_To: "",
    PO_Number: "",
    Payment_Term: "",
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
  };

  const [formData, setFormData] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  const handleButtonClick = () => {
    setShowInvoice(true);
  };

  const rowData = rows.map((item) => [
    {
      Product: item.Product,
      HSNSAC: "HSN0" + item.Product.substring(0, 3),
      Description: item.Description ? item.Description : "Sample Service Description",
      UoM: item.UoM ? item.UoM : "Boxes",
      Qty: item.Qty ? item.Qty : "1",
      UnitPrice: item.Unit_Price ? item.Unit_Price : "1.00",
      // Calculate value based on discount
      Value:
        item.Discount === ""
          ? (item.Unit_Price * item.Qty).toFixed(2) // Round to two decimal points
          : (item.Unit_Price * item.Qty * (1 - parseFloat(item.Discount) / 100)).toFixed(2), // Round to two decimal points
      Discount: item.Discount ? item.Discount + "%" : "0%",
      // Calculate CGST, SGST, and IGST based on the discounted value
      CGST:
        (((item.Discount === ""
          ? item.Unit_Price * item.Qty
          : item.Unit_Price * item.Qty * (1 - parseFloat(item.Discount) / 100)) /
          100) *
          9).toFixed(2), // Round to two decimal points
      SGST:
        (((item.Discount === ""
          ? item.Unit_Price * item.Qty
          : item.Unit_Price * item.Qty * (1 - parseFloat(item.Discount) / 100)) /
          100) *
          10).toFixed(2), // Round to two decimal points
      IGST:
        (((item.Discount === ""
          ? item.Unit_Price * item.Qty
          : item.Unit_Price * item.Qty * (1 - parseFloat(item.Discount) / 100)) /
          100) *
          11).toFixed(2), // Round to two decimal points
      Action: "icon",
    },
  ]);
  
  // Calculate total value
  const totalValue = rowData.reduce((accumulator, currentItem) => {
    return accumulator + parseFloat(currentItem[0].Value);
  }, 0);

  console.log("Total Value:", totalValue);

  console.log("data", JSON.stringify(rows));
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
  const data = [
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Solar Panel",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "100",
      Discount: "10",
      Tax: "",
    },
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Battery",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "85",
      Discount: "20",
      Tax: "",
    },
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Battery",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "85",
      Discount: "20",
      Tax: "",
    },
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Battery",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "85",
      Discount: "20",
      Tax: "",
    },
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Battery",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "85",
      Discount: "20",
      Tax: "",
    },
    {
      Client: "Rishabh",
      Document_No: "101",
      Issue_Date: "2024-03-31",
      Ship_To: "",
      PO_Number: "",
      Payment_Term: "",
      PO_Date: "2024-04-02",
      Due_Date: "2024-04-06",
      Place_Of_Supply: "",
      Product: "Battery",
      Description: "",
      UoM: "",
      Qty: "10",
      Unit_Price: "85",
      Discount: "20",
      Tax: "",
    }
  ];
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
            data={data}
            details={{
              Client: "Rishabh",
              Document_No: "101",
              Issue_Date: "2024-03-31",
              Ship_To: "",
              PO_Number: "",
              PO_Date: "2024-04-02",
              Due_Date: "2024-04-06",
              Place_Of_Supply: "",
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
              onChange={(e) => handleFieldChange("Document_No", e.target.value)}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Issue Date"
              placeholder="Issue Date"
              type="date"
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
              options={select_option}
              isinput={false}
              handle={(values) => {
                handleFieldChange(
                  "Payment_Term",
                  getTextForValue(select_option, values.select)
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
              onChange={(e) => handleFieldChange("Unit_Price", e.target.value)}
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
            <Button onClick={() => setRows((pre) => [...pre, formData])}>
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
        />
      </div>

      <div className="flex w-full flex-row">
        <div className="">
          <div className="flex items-center">
            <div className="mr-5">
              <Checkbox label="Total Quantity" />
            </div>

            <SelectComp
              label=""
              options={select_option}
              isinput={true}
              // handle={handleSelect}
            />
          </div>
          <div className="flex items-center">
            <div>
              <Checkbox label="Discount on all" />
            </div>
            <div>
              <input className="border border-gray-600 w-32 mx-2" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-7">
              <Checkbox label="Add Shoping and Packaeg Cost" />
            </div>
            <div className="">
              <SelectComp
                label="Client"
                options={select_option}
                isinput={true}
                // handle={handleSelect}
              />
            </div>
          </div>
        </div>

        <div className="">
          <div>
            <Checkbox label="Show CESS" />
          </div>
          <div>
            <Checkbox label="Subject to reverse charges" />
          </div>
          <div className="flex w-16">
            <Checkbox />

            <SelectComp
              label="Client"
              options={select_option}
              isinput={false}
              // handle={handleSelect}
            />
          </div>
        </div>
        <div className="flex ml-10">
          <div className="mr-5">
            <Textarea label="Notes" />
          </div>
          <div className="mr-5">
            <Textarea label="Private Notes" />
          </div>
          <div className="py-2 self-end">
            Total: &#8377;{totalValue}
            <Button onClick={openInvoicePreviewWindow}>Preview Document</Button>
            <div>
              {showInvoice && (
                <PDFViewer
                  style={{
                    width: "100%",
                    height: "100vh",
                    position: "absolute",
                  }}
                >
                  <Invoice
                    data={data}
                    details={{
                      Client: "Rishabh",
                      Document_No: "101",
                      Issue_Date: "2024-03-31",
                      Ship_To: "",
                      PO_Number: "",
                      PO_Date: "2024-04-02",
                      Due_Date: "2024-04-06",
                      Place_Of_Supply: "",
                    }}
                  />
                </PDFViewer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
