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
import { ProductInvoiceTable } from "../Sales/components/ProductInvoiceTable";
import SelectComp from "../Sales/components/SelectComp";
import {
  get_all_employee,
  get_all_employee_payments,
} from "../../../src/utils/SelectOptions";
import HomeButton from "../../assets/Buttons/HomeButton";
import { saveAs } from "file-saver";
const { ipcRenderer } = window.require("electron");

const TABLE_HEAD_MAIN = [
  "No",
  "Employee Name",
  "Employee Title",
  "Salary",
  "Contact Number",
  "Address",
  "Joining Date",
  "Notes",
  "Action",
];

const TABLE_HEAD_BALANCE = [
  "No",
  "Employee",
  "Payment Date",
  "Amount",
  "Payment Type",
  "Payment Notes",
];

const initialValue = {
  Employee_name: "",
  Age: "",
  Contact_No: "",
  Address: "",
  Joining_Date: "",
  Notes: "",
  Employee_email: "",
  Employee_title: "",
  Salary: "",
};

function convertDateToString(date) {
  const dateString = date.toISOString().split("T")[0];
  return dateString;
}

const expense_options = [
  "Food",
  "Fuel",
  "Transportation",
  "Office Expense",
  "Other",
];

const generateDropDownList = (data) => {
  return data.map((x) => ({
    text: x,
    value: x,
  }));
};

const allEmployees = await get_all_employee();
const allPayments = await get_all_employee_payments();
console.log(allPayments);

const handleDeleteEmployee = async (obj) => {
  const res = await ipcRenderer.invoke(
    "delete-employee-by-contact-no",
    obj.Contact_No
  );
  alert(res.message);
};

