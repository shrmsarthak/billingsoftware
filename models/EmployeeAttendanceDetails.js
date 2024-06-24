// Define the schema for the employee attendance table
const { EntitySchema } = require("typeorm");

const EmployeeAttendanceDetails = new EntitySchema({
  name: "employee_attendance",
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
    todayDate: {
      type: String,
      nullable: false,
    },
    inTime: {
      type: String,
      nullable: false,
    },
    outTime: {
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

module.exports = { EmployeeAttendanceDetails };
