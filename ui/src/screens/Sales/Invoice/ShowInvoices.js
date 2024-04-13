import {
  Button,
  Select,
  Textarea,
  Typography,
  Option,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import { ProductInvoiceTable } from "../components/ProductInvoiceTable";
import SelectComp from "../components/SelectComp";
import { api_new_client, api_new_invoice } from "../../../utils/PageApi";
import {
  get_all_client_option,
  get_all_product_option,
  tax_type,
  uom_type,
  get_all_invoices,
} from "../../../utils/SelectOptions";
const { ipcRenderer } = window.require("electron");

const TABLE_HEAD = [
  "No",
  "Client Name",
  "Invoice No",
  "Issue Date",
  "Due Date",
  "Amount",
  "Tax",
  "Shipping",
  "Total",
  "Status",
  "Private Notes",
  "Emailed",
  "Amount Paid",
  "Balance",
  "Date of payemnt",
  "type",
  "Action",
];

const TABLE_ROWS = [];

const select_option = [];

let invoices = await get_all_invoices();
let filteredArray = invoices.flat().map((obj) => {
  return {
    "Client Name": obj.Client,
    "Invoice No": obj.Document_No, // Assuming Document_No is the invoice number
    "Issue Date": obj.Issue_Date,
    "Due Date": obj.Due_Date,
    Amount: obj.Total_BeforeTax, // Assuming there's only one item in rowData
    Tax: obj.Total_Tax,
    "Shipping Cost": obj.Shipping_Charges,
    Total: (
      Number(obj.Total_BeforeTax) +
      Number(obj.Total_Tax) +
      Number(obj.Shipping_Charges)
    ).toFixed(2),
    Status: "unpaid", // You need to define how status is determined
    "Private Notes": obj.Private_Notes,
    Emailed: "", // You need to define how this is determined
    "Amount Paid": "", // You need to define this
    Balance: "", // You need to define this
    "Date of payment": "", // You need to define this
    type: "", // You need to define this-----------------------------remove
    Action: obj.rowData[0].Action, // Assuming Action is from rowData
  };
});
let client_option = await get_all_client_option();
client_option.shift();
let shiping_option = [];
let product_option = await get_all_product_option();
let tax_option = tax_type();
let uom_option = uom_type();

export default function ShowInvoicePage() {
  useEffect(() => {
    document.title = "Show Invoice";
  });
  const handleSelect = (type, value) => {
    console.log(type, value);
  };
  console.log(JSON.stringify(invoices));

  function getDocumentNoAtIndex(index) {
    if (index >= 0 && index < filteredArray.flat().length) {
      return filteredArray.flat()[index]["Invoice No"];
    } else {
      return "Invalid index";
    }
  }
  const handleDeleteInvoice = async (index) => {
    if (getDocumentNoAtIndex(index) !== "Invalid index") {
      const res = await ipcRenderer.invoke(
        "delete-invoice-by-Document-no",
        getDocumentNoAtIndex(index)
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full px-5">
      <div className="flex flex-col border border-gray-400 p-3 mb-3">
        <div className="my-2 flex-1">
          <Typography variant="h6">Search Invoice</Typography>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div>Client Name</div>
          <div className="mr-12">
            <SelectComp
              label="Client"
              options={client_option}
              isinput={false}
              handle={(value) => {
                if (value.select == "*") {
                  api_new_client();
                  return;
                }
              }}
            />
          </div>

          <div className="flex mr-12 gap-x-2">
            <Input
              variant="outlined"
              label="Issue From"
              placeholder="Issue Date"
              type="date"
            />

            <Input
              variant="outlined"
              label="Issue To "
              placeholder="Issue Date"
              type="date"
            />
          </div>
          <div className="flex mr-12 gap-x-2">
            <Input
              variant="outlined"
              label="PO Date"
              placeholder="Due from"
              type="date"
            />
            <Input
              variant="outlined"
              label="Due Date"
              placeholder="Due to"
              type="date"
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between my-2">
          <div className="mr-12">
            <SelectComp
              label="Status"
              options={select_option}
              isinput={false}
              handle={handleSelect}
            />
          </div>
          <div className=" mr-12">
            <Input
              variant="outlined"
              label="Invoice Number"
              placeholder="PO Number"
            />
          </div>
          <div className="mr-12">
            <SelectComp
              label="Type"
              options={select_option}
              isinput={false}
              handle={handleSelect}
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-between my-2">
          <div className="mr-12">
            <SelectComp
              label="City"
              options={select_option}
              isinput={false}
              handle={handleSelect}
            />
          </div>
          <div className="mr-12">
            <Input
              variant="outlined"
              label="Quick Search"
              placeholder="Due Date"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mx-3">
            <Button>Search</Button>
          </div>
          <div className="mx-3">
            <Button>Reset</Button>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex my-2 flex-row-reverse">
        <div className="mx-3">
          <Button>Export</Button>
        </div>
        <div className="mx-3">
          <Button onClick={api_new_invoice}>New Invoice</Button>
        </div>
      </div>

      <div className="flex flex-1 mb-2 h-full">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD}
          TABLE_ROWS={filteredArray}
          handleDeleteRow={handleDeleteInvoice}
        />
      </div>
    </div>
  );
}
