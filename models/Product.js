const { EntitySchema } = require("typeorm");

const Product = new EntitySchema({
    name: "product",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        p_type: {
            type: String,
            nullable: false,
            default: "product"
        },
        uom: {
            type: String,
            default: "box",
            nullable: false,
        },
        sku: {
            type: String,
            nullable: true
        },
        product_name: {
            type: String,
            nullable: false
        },
        purchase_price: {
            type: Number,
            nullable: true,
            default: 0,
        },
        amount: {
            type: Number,
            nullable: true,
            default: 0.00
        },
        COGS: {
            type: Number,
            nullable: true,
            default: 0.00
        },
        gross_margin: {
            type: Number,
            nullable: true,
            default: 0.00
        },
        gross_margin_rate: {
            type: Number,
            nullable: true,
            default: 0.00
        },
        keyword: {
            type: String,
            nullable: true,
        },
        category: {
            type: String,
            nullable: true,
        },
        sub_category: {
            type: String,
            nullable: true,
        },
        opening_balance: {
            type: Number,
            nullable: true,
            default: 0,
        },
        opening_rate: {
            type: Number,
            nullable: true,
            default: 0,
        },
        opening_value: {
            type: Number,
            nullable: true,
            default: 0,
        },
        storage_location: {
            type: String,
            nullable: true,
        },
        sub_location: {
            type: String,
            nullable: true,
        },
        hns: {
            type: String,
            nullable: true
        },
        sac: {
            type: String,
            nullable: true
        },
        unit_price: {
            type: Number,
            nullable: true,
            default: 0,
        },
        currency: {
            type: String,
            nullable: true,
            default: 'INR'
        },
        tax: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            nullable: true,
            default: 0,
        },
        quantity_sold: {
            type: Number,
            nullable: true,
            default: 0.00
        },
        cess: {
            type: String,
            nullable: true
        },
        description: {
            type: String,
            nullable: true
        },
        created_at: {
            type: Date,
            nullable: true,
        }
    }
})

module.exports = { Product }