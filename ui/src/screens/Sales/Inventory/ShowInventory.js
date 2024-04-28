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
import {
  get_all_product_option,
  get_all_purchase_orders,
  get_all_invoices,
} from "../../../utils/SelectOptions";
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
  "Product",
  "Description",
  "Type",
  "Price",
  "Location",
  "Quantity",
  "Action",
];
let product_option = await get_all_product_option();
let invoices = await get_all_invoices();
let purchaseOrders = await get_all_purchase_orders();

function adjustQuantities(purchaseData, invoiceData) {
  const soldQuantities = {};

  // Calculate sold quantities
  invoiceData.forEach((invoice) => {
    invoice.rowData.forEach((row) => {
      const productName = row.Product;
      const soldQuantity = parseInt(row.Qty);

      if (soldQuantities[productName]) {
        soldQuantities[productName] += soldQuantity;
      } else {
        soldQuantities[productName] = soldQuantity;
      }
    });
  });

  // Initialize a map to store combined data for each product
  const combinedDataMap = new Map();

  // Combine purchase data for the same product
  purchaseData.forEach((purchase) => {
    purchase.rowsData.forEach((row) => {
      const productName = row.Product;

      // Check if the product already exists in the combined data map
      if (combinedDataMap.has(productName)) {
        // If the product exists, update its quantity and location
        const existingData = combinedDataMap.get(productName);
        existingData.Quantity += parseInt(row.Qty);
        if (
          purchase.Location &&
          !existingData.Location.includes(purchase.Location)
        ) {
          existingData.Location += `, ${purchase.Location}`;
        }
      } else {
        // If the product doesn't exist, add it to the combined data map
        combinedDataMap.set(productName, {
          Product: row.Product,
          Description: row.Description,
          Type: row.UoM, // Assuming UoM represents the type
          Price: row.UnitPrice, // Assuming UnitPrice represents the price
          Location: purchase.Location || null,
          Quantity: parseInt(row.Qty),
        });
      }
    });
  });

  // Adjust quantities based on sold quantities
  combinedDataMap.forEach((data) => {
    const productName = data.Product;
    if (soldQuantities[productName]) {
      data.Quantity -= soldQuantities[productName];
    }
  });

  // Convert combined data map to array
  const adjustedData = Array.from(combinedDataMap.values());

  return adjustedData;
}

const adjustedData = adjustQuantities(purchaseOrders.flat(), invoices.flat());

export default function Inventory() {
  useEffect(() => {
    document.title = "Inventory";
  });
  const combinedArray = [...invoices.flat(), ...purchaseOrders.flat()];
  function getProductQtyByDocument(data, product) {
    const result = [];

    data.forEach((item) => {
      const documentNo = item.Document_No;
      const issueDate = item.Issue_Date;

      let soldQty = 0;
      let purchaseQty = 0;

      if (documentNo.startsWith("PUR")) {
        const purchaseData = item.rowsData.find(
          (row) => row.Product === product
        );
        if (purchaseData) {
          purchaseQty += parseInt(purchaseData.Qty);
        }
      } else {
        const soldData = item.rowData.find((row) => row.Product === product);
        if (soldData) {
          soldQty += parseInt(soldData.Qty);
        }
      }

      if (soldQty !== 0 || purchaseQty !== 0) {
        result.push({
          Type: documentNo.startsWith("PUR") ? "Purchase" : "Sold",
          "Document No": documentNo,
          "Issue Date": issueDate,
          "Sold QTY": soldQty,
          "Purchase QTY": purchaseQty,
        });
      }
    });

    return result;
  }

  console.log(JSON.stringify(combinedArray));
  const [filterValues, setFilterValues] = useState({
    Product: "",
    Type: "",
    Location: "",
  });
  console.log(filterValues);
  const [filterData, setFilterData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const openModal = (data) => {
    setSelectedProduct(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const productQtyByDocument = getProductQtyByDocument(
    combinedArray,
    selectedProduct.Product
  );
  console.log(selectedProduct);
  const nonEmptyValues = () => {
    return Object.keys(filterValues).filter((key) => filterValues[key] !== "");
  };
  let nonEmptyFields = nonEmptyValues();
  function getTextForValue(option, value) {
    const clients = option;
    const client = clients.find((client) => client.value === value);
    return client ? client.text : "Unknown";
  }
  const unfilteredData = adjustedData.map((obj) => {
    return {
      Product: obj.Product,
      Description: obj.Description,
      Type: obj.Type,
      Price: obj.Price,
      Location: obj.Location,
      Quantity: obj.Quantity,
      ActionButton: (
        <>
          <Tooltip content="View">
            <Button
              size="xs"
              className="py-1 px-2"
              style={{ background: "none" }}
              onClick={() => openModal(obj)}
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
                  stroke-width="2"
                  d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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
    let filteredData = adjustedData
      .flat()
      .filter((object) => {
        console.log(object);
        return nonEmptyFields.every((field) => {
          if (field !== "Product") {
            return object[field]?.includes(filterValues[field]);
          } else {
            return object[field] === filterValues[field];
          }
        });
      })
      .map((obj) => {
        return {
          Product: obj.Product,
          Description: obj.Description,
          Type: obj.Type,
          Price: obj.Price,
          Location: obj.Location,
          Quantity: obj.Quantity,
          ActionButton: (
            <>
              <Tooltip content="View">
                <Button
                  size="xs"
                  className="py-1 px-2"
                  style={{ background: "none" }}
                  onClick={() => openModal(obj)}
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
                      stroke-width="2"
                      d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                    />
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </Button>
              </Tooltip>
            </>
          ),
        };
      });
    setFilterData(filteredData);
  }, [filterValues]);

  const handleFilterChange = (fieldName, value) => {
    setFilterValues((prevValues) => ({
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
            <Typography variant="h6">Search Inventory</Typography>
            <HomeButton />
          </div>
          <hr />
        </div>
        <div className="flex flex-row w-full justify-between my-2">
          <div className="flex mr-12 gap-x-2">
            <SelectComp
              label="Product"
              options={product_option}
              isinput={false}
              handle={(values) => {
                handleFilterChange(
                  "Product",
                  getTextForValue(product_option, values.select)
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
      </div>

      <div className="flex flex-1 mb-2">
        <ProductInvoiceTable
          TABLE_HEAD={TABLE_HEAD_MAIN}
          TABLE_ROWS={nonEmptyFields.length === 0 ? unfilteredData : filterData}
        />
      </div>
      <>
        <Dialog size="md" open={isModalOpen} handleOpen={openModal}>
          <DialogHeader toggler={closeModal}>Product Stock Details</DialogHeader>
          <DialogBody>
            <div className="flex flex-1 mb-2">
              <ProductInvoiceTable
                TABLE_HEAD={TABLE_HEAD}
                TABLE_ROWS={productQtyByDocument}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <button onClick={closeModal}>Close</button>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  );
}
