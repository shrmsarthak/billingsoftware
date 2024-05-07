const { EntitySchema } = require("typeorm");

const Employee = new EntitySchema({
  name: "employee",
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
    Age: {
      type: Number,
      nullable: false,
    },
    Contact_No: {
      type: String,
      nullable: false,
    },
    Address: {
      type: String,
      nullable: false,
    },
    Joining_Date: {
      type: Date,
      nullable: false,
    },
    Notes: {
      type: String,
      nullable: true,
    },
    Employee_email: {
      type: String,
      nullable: true,
    },
    Employee_title: {
      type: String,
      nullable: false,
    },
    Salary: {
      type: String,
      nullable: false,
    },
    created_at: {
      type: Date,
      nullable: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

module.exports = { Employee };
