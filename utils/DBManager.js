const { DataSource } = require("typeorm")
const { CompanyModel } = require("../models/Company")
const { Address } = require("../models/Address")
const { Client } = require("../models/Client")
const { Product } = require("../models/Product")
const { ReportData } = require("../models/ReportData")
const { Category } = require("../models/Category")
const { Tax } = require("../models/Tax")
const { SubCategory } = require("../models/SubCategory")

const DBManager = new DataSource({
    name: "maindb",
    type: "sqlite",
    database: "./db/main.sqlite",
    entities: [Address, Client, Category, Tax, SubCategory, CompanyModel, Product, ReportData],
    synchronize: true,
})

module.exports = { DBManager }


