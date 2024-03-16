const { EntitySchema } = require("typeorm");

const SubCategory = new EntitySchema({
    name: "subCategory",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        category_id: {
            type: Number,
            nullable: false,
            unique: false,
        },
        name: {
            type: String,
            nullable: true
        },
    }
})

module.exports = { SubCategory }