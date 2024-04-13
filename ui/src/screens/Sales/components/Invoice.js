import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Button } from "@material-tailwind/react";
const { ipcRenderer } = window.require("electron");

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

    if (n === 0) return "Zero";

    // Recursive function to translate the number into words
    function translate(n) {
      let word = "";
      if (n < 10) {
        word = single_digit[n] + " ";
      } else if (n < 20) {
        word = double_digit[n - 10] + " ";
      } else if (n < 100) {
        let remainder = n % 10;
        if (remainder !== 0) {
          word =
            below_hundred[Math.floor(n / 10)] +
            " " +
            single_digit[remainder] +
            " ";
        } else {
          word = below_hundred[Math.floor(n / 10)] + " ";
        }
      } else if (n < 1000) {
        word =
          single_digit[Math.floor(n / 100)] + " Hundred " + translate(n % 100);
      } else if (n < 1000000) {
        word =
          translate(Math.floor(n / 1000)) + " Thousand " + translate(n % 1000);
      } else if (n < 1000000000) {
        word =
          translate(Math.floor(n / 1000000)) +
          " Million " +
          translate(n % 1000000);
      } else {
        word =
          translate(Math.floor(n / 1000000000)) +
          " Billion " +
          translate(n % 1000000000);
      }
      return word;
    }

    // Get the result by translating the given number
    let result = translate(n);
    return result.trim() + " rupees only.";
  }

  function formatDate(dateString) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const [year, month, day] = dateString.split("-");
    const formattedDate = `${parseInt(day)} ${
      months[parseInt(month) - 1]
    } ${parseInt(year)}`;

    return formattedDate;
  }
  const totalValue = data
    .reduce((accumulator, currentItem) => {
      const value = parseFloat(currentItem.Value);
      const cgst = parseFloat(currentItem.CGST);
      const sgst = parseFloat(currentItem.SGST);
      const igst = parseFloat(currentItem.IGST);

      // Add Value, CGST, SGST, and IGST to the accumulator
      return accumulator + value + cgst + sgst + igst;
    }, 0)
    .toFixed(2);
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header_container}>
            {/* Logo on the top left corner */}
            <View style={styles.logo_container}>
              {/* Insert your company logo here */}
              <Text>Company Logo</Text>
            </View>

            {/* Company details on the top right corner */}
            <View style={styles.company_details}>
              <Text style={styles.company_name}>Your Company</Text>
              <Text style={styles.detail_text}>123 Street, City, Country</Text>
              <Text style={styles.detail_text}>info@company.com</Text>
              <Text style={styles.detail_text}>+1234567890</Text>
            </View>
          </View>

          <View style={styles.invoice_title_container}>
            <View style={styles.line}></View>
            <Text style={styles.invoice_title}>INVOICE</Text>
            <View style={styles.line}></View>
          </View>

          <View style={styles.bill_ship_container}>
            {/* Bill To section on the left */}
            <View style={styles.bill_to}>
              <Text style={styles.sub_header}>Bill To:</Text>
              {/* Your bill to details here */}
            </View>

            {/* Ship To section on the right */}
            <View style={styles.ship_to}>
              <Text style={styles.sub_header}>Ship To:</Text>
              {/* Your ship to details here */}
            </View>
          </View>

          {/* Table with Invoice Date, Terms, and Due Date */}
          <View style={styles.invoice_details_container}>
            <View style={styles.table_row}>
              <Text
                style={[
                  styles.tableCell,
                  styles.whiteBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                Invoice Date
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.lightGreyBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                Payment Terms
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.whiteBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                Due Date
              </Text>
            </View>
            <View style={styles.table_row}>
              <Text
                style={[
                  styles.tableCell,
                  styles.whiteBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                {formatDate(details.Issue_Date)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.lightGreyBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                {details.Payment_Term}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.whiteBg,
                  { width: "33%" }, // Adjusted width for the fourth column
                ]}
              >
                {formatDate(details.Due_Date)}
              </Text>
            </View>
          </View>

          {/* Invoice Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableHeader,
                  styles.whiteBg,
                  { flexBasis: "5%" }, // Adjusted width
                ]}
              >
                S.No
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  styles.lightGreyBg,
                  { flexBasis: "19%" }, // Adjusted width
                ]}
              >
                Product
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  styles.whiteBg,
                  { flexBasis: "19%" }, // Adjusted width
                ]}
              >
                HSN/SAC
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  styles.lightGreyBg,
                  { flexBasis: "13%" }, // Adjusted width
                ]}
              >
                Qty
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  styles.whiteBg,
                  { flexBasis: "19%" }, // Adjusted width
                ]}
              >
                Unit Price
              </Text>
              <Text
                style={[
                  styles.tableHeader,
                  styles.lightGreyBg,
                  { flexBasis: "25%" }, // Adjusted width
                ]}
              >
                Amount
              </Text>
            </View>
            {data.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "5%" }, // Adjusted width for the first column
                  ]}
                >
                  {index + 1}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "19%" }, // Adjusted width for the second column
                  ]}
                >
                  {item.Product}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "19%" }, // Adjusted width for the third column
                  ]}
                >
                  {item.HSNSAC}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "13%" }, // Adjusted width for the fourth column
                  ]}
                >
                  {item.Qty}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "19%" }, // Adjusted width for the fifth column
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
                <Text
                  style={[
                    styles.tableCell,
                    index % 2 === 0 ? styles.whiteBg : styles.lightGreyBg,
                    { width: "25%" }, // Adjusted width for the sixth column
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
            <Text style={styles.totalValue}>{totalValue}</Text>
          </View>

          {/* Total Amount in Words */}
          <View style={styles.totalAmountInWords}>
            <Text style={styles.totalText}>Total Amount in Words:</Text>
            <Text style={styles.totalText}>
              {convertAmountToWords(totalValue)}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.totalAmountInWords}>
            <Text>Note:{details.Notes}</Text>
          </View>
          <View style={styles.footer}>
            <Text>Thank you for your business!</Text>
          </View>
        </Page>
        <View style={styles.buttonContainer}>
          <Button onClick={() => alert("hello")}>Save</Button>
        </View>
      </Document>
    </>
  );
};
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 10, // Adjusted padding
  },
  logoContainer: {
    position: "absolute",
    top: 10, // Adjusted position
    right: 10, // Adjusted position
  },
  header: {
    fontSize: 20, // Decreased font size
    marginBottom: 15, // Adjusted margin
    textAlign: "center",
    textDecoration: "underline",
  },
  subHeader: {
    fontSize: 14, // Decreased font size
    marginBottom: 8, // Adjusted margin
    textDecoration: "underline",
  },
  details: {
    marginBottom: 15, // Adjusted margin
  },
  detailText: {
    fontSize: 10, // Decreased font size
    marginBottom: 5, // Adjusted margin
  },
  invoice_title_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  table: {
    display: "block",
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    fontSize: 10, // Decreased font size
    padding: 5,
    border: "none",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCell: {
    fontSize: 8, // Decreased font size
    padding: 8,
    border: "none",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 8, // Adjusted margin
  },
  totalText: {
    fontSize: 10, // Decreased font size
    marginRight: 10,
  },
  totalValue: {
    fontSize: 10, // Decreased font size
    fontWeight: "bold",
  },
  totalAmountInWords: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8, // Adjusted margin
  },
  footer: {
    position: "absolute",
    bottom: 10, // Adjusted position
    left: 10, // Adjusted position
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo_container: {
    // Your logo container styles
  },
  company_details: {
    // Your company details styles
  },
  invoice_title_container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  invoice_title_line: {
    // Your line styles
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  invoice_title: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  bill_ship_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bill_to: {
    // Your bill to styles
  },
  ship_to: {
    // Your ship to styles
  },
  invoice_details_container: {
    marginBottom: 20,
  },
  table_row: {
    flexDirection: "row",
  },

  table_header: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center", // Center text horizontally
    padding: 8, // Adjusted padding
    borderColor: "#ccc", // Added border color
    borderWidth: 1, // Added border width
  },
  table_cell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center", // Center text horizontally
    padding: 8, // Adjusted padding
    borderColor: "#ccc", // Added border color
    borderWidth: 1, // Added border width
  },
  company_name: {
    fontSize: 14, // Reduced font size for company name
    fontWeight: "bold", // Optional: keep it bold for emphasis
    marginBottom: 5, // Reduced margin below company name
  },
  detail_text: {
    fontSize: 12, // Reduced font size for other details
    marginBottom: 3, // Reduced margin below each detail
  },
  buttonContainer: {
    position: "absolute",
    top: 100,
    right: 100,
  },
});

export default Invoice;
