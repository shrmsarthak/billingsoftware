const { EntitySchema } = require("typeorm");

const VendorDetails = new EntitySchema({
  name: "vendor_details",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    Vendor: {
      type: String,
      nullable: false,
    },
    Vendor_email: {
      type: String,
      nullable: true,
    },
    Contact_number: {
      type: String,
      nullable: false,
    },
    Address: {
      type: String,
      nullable: false,
    },
    City: {
      type: String,
      nullable: false,
    },
    State: {
      type: String,
      nullable: false,
    },
    GSTIN: {
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

module.exports = { VendorDetails };
