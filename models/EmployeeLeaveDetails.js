// Define the schema for the employee leave details table
const { EntitySchema } = require("typeorm");

const EmployeeLeaveDetails = new EntitySchema({
  name: "employee_leave_details",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    employeeName: {
      type: String,
      nullable: false,
    },
    leaveDate: {
      type: Date,
      nullable: false,
    },
    leaveReason: {
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

module.exports = { EmployeeLeaveDetails };
