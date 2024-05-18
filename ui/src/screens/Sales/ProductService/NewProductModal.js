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

const unit_options = [
  {
    text: "Boxes",
    value: "Boxes",
  },
  {
    text: "CFT",
    value: "CFT",
  },
  {
    text: "Centimeters",
    value: "Centimeters",
  },
  {
    text: "Gram",
    value: "Gram",
  },
  {
    text: "Inches",
    value: "Inches",
  },
  {
    text: "Hours",
    value: "Hours",
  },
];

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
    purchase_price: "",
    opening_balance: "",
    opening_value: "",
    opening_rate: "",
    storage_location: "",
    hns: "",
    sac: "",
    unit_price: "",
    currency: "",
    tax: "",
    quantity: "",
    cess: "",
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

  console.log(productData);

  const handleSave = async () => {
    // Save product data logic here
    const res = await window.api.invoke("add-new-product", productData);
    alert(res.message);
    handleClose();
  };

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
            label="Product Name"
            name="product_name"
            value={productData.product_name}
            onChange={handleChange}
          />
          <SelectComp
            variant="outlined"
            label="Unit of Measure"
            options={unit_options}
            isinput={false}
            handle={(value) =>
              setProductData((prevState) => ({
                ...prevState,
                uom: value,
              }))
            }
          />
          <Input
            variant="outlined"
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Purchase Price"
            name="purchase_price"
            value={productData.purchase_price}
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
          <Input
            variant="outlined"
            label="HNS"
            name="hns"
            value={productData.hns}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="SAC"
            name="sac"
            value={productData.sac}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Unit Price"
            name="unit_price"
            value={productData.unit_price}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Currency"
            name="currency"
            value={productData.currency}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Tax"
            name="tax"
            value={productData.tax}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
          />
          <Input
            variant="outlined"
            label="Cess"
            name="cess"
            value={productData.cess}
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
        >
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
