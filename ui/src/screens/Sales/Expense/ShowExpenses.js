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
import { get_all_expenses } from "../../../utils/SelectOptions";
import { saveAs } from "file-saver";
import HomeButton from "../../../assets/Buttons/HomeButton";
const { ipcRenderer } = window.require("electron");

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
  "Person Name",
  "Expense Type",
  "Amount",
  "Date",
  "Notes",
  "Action",
];

const initialValue = {
  Person_name: "",
  Expense_type: "",
  Amount: "",
  Date: "",
  Notes: "",
};

function convertDateToString(date) {
  console.log(date);
  const dateString = date.toISOString().split("T")[0];
  return dateString;
}

const allExpenses = await get_all_expenses();

export default function ShowExpenses() {
  useEffect(() => {
    document.title = "Show Expense";
  });

  console.log(allExpenses);

  const [expenseRows, setExpensesRows] = useState([]);
  console.log(expenseRows);

  useEffect(() => {
    if (allExpenses.length > 0) {
      console.log("inside if");
      const EXPENSES_ROWS = allExpenses.flat().map((x) => {
        console.log(x);
        return {
          "Person Name": x.Person_name,
          "Expense Type": x.Expense_type,
          Amount: x.Amount,
          Date: x.Date ? convertDateToString(x.Date) : "",
          Notes: x.Notes,
          Action: (
            <Tooltip content="Delete">
              <Button
                color="white"
                size="xs" // Adjusted button size to xs
                // onClick={() => handleDeleteInvoice(obj)}
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

      // Set the state with the generated rows
      setExpensesRows(EXPENSES_ROWS);
    }
  }, [allExpenses]);

  //console.log(JSON.stringify(combinedArray));
  const [filterValues, setFilterValues] = useState({
    Product: "",
    Type: "",
    Location: "",
  });
  const [fields, setFields] = useState(initialValue);
  //console.log(filterValues);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const openModal = (data) => {
    setSelectedProduct(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    const res = await ipcRenderer.invoke("add-new-expense", fields);
    alert(res.message);
  };

  function getTextForValue(option, value) {
    const clients = option;
    const client = clients.find((client) => client.value === value);
    return client ? client.text : "Unknown";
  }

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
  const resetFilterValues = () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-col w-full h-full px-5">
      <div className="flex flex-col border border-gray-400 p-3 mb-3">
        <div className="my-2 flex-1">
          <div className="flex items-center">
            <Typography variant="h6">Search Expense</Typography>
            <HomeButton />
          </div>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div className="flex mr-12 gap-x-2">
            <SelectComp
              label="Person"
              options={[]}
              isInput={false}
              handle={(values) => {
                handleFilterChange(
                  "Product",
                  getTextForValue([], values.select)
                );
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
          <Button>Export</Button>
        </div>
        <div className="mx-3">
          <Button onClick={openModal}>Add New Expense</Button>
        </div>
      </div>

      <div className="flex flex-1 mb-2">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD_MAIN}
          TABLE_ROWS={expenseRows}
        />
      </div>
      <>
        <Dialog size="l" open={isModalOpen} handleOpen={openModal}>
          <DialogHeader toggler={closeModal}>
            Add New Expense Details
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  variant="outlined"
                  label="Person Name"
                  placeholder="Person Name"
                  onChange={(e) =>
                    handleFieldChange("Person_name", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Expense Type"
                  onChange={(e) =>
                    handleFieldChange("Expense_type", e.target.value)
                  }
                  placeholder="Expense Type"
                />
              </div>
              {/* Amount */}
              <div>
                <Input
                  variant="outlined"
                  label="Amount"
                  type="number"
                  onChange={(e) => handleFieldChange("Amount", e.target.value)}
                  placeholder="Amount"
                />
              </div>
              {/* Address */}
              <div>
                <Input
                  variant="outlined"
                  label="Date"
                  type="date"
                  onChange={(e) => handleFieldChange("Date", e.target.value)}
                  placeholder="Date"
                ></Input>
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Notes"
                  onChange={(e) => handleFieldChange("Notes", e.target.value)}
                  placeholder="Notes"
                ></Input>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              style={{ marginRight: 5 }}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  );
}
