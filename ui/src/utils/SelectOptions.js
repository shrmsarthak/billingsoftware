const { ipcRenderer } = window.require("electron");
export const uom_type = () => {
  return [
    {
      text: "Boxes",
      value: "box",
    },
    {
      text: "CFT",
      value: "cft",
    },
    {
      text: "Centimeter",
      value: "cm",
    },
    {
      text: "Cubic Meter",
      value: "c_meter",
    },
    {
      text: "Hours",
      value: "hour",
    },
    {
      text: "Kilogram",
      value: "kg",
    },
    {
      text: "Gram",
      value: "g",
    },
    {
      text: "Inche",
      value: "inche",
    },
  ];
};

export const tax_type = () => {
  return [
    {
      text: "GST Rate 1%",
      value: "1",
    },
    {
      text: "GST Rate 3%",
      value: "3",
    },
    {
      text: "GST Rate 5%",
      value: "5",
    },
    {
      text: "GST Rate 12%",
      value: "12",
    },
    {
      text: "GST Rate 18%",
      value: "18",
    },
    {
      text: "GST Rate 28%",
      value: "28",
    },
  ];
};

export const get_all_client_option = async () => {
  let option = [{ text: "Add new Client", value: "*" }];
  var res = await ipcRenderer.invoke("get-all-client");
  res.data.map((c, idx) => {
    option.push({
      text: c.client_name,
      value: c.id,
      all: c,
    });
  });
  return option;
};

export const get_all_product_option = async () => {
  var res = await ipcRenderer.invoke("get-all-product");
  let product_option = [{ text: "Add New Product", value: "*" }];

  res.data.map((c, idx) => {
    product_option.push({
      text: c.product_name,
      value: c.id,
      price: c.unit_price,
      uom: c.uom,
      description: c.description,
    });
  });
  return product_option;
};

export const get_all_invoices = async () => {
  var res = await ipcRenderer.invoke("get-all-invoice");
  return [res.data];
};

export const get_all_payment_details = async () => {
  var res = await ipcRenderer.invoke("get-all-payment-receipts");
  return [res.data];
};

export const get_all_debit_notes = async () => {
  var res = await ipcRenderer.invoke("get-all-debit-notes");
  return [res.data];
};

export const get_all_credit_notes = async () => {
  var res = await ipcRenderer.invoke("get-all-credit-notes");
  return [res.data];
};

export const get_all_quotation = async () => {
  var res = await ipcRenderer.invoke("get-all-quotation");
  return [res.data];
};

export const get_company_details = async () => {
  var res = await ipcRenderer.invoke("get-company-details");
  return res;
};
