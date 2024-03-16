const { EntitySchema } = require("typeorm");

const Address = new EntitySchema({
    name: "address",
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
        address: {
            type: String,
            nullable: true
        },
        city: {
            type: String,
            nullable: false
        },
        state: {
            type: String,
            nullable: false
        },
        pincode: {
            type: String,
            nullable: true
        },
        country: {
            type: String,
            nullable: true
        }
    },

})

module.exports = { Address }