const { EntitySchema } = require("typeorm");

const PaymentDetails = new EntitySchema({
  name: "payment_details",
  columns: {
    Document_No: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    rowData: {
      type: "json",
      nullable: true,
    },
    Client: {
      type: String,
      nullable: true,
    },
    Document_Date: {
      type: "date",
      nullable: true,
    },
    Pay_Date: {
      type: "date",
      nullable: true,
    },
    Bank_Charges: {
      type: Number,
      nullable: true,
    },
    Payment_Type: {
      type: String,
      nullable: true,
    },
    Payment_Mode: {
      type: String,
      nullable: true,
    },
    Amount_Received: {
      type: Number,
      nullable: true,
    },
  },
});

module.exports = { PaymentDetails };
