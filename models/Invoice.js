const { EntitySchema, Transaction } = require("typeorm");

const Invoice = new EntitySchema({
  name: "invoice",
  columns: {
    Document_No: {
      type: "uuid", // Use UUID as the type for the primary key
      primary: true,
      generated: "uuid", // Automatically generate UUID
    },
    rowData: {
      type: "json",
      nullable: true,
    },
    Client: {
      type: String,
      nullable: true,
    },
    Issue_Date: {
      type: "date",
      nullable: true,
    },
    Ship_To: {
      type: String,
      nullable: true,
    },
    PO_Number: {
      type: Number,
      nullable: true,
    },
    Payment_Term: {
      type: String,
      nullable: true,
    },
    PO_Date: {
      type: "date",
      nullable: true,
    },
    Due_Date: {
      type: "date",
      nullable: true,
    },
    Place_Of_Supply: {
      type: String,
      nullable: true,
    },
    Notes: {
      type: String,
      nullable: true,
    },
    Private_Notes: {
      type: String,
      nullable: true,
    },
    Shipping_Charges: {
      type: Number,
      nullable: true,
    },
    Discount_on_all: {
      type: Number,
      nullable: true,
    },
    Total_BeforeTax: {
      type: Number,
      nullable: true,
    },
    Total_Tax: {
      type: Number,
      nullable: true,
    },
    Amount_Paid: {
      type: Number,
      nullable: true,
    },
    Date_of_payment: {
      type: "date",
      nullable: true,
    },
    Transaction_type: {
      type: String,
      nullable: true,
    },
  },
});

module.exports = { Invoice };
