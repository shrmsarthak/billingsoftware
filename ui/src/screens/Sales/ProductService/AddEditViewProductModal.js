import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import SelectComp from "../components/SelectComp";

export function AddEditViewProductModal({
  isModalOpen,
  handleOpen,
  onSave,
  typeOptions,
  unitOptions,
  purchaseOptions,
  data,
  setData,
  error,
  setError,
  categories,
  setCategoryId,
  subCategories,
  editId = "",
  isView = false,
  categoryId,
  taxes,
}) {
  const [showProductsModule, setShowProductsModule] = useState(true);
  const [showServiceModule, setShowServiceModule] = useState(false);

  const title = isView
    ? "View Product/Service"
    : editId
    ? "Edit Product/Service"
    : "Add Product/Service";

  const renderErrorMessage = (fieldName, message) => {
    return (
      error[fieldName] && <p className="text-red-500 text-sm mt-1">{message}</p>
    );
  };

  return (
    <>
      <Dialog open={isModalOpen} handler={handleOpen} className=" ModalPopup">
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1" variant="h4">
              {title}
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
            Product/Service
          </Typography>
          <div className="grid gap-6 ">
            <div className="grid gap-6">
              <SelectComp
                label="Type"
                isinput={false}
                options={typeOptions}
                defaultValue={data.p_type}
                handle={(values) => {
                  const selectedType = values.select;
                  setData({ ...data, p_type: selectedType });
                  // Set visibility for Unit and SKU fields based on the selected type
                  setShowProductsModule(selectedType === "Product");
                  setShowServiceModule(selectedType === "Service");
                }}
                disabled={isView}
              />
              <div>
                <SelectComp
                  label="Unit"
                  options={unitOptions}
                  isinput={false}
                  defaultValue={data.uom}
                  handle={(values) => {
                    setData({ ...data, uom: values.select });
                  }}
                  disabled={isView}
                />
                {renderErrorMessage("uom", "Unit is required is required.")}
              </div>
              {showProductsModule && (
                <Input
                  variant="outlined"
                  label="SKU"
                  placeholder="SKU"
                  value={data.sku}
                  disabled={isView}
                  onChange={(v) => {
                    const skuValue = v.target.value;
                    setData({ ...data, sku: skuValue });
                  }}
                />
              )}
              <div className="mb-5">
                <Input
                  variant="outlined"
                  label="Product Name"
                  placeholder="Product Name"
                  value={data.product_name}
                  disabled={isView}
                  onChange={(v) => {
                    const nameValue = v.target.value;
                    setData({ ...data, product_name: nameValue });
                    setError((prevErrors) => ({
                      ...prevErrors,
                      product_name: !nameValue.trim(),
                    }));
                  }}
                />
                {renderErrorMessage(
                  "product_name",
                  "Product name is required."
                )}
              </div>
              {showProductsModule && (
                <Input
                  variant="outlined"
                  label="Keyword/Alias"
                  placeholder="Keyword/Alias"
                  value={data.keyword}
                  disabled={isView}
                  onChange={(v) => {
                    const keyValue = v.target.value;
                    setData({ ...data, keyword: keyValue });
                  }}
                />
              )}
              <Textarea
                variant="outlined"
                label="Description"
                value={data.description}
                disabled={isView}
                onChange={(v) => {
                  const descValue = v.target.value;
                  setData({ ...data, description: descValue });
                }}
              />
              {showServiceModule && (
                <Input
                  variant="outlined"
                  label="SAC"
                  placeholder="SAC"
                  value={data.sac}
                  disabled={isView}
                  onChange={(v) => {
                    const sacValue = v.target.value;
                    setData({ ...data, sac: sacValue });
                  }}
                />
              )}
              {showProductsModule && (
                <SelectComp
                  label="Category"
                  options={categories}
                  isinput={false}
                  defaultValue={data.category}
                  disabled={isView}
                  handle={(values) => {
                    if (values.select === "*") {
                      // api_new_client();
                      return;
                    }
                    setCategoryId(values.select);
                    setData({ ...data, category: values.select });
                  }}
                />
              )}
              {showProductsModule && (
                <SelectComp
                  label="Sub Category"
                  isinput={false}
                  options={subCategories}
                  defaultValue={data.sub_category}
                  disabled={isView}
                  handle={(values) => {
                    setData({ ...data, sub_category: values.select });
                  }}
                />
              )}
              {showProductsModule && (
                <Input
                  variant="outlined"
                  label="Storage Location"
                  placeholder="Storage Location"
                  value={data.storage_location}
                  disabled={isView}
                  onChange={(v) => {
                    const locationValue = v.target.value;
                    setData({ ...data, storage_location: locationValue });
                  }}
                />
              )}
              {showProductsModule && (
                <Input
                  variant="outlined"
                  label="Sub Location"
                  placeholder="Sub Location"
                  value={data.sub_location}
                  disabled={isView}
                  onChange={(v) => {
                    const locationValue = v.target.value;
                    setData({ ...data, sub_location: locationValue });
                  }}
                />
              )}
              {showProductsModule && (
                <Input
                  variant="outlined"
                  label="HSN"
                  placeholder="HSN"
                  value={data.hns}
                  disabled={isView}
                  onChange={(v) => {
                    const hnsValue = v.target.value;
                    setData({ ...data, hns: hnsValue });
                  }}
                />
              )}
              <Typography>Sales Information</Typography>
              <div className="mb-5">
                <Input
                  variant="outlined"
                  label="Unit Price(INR)"
                  placeholder="Unit Price(INR)"
                  value={data.unit_price}
                  disabled={isView}
                  onChange={(v) => {
                    const priceValue = v.target.value;
                    const numericValue = priceValue.replace(/[^0-9]/g, "");
                    setData({ ...data, unit_price: numericValue });
                    setError((prevErrors) => ({
                      ...prevErrors,
                      unit_price: !priceValue.trim(),
                    }));
                  }}
                />
                {renderErrorMessage("unit_price", "Unit Price is required.")}
              </div>
              <SelectComp
                label="Tax"
                options={taxes}
                isinput={false}
                defaultValue={data.tax}
                disabled={isView}
                handle={(values) => {
                  setData({ ...data, tax: values.select });
                }}
              />
              {showProductsModule && (
                <>
                  <Input
                    variant="outlined"
                    label="Quantity"
                    placeholder="Quantity"
                    value={data.quantity}
                    disabled={isView}
                    onChange={(v) => {
                      const qtyValue = v.target.value;
                      const numericValue = qtyValue.replace(/[^0-9]/g, "");
                      setData({ ...data, quantity: numericValue });
                      setError((prevErrors) => ({
                        ...prevErrors,
                        quantity: !qtyValue.trim(),
                      }));
                    }}
                  />
                  {renderErrorMessage("quantity", "Quantity is required.")}
                  <Input
                    variant="outlined"
                    label="Opening Balance"
                    placeholder="Opening Balance"
                    value={data.opening_balance}
                    disabled={isView}
                    onChange={(v) => {
                      const balanceValue = v.target.value;
                      const numericValue = balanceValue.replace(/[^0-9]/g, "");
                      setData({ ...data, opening_balance: numericValue });
                    }}
                  />
                  <Input
                    variant="outlined"
                    label="Opening Value"
                    placeholder="Opening Value"
                    value={data.opening_value}
                    disabled={isView}
                    onChange={(v) => {
                      const value = v.target.value;
                      const numericValue = value.replace(/[^0-9]/g, "");
                      setData({ ...data, opening_value: numericValue });
                    }}
                  />
                  <Input
                    variant="outlined"
                    label="Opening Rate"
                    placeholder="Opening Rate"
                    value={data.opening_rate}
                    disabled={isView}
                    onChange={(v) => {
                      const rateValue = v.target.value;
                      const numericValue = rateValue.replace(/[^0-9]/g, "");
                      setData({ ...data, opening_rate: numericValue });
                    }}
                  />
                  <div>
                    <Input
                      variant="outlined"
                      label="CESS"
                      placeholder="CESS"
                      value={data.cessValue1}
                      disabled={isView}
                      onChange={(v) => {
                        const cessValue = v.target.value;
                        const numericValue = cessValue.replace(/[^0-9]/g, "");
                        setData({ ...data, cessValue1: numericValue });
                      }}
                    />
                    %
                  </div>

                  <div>
                    +
                    <Input
                      variant="outlined"
                      value={data.cessValue2}
                      disabled={isView}
                      onChange={(v) => {
                        const cessValue = v.target.value;
                        const numericValue = cessValue.replace(/[^0-9]/g, "");
                        setData({ ...data, cessValue2: numericValue });
                      }}
                    />
                  </div>
                </>
              )}
              {showProductsModule && (
                <>
                  <Typography>Purchase Information</Typography>
                  <Input
                    variant="outlined"
                    label="Purchase Rate"
                    placeholder="Purchase Rate"
                    value={data.purchase_price}
                    disabled={isView}
                    onChange={(v) => {
                      const priceValue = v.target.value;
                      const numericValue = priceValue.replace(/[^0-9]/g, "");
                      setData({ ...data, purchase_price: numericValue });
                    }}
                  />
                  <SelectComp
                    options={purchaseOptions}
                    isinput={false}
                    defaultValue={data.currency}
                    disabled={isView}
                  handle={(values) => {
                      const value = values.select;
                      setData({ ...data, currency: value });
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button variant="gradient" color="gray" onClick={onSave}>
            {isView ? "Done" : editId ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
