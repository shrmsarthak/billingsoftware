const { EntitySchema } = require("typeorm");

const Category = new EntitySchema({
    name: "category",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        name: {
            type: String,
            nullable: true
        },
        is_default: {
            type: Boolean,
            default: true,
        }
    }
})

module.exports = { Category }