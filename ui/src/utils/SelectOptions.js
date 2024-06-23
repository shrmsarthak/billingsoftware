export const uom_type = () => {
  return [
    {
      text: "Bags",
      value: "bags",
    },
    {
      text: "Bale",
      value: "bale",
    },
    {
      text: "Bundles",
      value: "bundles",
    },
    {
      text: "Buckles",
      value: "buckles",
    },
    {
      text: "Billion of Units",
      value: "billion_units",
    },
    {
      text: "Boxes",
      value: "box",
    },
    {
      text: "Bottles",
      value: "bottles",
    },
    {
      text: "Bunches",
      value: "bunches",
    },
    {
      text: "Cans",
      value: "cans",
    },
    {
      text: "Cubic Meters",
      value: "c_meter",
    },
    {
      text: "Cubic Centimeters",
      value: "cm",
    },
    {
      text: "Centimeters",
      value: "centimeters",
    },
    {
      text: "Cartons",
      value: "cartons",
    },
    {
      text: "Dozens",
      value: "dozens",
    },
    {
      text: "Drums",
      value: "drums",
    },
    {
      text: "Great Gross",
      value: "great_gross",
    },
    {
      text: "Grammes",
      value: "g",
    },
    {
      text: "Gross",
      value: "gross",
    },
    {
      text: "Gross Yards",
      value: "gross_yards",
    },
    {
      text: "Kilograms",
      value: "kg",
    },
    {
      text: "Kilolitre",
      value: "kilolitre",
    },
    {
      text: "Kilometre",
      value: "kilometre",
    },
    {
      text: "Litres",
      value: "litres",
    },
    {
      text: "Mililitre",
      value: "mililitre",
    },
    {
      text: "Meters",
      value: "meters",
    },
    {
      text: "Metric Ton",
      value: "metric_ton",
    },
    {
      text: "Numbers",
      value: "numbers",
    },
    {
      text: "Others",
      value: "others",
    },
    {
      text: "Packs",
      value: "packs",
    },
    {
      text: "Pieces",
      value: "pieces",
    },
    {
      text: "Pairs",
      value: "pairs",
    },
    {
      text: "Quintal",
      value: "quintal",
    },
    {
      text: "Rolls",
      value: "rolls",
    },
    {
      text: "Sets",
      value: "sets",
    },
    {
      text: "Square Feet",
      value: "square_feet",
    },
    {
      text: "Square Meters",
      value: "square_meters",
    },
    // Add more options as needed
  ].map((option) => ({
    ...option,
    text: option.text.replace(/\b\w/g, (firstChar) => firstChar.toUpperCase()),
  }));
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
  let option = [{ text: "Add New Client", value: "*" }];
  var res = await window.api.invoke("get-all-client");
  res?.data.map((c, idx) => {
    option.push({
      text: c.client_name,
      value: c.id,
    });
  });
  return option;
};

export const get_all_product_option = async () => {
  var res = await window.api.invoke("get-all-product");
  let product_option = [{ text: "Add New Product" }];
  res?.data.map((c, idx) => {
    product_option.push({
      text: c.product_name,
      value: c.id,
      price: c.unit_price,
      uom: c.uom,
      description: c.description,
      purchase_price: c.purchase_price,
      tax: c.tax,
    });
  });
  return product_option;
};

export const get_all_vendor_option = async () => {
  var res = await window.api.invoke("get-all-vendors");
  let product_option = [{ text: "Add New Vendor" }];
  res?.data.map((c, idx) => {
    product_option.push({
      text: c.Vendor,
      value: c.id,
      number: c.Contact_number,
      created: c.created_at,
      city: c.City,
      state: c.State,
      GSTIN: c.GSTIN,
    });
  });
  return product_option;
};

export const get_all_invoices = async () => {
  var res = await window.api.invoke("get-all-invoice");
  return [res?.data];
};

export const get_all_expenses = async () => {
  var res = await window.api.invoke("get-all-expenses");
  return [res?.data];
};

export const get_all_employee = async () => {
  var res = await window.api.invoke("get-all-employee");
  return [res?.data];
};

export const get_all_employee_payments = async () => {
  var res = await window.api.invoke("get-all-employee-payments");
  return res?.data;
};

export const get_all_employee_leaves = async () => {
  var res = await window.api.invoke("get-all-employee-leaves");
  return res?.data;
};

export const get_all_purchase_orders = async () => {
  var res = await window.api.invoke("get-all-purchase-orders");
  return [res?.data];
};

export const get_all_payment_details = async () => {
  var res = await window.api.invoke("get-all-payment-receipts");
  return [res?.data];
};

export const get_all_debit_notes = async () => {
  var res = await window.api.invoke("get-all-debit-notes");
  return [res?.data];
};

export const get_all_credit_notes = async () => {
  var res = await window.api.invoke("get-all-credit-notes");
  return [res?.data];
};

export const get_all_quotation = async () => {
  var res = await window.api.invoke("get-all-quotation");
  return [res?.data];
};

export const get_company_details = async () => {
  var res = await window.api.invoke("get-company-details");
  return res;
};

export const get_invoice_count = async () => {
  var res = await window.api.invoke("get-invoice-count");
  return res;
};

export const get_todo_data = async () => {
  var res = await window.api.invoke("get-todo-data");
  return res;
};

export const get_product_quantities = async () => {
  var res = await window.api.invoke("get-product-quantity");
  return res;
};

export const get_all_employee_attendance = async () => {
  var res = await window.api.invoke("get-attendance");
  return res?.data;
};
