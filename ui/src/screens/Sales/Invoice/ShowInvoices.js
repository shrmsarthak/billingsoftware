import {
  Button,
  Select,
  Textarea,
  Typography,
  Option,
  Input,
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
  "Paid/Unpaid",
  "Action",
];

const TABLE_ROWS = [];

const select_option = [];
const payemnt_options = [
  {
    text: "Cash",
    value: "Cash",
  },
  {
    text: "Cheque",
    value: "Cheque",
  },
  {
    text: "Bank Transfer",
    value: "Bank Transfer",
  },
];

let invoices = await get_all_invoices();

let client_option = await get_all_client_option();
client_option.shift();

export default function ShowInvoicePage() {
  useEffect(() => {
    document.title = "Show Invoice";
  });

  const handleSelect = (type, value) => {};
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState(null);
  const [formValues, setFormValues] = useState({
    Document_No: "",
    Transaction_type: "",
    Amount_Paid: "",
    Date_of_payment: "",
  });
  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handlePayNow = (rowData) => {
    setModalData(rowData);
    setOpen(!open);
  };

  const handleDbUpdate = async () => {
    const res = await ipcRenderer.invoke("update-invoice", formValues);
  };
  let filteredArray = invoices.flat().map((obj) => {
    return {
      "Client Name": obj.Client,
      "Invoice No": obj.Document_No,
      "Issue Date": obj.Issue_Date,
      "Due Date": obj.Due_Date,
      Amount: obj.Total_BeforeTax,
      Tax: obj.Total_Tax,
      "Shipping Cost": obj.Shipping_Charges,
      Total: (
        Number(obj.Total_BeforeTax) +
        Number(obj.Total_Tax) +
        Number(obj.Shipping_Charges)
      ).toFixed(2),
      Status:
        Number(obj.Total_BeforeTax) +
          Number(obj.Total_Tax) +
          Number(obj.Shipping_Charges) -
          obj.Amount_Paid <=
        0 ? (
          <p style={{ color: "green" }}>Paid</p>
        ) : (
          <p style={{ color: "orangered" }}>Unpaid</p>
        ),
      "Private Notes": obj.Private_Notes,
      Emailed: "",
      "Amount Paid": obj.Amount_Paid,
      Balance: (
        Number(obj.Total_BeforeTax) +
        Number(obj.Total_Tax) +
        Number(obj.Shipping_Charges) -
        obj.Amount_Paid
      ).toFixed(2),
      "Date of payment": obj.Date_of_payment,
      type: obj.Transaction_type,
      ActionButton: (
        <Button
          size="xs"
          className="py-1 px-2"
          style={{ background: "none" }}
          onClick={() => handlePayNow(obj)}
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
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>
        </Button>
      ),
      Action: obj.rowData[0].Action, // Assuming Action is from rowData
    };
  });

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
  const AmountPaidHandler = async (e, doc_no) => {
    handleInputChange("Amount_Paid", e.target.value);
    handleInputChange("Document_No", doc_no);
  };

  console.log(invoices);

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
                if (value.select === "*") {
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
      {/* Modal */}
      <Dialog open={open} handler={handlePayNow}>
        <DialogHeader>Payment Details</DialogHeader>
        <DialogBody>
          {modalData && (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <p>Client Name: {modalData.Client}</p>
                <p>Invoice No: {modalData.Document_No}</p>
              </div>
              <div className="flex flex-row items-center">
                <SelectComp
                  label="Payment Type"
                  options={payemnt_options}
                  isinput={false}
                  handle={(values) => {
                    handleInputChange("Transaction_type", values.select);
                  }}
                />
              </div>
              <div className="flex flex-row items-center">
                <Input
                  variant="outlined"
                  label="Amount Paid"
                  placeholder="Amount Paid"
                  onChange={(e) => AmountPaidHandler(e, modalData.Document_No)}
                />
              </div>
              <div className="flex flex-row items-center">
                <Input
                  variant="outlined"
                  label="Pay Date"
                  placeholder="Pay to"
                  type="date"
                  onChange={(e) =>
                    handleInputChange("Date_of_payment", e.target.value)
                  }
                />
              </div>
              {/* Add any other components here */}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            color="blue"
            onClick={handleDbUpdate}
            style={{ marginRight: 25 }}
          >
            Pay
          </Button>
          <Button color="red" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
