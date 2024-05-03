const { EntitySchema } = require("typeorm");

const ExpenseDetails = new EntitySchema({
  name: "expense_details",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    Person_name: {
      type: String,
      nullable: false,
    },
    Expense_type: {
      type: String,
      nullable: false,
    },
    Amount: {
      type: Number,
      nullable: false,
    },
    Date: {
      type: Date,
      nullable: false,
    },
    Notes: {
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

module.exports = { ExpenseDetails };