export default function ShowEmployee() {
  useEffect(() => {
    document.title = "Show Employee";
  });

  const person_option = Array.from(
    new Set(allEmployees.flat().map((x) => x.Employee_name))
  );

  const [filterValues, setFilterValues] = useState({
    Person: "",
    Type: "",
    Issue_From: "",
    Issue_To: "",
  });
  const [fields, setFields] = useState(initialValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilterData] = useState("");

  console.log(fields);

  // State for payment modal
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isBalanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceData, setBalanceData] = useState([]);

  // Function to open payment modal
  const openPaymentModal = (obj) => {
    handlePaymentFieldChange("Employee_name", obj.Employee_name);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setPaymentData(initialPaymentData);
  };

  const openBalanceModal = (obj) => {
    console.log(obj);
    console.log(allPayments);

    setBalanceData(
      allPayments
        .filter((item) => item.Employee_name === obj.Employee_name)
        .map((items) => {
          return {
            Employee: items.Employee_name,
            "Payment Date": convertDateToString(items.Payment_date),
            Amount: items.Amount,
            "Payment Type": items.Payment_type,
            "Payment Notes": items.Payment_notes,
          };
        })
    );
    setBalanceModalOpen(true);
  };

  const closeBalanceModal = () => {
    setBalanceModalOpen(false);
  };

  const initialPaymentData = {
    Employee_name: "",
    Payment_date: "",
    Amount: "",
    Payment_type: "",
    Payment_notes: "",
  };
  // State for payment details
  const [paymentData, setPaymentData] = useState(initialPaymentData);

  console.log(paymentData);

  // Function to handle changes in payment details
  const handlePaymentFieldChange = (field, value) => {
    setPaymentData({ ...paymentData, [field]: value });
  };

  const handlePaymentSave = async () => {
    const res = await ipcRenderer.invoke(
      "add-new-employee-payment",
      paymentData
    );
    alert(res.message);
    setPaymentData(initialPaymentData);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    const res = await ipcRenderer.invoke("add-new-employee", fields);
    alert(res.message);
  };

  const nonEmptyValues = () => {
    return Object.keys(filterValues).filter((key) => filterValues[key] !== "");
  };
  let nonEmptyFields = nonEmptyValues();

  const EXPENSES_ROWS = allEmployees.flat().map((x) => {
    return {
      "Employee Name": x.Employee_name,
      "Employee Title": x.Employee_title,
      Salary: x.Salary,
      "Contact Number": x.Contact_No,
      Address: x.Address,
      "Joining Date": convertDateToString(x.Joining_Date),
      Notes: x.Notes,
      Action: (
        <>
          <Tooltip content="Pay">
            <Button
              color="white"
              size="sm" // Adjusted button size to xs
              onClick={() => openPaymentModal(x)}
              className="py-1 px-2" // Adjusted padding
            >
              <svg
                class="w-[24px] h-[24px] text-gray-800 dark:text-white"
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
                  d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip content="Balance">
            <Button
              color="white"
              size="sm" // Adjusted button size to xs
              onClick={() => openBalanceModal(x)}
              className="py-1 px-2" // Adjusted padding
            >
              <svg
                class="w-[24px] h-[24px] text-gray-800 dark:text-white"
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
                  d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
                />
              </svg>
            </Button>
          </Tooltip>
          <Tooltip content="Delete">
            <Button
              color="white"
              size="sm" // Adjusted button size to xs
              onClick={() => handleDeleteEmployee(x)}
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
        </>
      ),
    };
  });

  useEffect(() => {
    let nonEmptyFields = nonEmptyValues();
    let filter = allEmployees
      .flat()
      .filter((object) => {
        return nonEmptyFields.every((field) => {
          if (field === "Issue_From" || field === "Issue_To") {
            // Check if Issue Date lies in the range between Issue_From and Issue_To
            const fromDate = new Date(filterValues.Issue_From);
            const toDate = new Date(filterValues.Issue_To);
            const issueDate = new Date(convertDateToString(object.Date));
            return issueDate >= fromDate && issueDate <= toDate;
          } else if (field === "Person") {
            return object["Person_name"] === filterValues[field];
          } else if (field === "Type" && filterValues[field] === "Other") {
            return (
              object["Expense_type"] !== "Food" &&
              object["Expense_type"] !== "Fuel" &&
              object["Expense_type"] !== "Transportation" &&
              object["Expense_type"] !== "Office Expense"
            );
          } else {
            return object["Expense_type"] === filterValues[field];
          }
        });
      })
      .map((obj) => {
        return {
          "Person Name": obj.Person_name,
          "Expense Type": obj.Expense_type,
          Amount: obj.Amount,
          Date: obj.Date ? convertDateToString(obj.Date) : "",
          Notes: obj.Notes,
          Action: (
            <>
              <Tooltip content="Pay">
                <Button
                  color="white"
                  size="sm" // Adjusted button size to xs
                  // onClick={() => handleDeleteEmployee(obj)}
                  className="py-1 px-2" // Adjusted padding
                >
                  <svg
                    class="w-[24px] h-[24px] text-gray-800 dark:text-white"
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
                      stroke-width="2"
                      d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                  </svg>
                </Button>
              </Tooltip>
              <Tooltip content="Delete">
                <Button
                  color="white"
                  size="sm" // Adjusted button size to xs
                  // onClick={() => handleDeleteEmployee(obj)}
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
              </Tooltip>{" "}
            </>
          ),
        };
      });
    setFilterData(filter);
  }, [filterValues]);

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
            <Typography variant="h6">Search Employee</Typography>
            <HomeButton />
          </div>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div className="flex mr-12 gap-x-2">
            <SelectComp
              label="Person"
              options={generateDropDownList(person_option)}
              isInput={false}
              handle={(values) => {
                handleFilterChange("Person", values.select);
              }}
            />
          </div>
          <div className=" mr-12">
            <div className="flex mr-12 gap-x-2">
              <Input
                variant="outlined"
                label="Issue From"
                placeholder="Issue From"
                type="date"
                onChange={(e) =>
                  handleFilterChange("Issue_From", e.target.value)
                }
              />

              <Input
                variant="outlined"
                label="Issue To "
                placeholder="Issue To"
                type="date"
                onChange={(e) => handleFilterChange("Issue_To", e.target.value)}
              />
            </div>
          </div>
          <div className="flex mr-12 gap-x-2">
            <SelectComp
              variant="outlined"
              label="Type"
              placeholder="Type"
              options={generateDropDownList(expense_options)}
              handle={(values) => {
                handleFilterChange("Type", values.select);
              }}
              disabled
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
          <Button onClick={openModal}>Add New Employee</Button>
        </div>
      </div>

      <div className="flex flex-1 mb-2">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD_MAIN}
          TABLE_ROWS={
            nonEmptyFields.length === 0 ? EXPENSES_ROWS : filteredData
          }
        />
      </div>
      <>
        {/* New Employee Modal */}
        <Dialog size="l" open={isModalOpen} handleOpen={openModal}>
          <DialogHeader toggler={closeModal}>
            Add New Employee Details
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  variant="outlined"
                  label="Employee Name"
                  placeholder="Employee Name"
                  onChange={(e) =>
                    handleFieldChange("Employee_name", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Age"
                  type="number"
                  onChange={(e) => handleFieldChange("Age", e.target.value)}
                  placeholder="Age"
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Contact No"
                  type="number"
                  onChange={(e) =>
                    handleFieldChange("Contact_No", e.target.value)
                  }
                  placeholder="Contact No"
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Employee Email"
                  placeholder="Employee Email"
                  onChange={(e) =>
                    handleFieldChange("Employee_email", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Employee Title"
                  onChange={(e) =>
                    handleFieldChange("Employee_title", e.target.value)
                  }
                  placeholder="Employee Title"
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Salary"
                  type="number"
                  onChange={(e) => handleFieldChange("Salary", e.target.value)}
                  placeholder="Salary"
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Address"
                  onChange={(e) => handleFieldChange("Address", e.target.value)}
                  placeholder="Address"
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Joining Date"
                  type="date"
                  onChange={(e) =>
                    handleFieldChange("Joining_Date", e.target.value)
                  }
                  placeholder="Joining Date"
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
            >
              Save
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Payment Modal */}
        <Dialog
          size="l"
          open={isPaymentModalOpen}
          handleOpen={openPaymentModal}
        >
          <DialogHeader toggler={closePaymentModal}>
            Add Payment Details
          </DialogHeader>
          <DialogBody>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Input
                  variant="outlined"
                  label="Employee Name"
                  placeholder="Employee Name"
                  value={paymentData.Employee_name}
                  disabled
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Payment Date"
                  type="date"
                  onChange={(e) =>
                    handlePaymentFieldChange("Payment_date", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Amount"
                  type="number"
                  onChange={(e) =>
                    handlePaymentFieldChange("Amount", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Payment Type"
                  placeholder="Payment Type Eg: Cash, UPI"
                  onChange={(e) =>
                    handlePaymentFieldChange("Payment_type", e.target.value)
                  }
                />
              </div>
              <div>
                <Input
                  variant="outlined"
                  label="Payment Notes"
                  placeholder="Payment Notes"
                  onChange={(e) =>
                    handlePaymentFieldChange("Payment_notes", e.target.value)
                  }
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={closePaymentModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              style={{ marginRight: 5 }}
            >
              Close
            </Button>
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handlePaymentSave}
            >
              Save
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Balance Modal */}
        <Dialog
          size="l"
          open={isBalanceModalOpen}
          handleOpen={openBalanceModal}
        >
          <DialogHeader toggler={closeBalanceModal}>
            Employee Payment Details
          </DialogHeader>
          <DialogBody>
            {" "}
            <ProductInvoiceTable
              TABLE_HEAD={TABLE_HEAD_BALANCE}
              TABLE_ROWS={balanceData}
            />
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={closeBalanceModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              style={{ marginRight: 5 }}
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  );
}

// *Employee Management Functionality
//  -Add Employee
//  -Delete Employee
//  -Update Employee
//  -View All Employee
//  -Advance Payment Option
//  -History of Payment
//  -Employee Leaves
//  -Attendance Option
//  -Custom Office Day off

// *Employee Management Functionality

// ++Add New Employee
//   -Name
//   -Phone
//   -Email
//   -Age
//   -Address
//   -DOJ
//   -Salary
//   -Type (Custom Category) - It can be like Sales Person, Technician etc. Businesses can add their custom types

// ++Advance Payment Option
//  -Option to add payment in middle of the month

// ++Employee Leaves
//  -Reason & Date

// ++ Attendance Option
//  -Current date, IN/OUT timing
