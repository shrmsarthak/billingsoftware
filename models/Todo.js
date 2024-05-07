const { EntitySchema } = require("typeorm");

const Todo = new EntitySchema({
  name: "todo",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    todo: {
      type: String,
      nullable: false,
    },
  },
  indices: [
    {
      unique: true,
      columns: ["id"],
    },
  ],
});

module.exports = { Todo };
