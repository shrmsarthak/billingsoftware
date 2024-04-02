import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Invoice = ({ data, details }) => {
  // Calculate total amount
  const totalAmount = data.reduce(
    (acc, item) =>
      acc + item.Unit_Price * item.Qty * (1 - parseFloat(item.Discount) / 100),
    0
  );

  // Function to convert total amount to words
  const convertAmountToWords = (amount) => {
    // Function to convert numbers to words
    // This is a simplified version, you can use a library for more precise conversion
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const numToWords = (num) => {
      if (num < 10) return units[num];
      if (num >= 10 && num < 20) return teens[num - 10];
      const digit = num % 10;
      const ten = Math.floor(num / 10);
      return `${tens[ten]} ${units[digit]}`;
    };

    const amountString = amount.toFixed(2).toString().split(".");
    const dollars = parseInt(amountString[0], 10);
    const cents = parseInt(amountString[1] || "0", 10);
    return `${numToWords(dollars)} dollars and ${numToWords(cents)} cents`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Logo (Top Right Corner) */}
        <View style={styles.logoContainer}>
          {/* Insert your company logo here */}
          <Text>Company Logo</Text>
        </View>

        {/* Invoice Title */}
        <Text style={styles.header}>Invoice</Text>

        {/* Company Details */}
        <View style={styles.details}>
          <Text style={styles.detailText}>Company Name: Your Company</Text>
          <Text style={styles.detailText}>
            Address: 123 Street, City, Country
          </Text>
          <Text style={styles.detailText}>Email: info@company.com</Text>
          <Text style={styles.detailText}>Phone: +1234567890</Text>
        </View>

        {/* Client Details */}
        <View style={styles.details}>
          <Text style={styles.subHeader}>Client Information</Text>
          {Object.entries(details).map(([key, value]) => (
            <Text key={key} style={styles.detailText}>
              {key}: {value}
            </Text>
          ))}
        </View>

        {/* Invoice Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.whiteBg]}>S.No</Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>
              Product
            </Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>
              Description
            </Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>Qty</Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>Unit Price</Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>
              Discount
            </Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>Amount</Text>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Product}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Description}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Qty}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Unit_Price}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Discount}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Unit_Price *
                  item.Qty *
                  (1 - parseFloat(item.Discount) / 100)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View style={styles.totalAmount}>
          <Text style={styles.totalText}>Total Amount:</Text>
          <Text style={styles.totalValue}>{totalAmount.toFixed(2)}</Text>
        </View>

        {/* Total Amount in Words */}
        <View style={styles.totalAmountInWords}>
          <Text>Total Amount in Words:</Text>
          <Text>{convertAmountToWords(totalAmount)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    textDecoration: "underline",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    textDecoration: "underline",
  },
  details: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
    borderCollapse: "collapse",
    border: "none", // Make the entire table border invisible
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    fontSize: 12,
    padding: 5,
    border: "none", // Make the entire table border invisible
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    padding: 5,
    border: "none", // Make the entire table border invisible
  },
  whiteBg: {
    backgroundColor: "#fff",
  },
  lightGreyBg: {
    backgroundColor: "#f3f3f3",
  },
  totalAmount: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  totalText: {
    fontSize: 12,
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  totalAmountInWords: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
});

export default Invoice;
