import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const PaymentReceipt = ({ details, tableData }) => {
  let totalAmountPaid = tableData.reduce((total, obj) => {
    let paymentAmount = isNaN(obj["Payment Amount"])
      ? 0
      : Number(obj["Payment Amount"]);
    return total + paymentAmount;
  }, 0);

  let combinedBill = tableData.reduce((total, item) => {
    // Convert 'Amount Due' to a number and add it to the total
    return total + parseFloat(item["Amount Due"]);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header_container}>
          <View style={styles.logo_container}>
            <Text>Company Logo</Text>
          </View>
          <View style={styles.company_details}>
            <Text style={styles.company_name}>
              {details.companyDetails.companyName}
            </Text>
            <Text style={styles.detailText}>
              {details.companyDetails.address}, {details.companyDetails.city}{" "}
              {details.companyDetails.pincode}
            </Text>
            <Text style={styles.detailText}>
              {details.companyDetails.email}
            </Text>
            <Text style={styles.detailText}>
              {details.companyDetails.phone}
            </Text>
          </View>
        </View>

        <View style={styles.invoice_title_container}>
          <View style={styles.line}></View>
          <Text style={styles.invoice_title}>Receipt</Text>
          <View style={styles.line}></View>
        </View>

        <View style={styles.bill_ship_container}>
          <View style={styles.bill_to}>
            <Text style={styles.sub_header}>Client:</Text>
            <Text style={styles.detailText}>{details.Client}</Text>
          </View>
          <View style={styles.ship_to}>
            <Text style={styles.sub_header}>Payment Details:</Text>
            <Text style={styles.detailText}>
              Document No: {details.Document_No}
            </Text>
            <Text style={styles.detailText}>
              Payment Date: {details.Pay_Date}
            </Text>
            <Text style={styles.detailText}>
              Bank Charges: {details.Bank_Charges}
            </Text>
            <Text style={styles.detailText}>
              Payment Type: {details.Payment_Type}
            </Text>
            <Text style={styles.detailText}>
              Payment Mode: {details.Payment_Mode}
            </Text>
            <Text style={styles.detailText}>
              Amount Received: {details.Amount_Received}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.whiteBg]}>S.NO</Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>
              Document Number
            </Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>
              Document Date
            </Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>
              Document Amount
            </Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>
              Amount Due
            </Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>
              Payment Amount
            </Text>
          </View>
          {tableData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.whiteBg]}>
                {rowIndex + 1}
              </Text>
              <Text style={[styles.tableCell, styles.whiteBg]}>
                {row["Document Number"]}
              </Text>
              <Text style={[styles.tableCell, styles.lightGreyBg]}>
                {row["Document Date"]}
              </Text>
              <Text style={[styles.tableCell, styles.whiteBg]}>
                {row["Document Amount"]}
              </Text>
              <Text style={[styles.tableCell, styles.lightGreyBg]}>
                {row["Amount Due"]}
              </Text>
              <Text style={[styles.tableCell, styles.whiteBg]}>
                {row["Payment Amount"]}
              </Text>
            </View>
          ))}
        </View>
        <View className="py-2 self-end" style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={[styles.detailText, { width: "30%" }]}>
              Amount Received:
            </Text>
            <Text style={[styles.detailText, { textAlign: "right" }]}>
              {totalAmountPaid}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={[styles.detailText, { width: "30%" }]}>
              Amount Pending:
            </Text>
            <Text style={[styles.detailText, { textAlign: "right" }]}>
              {combinedBill}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={[styles.detailText, { width: "30%" }]}>
              Amount Used For Payment:
            </Text>
            <Text style={[styles.detailText, { textAlign: "right" }]}>
              {details.Amount_Received}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={[styles.detailText, { width: "30%" }]}>
              Amount in excess:
            </Text>
            <Text style={[styles.detailText, { textAlign: "right" }]}>
              {details.Amount_Received > combinedBill
                ? details.Amount_Received - combinedBill
                : 0}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your payment!</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 10,
  },
  logo_container: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  header_container: {
    position: "relative",
    marginBottom: 10,
  },
  company_details: {
    marginLeft: 10,
  },
  company_name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    marginBottom: 3,
  },
  invoice_title_container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  invoice_title: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  bill_ship_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bill_to: {},
  ship_to: {},
  table: {
    display: "block",
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    fontSize: 10,
    padding: 5,
    border: "none",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 8,
    padding: 8,
    border: "none",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteBg: {
    backgroundColor: "#fff",
    width: "16.66%",
  },
  lightGreyBg: {
    backgroundColor: "#f3f3f3",
    width: "16.66%",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
});

export default PaymentReceipt;
