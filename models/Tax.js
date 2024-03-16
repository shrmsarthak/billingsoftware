const { EntitySchema } = require("typeorm");

const Tax = new EntitySchema({
    name: "taxes",
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
        tax_rate: {
            type: String,
            nullable: false,
            unique: true,
        },
        is_default: {
            type: Boolean,
            default: true,
        }
    }
})

module.exports = { Tax }