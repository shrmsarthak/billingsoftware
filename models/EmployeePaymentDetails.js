// Define the schema for the payment details table
const { EntitySchema } = require("typeorm");

const EmployeePaymentDetails = new EntitySchema({
  name: "employee_payment_details",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    Employee_name: {
      type: String,
      nullable: false,
    },
    Payment_date: {
      type: Date,
      nullable: false,
    },
    Amount: {
      type: Number,
      nullable: false,
    },
    Payment_type: {
      type: String,
      nullable: false,
    },
    Is_Payment_Salary: {
      type: Boolean,
      nullable: true,
    },
    Payment_notes: {
      type: String,
      nullable: true,
    },
    created_at: {
      type: Date,
      nullable: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

module.exports = { EmployeePaymentDetails };
