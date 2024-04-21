const { DataSource } = require("typeorm");
const { CompanyModel } = require("../models/Company");
const { Address } = require("../models/Address");
const { Client } = require("../models/Client");
const { Product } = require("../models/Product");
const { ReportData } = require("../models/ReportData");
const { Category } = require("../models/Category");
const { Tax } = require("../models/Tax");
const { SubCategory } = require("../models/SubCategory");
const { Invoice } = require("../models/Invoice");
const { Quotation } = require("../models/Quotation");
const { CompanyDetails } = require("../models/CompanyDetails");
const { Debit_Notes } = require("../models/DebitNotes");
const { Credit_Notes } = require("../models/CreditNotes");

const DBManager = new DataSource({
  name: "maindb",
  type: "sqlite",
  database: "./db/main.sqlite",
  entities: [
    Address,
    Client,
    Category,
    Tax,
    SubCategory,
    CompanyModel,
    Product,
    ReportData,
    Invoice,
    Quotation,
    CompanyDetails,
    Debit_Notes,
    Credit_Notes,
  ],
  synchronize: true,
});

module.exports = { DBManager };
