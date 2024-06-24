import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import SelectComp from "../components/SelectComp";
import { tax_type, uom_type } from "../../../utils/SelectOptions";
import { showmessage } from "../../../utils/api";

const unit_options = uom_type();

const tax_option = tax_type();

export default function AddNewProductModal({
  isOpen,
  handleOpen,
  handleClose,
}) {
  const [productData, setProductData] = useState({
    p_type: "Product",
    uom: "",
    sku: "",
    product_name: "",
    opening_balance: "",
    opening_value: "",
    opening_rate: "",
    storage_location: "",
    unit_price: 0,
    tax: "",
    description: "",
    created_at: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Save product data logic here
    const res = await window.api.invoke("add-new-product", productData);
    showmessage(res.message);
    handleClose();
  };

  const requiredFields = [
    "product_name",
    "uom",
    "description",
    "unit_price",
    "tax",
  ];

  const isFormIncomplete = requiredFields.some(
    (field) => productData[field] === "",
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
      <DialogHeader toggler={handleClose}>Add New Product</DialogHeader>
      <DialogBody>
        <div
          className="space-y-2"
          style={{ overflow: "auto", height: "75vh", padding: 10 }}
        >
          <Input
            variant="outlined"
            label={getLabel("product_name")}
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
          />
          <SelectComp
            variant="outlined"
            label={getLabel("uom")}
            options={unit_options}
            isinput={false}
            handle={(value) =>
              setProductData((prevState) => ({
                ...prevState,
                uom: value,
              }))
            }
          />
          <SelectComp
            variant="outlined"
            label={getLabel("tax")}
            options={tax_option}
            isinput={false}
            handle={(value) =>
              setProductData((prevState) => ({
                ...prevState,
                tax: value,
              }))
            }
          />
          <Input
            variant="outlined"
            label={getLabel("description")}
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="SKU"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label={getLabel("unit_price")}
            name="unit_price"
            value={productData.unit_price}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Opening Balance"
            name="opening_balance"
            value={productData.opening_balance}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Opening Value"
            name="opening_value"
            value={productData.opening_value}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Opening Rate"
            name="opening_rate"
            value={productData.opening_rate}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Storage Location"
            name="storage_location"
            value={productData.storage_location}
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
