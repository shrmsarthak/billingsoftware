import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Invoice = ({ data, details }) => {
  // Calculate total amount
  const totalAmount = data.reduce(
    (acc, item) =>
      acc + item.UnitPrice * item.Qty * (1 - parseFloat(item.Discount) / 100),
    0
  );

  function convertAmountToWords(n) {
    if (n < 0) return false;

    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    let single_digit = [
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
    let double_digit = [
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
    let below_hundred = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (n === 0) return "Zero";

    // Recursive function to translate the number into words
    function translate(n) {
      let word = "";
      if (n < 10) {
        word = single_digit[n] + " ";
      } else if (n < 20) {
        word = double_digit[n - 10] + " ";
      } else if (n < 100) {
        let rem = translate(n % 10);
        word = below_hundred[(n - (n % 10)) / 10 - 2] + " " + rem;
      } else if (n < 1000) {
        word =
          single_digit[Math.trunc(n / 100)] + " Hundred " + translate(n % 100);
      } else if (n < 1000000) {
        word =
          translate(parseInt(n / 1000)).trim() +
          " Thousand " +
          translate(n % 1000);
      } else if (n < 1000000000) {
        word =
          translate(parseInt(n / 1000000)).trim() +
          " Million " +
          translate(n % 1000000);
      } else {
        word =
          translate(parseInt(n / 1000000000)).trim() +
          " Billion " +
          translate(n % 1000000000);
      }
      return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim() + " rupees only.";
  }
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Logo (Top Right Corner) */}
        <View style={styles.logoContainer}>
          {/* Insert your company logo here */}
          <Text>Company Logo</Text>

          {/* Client Details */}
          <View style={styles.details}>
            <Text style={styles.subHeader}>Client Information</Text>
            {Object.entries(details).map(([key, value]) => (
              <Text key={key} style={styles.detailText}>
                {key}: {value}
              </Text>
            ))}
          </View>
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

        {/* Invoice Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.whiteBg]}>S.No</Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>
              Product
            </Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>HSN/SAC</Text>
            <Text style={[styles.tableHeader, styles.lightGreyBg]}>Qty</Text>
            <Text style={[styles.tableHeader, styles.whiteBg]}>Unit Price</Text>
            {/* <Text style={[styles.tableHeader, styles.lightGreyBg]}>Tax</Text> */}
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
                {item.HSNSAC}
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
                {item.UnitPrice}
                {item.Discount !== "0%" && (
                  <>
                    {"\n"}
                    <Text style={styles.discountText}>
                      Discount-{item.Discount}
                    </Text>
                  </>
                )}
              </Text>
              {/* <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {item.Discount}
              </Text> */}
              <Text
                style={[
                  styles.tableCell,
                  index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                ]}
              >
                {(
                  item.UnitPrice *
                  item.Qty *
                  (1 - parseFloat(item.Discount) / 100)
                ).toFixed(2)}
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
          <Text style={styles.totalText}>Total Amount in Words:</Text>
          <Text style={styles.totalText}>
            {convertAmountToWords(totalAmount)}
          </Text>
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
    display: "block",
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
    padding: 8, // Adjust padding as needed for proper alignment
    border: "none", // Make the entire table border invisible
    textAlign: "left", // Align content to the left
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
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
  discountText: {
    color: "#615e5e",
  },
});

export default Invoice;
