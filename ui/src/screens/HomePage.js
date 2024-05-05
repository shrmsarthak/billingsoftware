import React, { useEffect } from "react";
import { useState } from "react";
import User from "../assets/images/User.png";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  List,
  ListItem,
  Input,
} from "@material-tailwind/react";

import {
  api_show_invoice,
  api_show_client,
  api_show_product,
  api_add_company,
  api_show_quotation,
  api_show_debit,
  api_show_vendor,
  api_show_payment,
  api_new_purchase,
  api_new_invoice,
  api_new_quotation,
  api_show_expense,
  api_add_credit,
  api_add_debit,
} from "../utils/PageApi";
import { get_invoice_count } from "../utils/SelectOptions";
import { Link, useLocation } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const options = {
  sales: [
    { title: "New Invoice", onClick: api_new_invoice },
    { title: "New Quotations", onClick: api_new_quotation },
    { title: "New Credit Notes", onClick: api_add_credit },
    { title: "New Debit Notes", onClick: api_add_debit },
  ],
  purchase: [
    { title: "New Purchase Orders", onClick: api_new_purchase },
    { title: "Expenses", onClick: api_show_expense },
  ],
  settings: [{ title: "Company Details", onClick: api_add_company }],
};

const Icon = ({ id, open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={`${
      id === open ? "rotate-180" : ""
    } h-5 w-5 transition-transform`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const MyAccordion = ({ title, options, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="px-5">
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader
          className="text-xs text-white font-normal"
          onClick={() => handleOpen(1)}
          style={{ justifyContent: "center" }}
        >
          {title}
        </AccordionHeader>
        <AccordionBody>
          <List className="text-xs text-white font-normal">
            {options.map((value, idx) => (
              <ListItem key={idx} onClick={value.onClick}>
                {value.title}
              </ListItem>
            ))}
          </List>
        </AccordionBody>
      </Accordion>
    </div>
  );
};

// function ShortCutCard({ title, to, color }) {
//   return (
//     <Link to={to}>
//       <div
//         className="flex flex-col mb-3 bg-clip-border rounded border-2 border-primary p-6 bg-gray-100 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
//         style={{
//           minWidth: "300px",
//           maxWidth: "300px",
//           alignItems: "center",
//           maxHeight: "144px",
//           height: 144,
//           justifyContent: "center",
//           background:
//             "radial-gradient(circle, rgba(255,255,255,1) 0%, rgb(202 203 216 / 53%) 46%, rgb(33 150 243 / 0.5) 100%)",
//         }}
//       >
//         <div className="">
//           <h1 className="text-sm font-bold text-gray-600 dark:text-white">
//             {title}
//           </h1>
//         </div>
//       </div>
//     </Link>
//   );
// }

function ShortCutCard({ title, to, color, icon }) {
  const renderTitle = () => {
    if (!title) return null;

    const firstChar = title.charAt(0);
    const restChars = title.slice(1);

    return (
      <h1
        className="text-sm font-bold text-white"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <span className="text-3xl">{firstChar}</span>
        {restChars}
        {icon && <span className="ml-2">{icon}</span>}
      </h1>
    );
  };

  return (
    <Link to={to}>
      <div
        className="flex flex-col mb-3 bg-clip-border rounded border-2 border-primary p-6 bg-gray-100 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        style={{
          minWidth: "300px",
          maxWidth: "300px",
          alignItems: "center",
          maxHeight: "144px",
          height: 144,
          justifyContent: "center",
          background: color,
        }}
      >
        <div className="">{renderTitle()}</div>
      </div>
    </Link>
  );
}

const invoiceCount = await get_invoice_count();

export default function HomePage() {
  useEffect(() => {
    document.title = "Billing System";
  });
  const location = useLocation();

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log("key pressed: ", event.key);
      if (event.key === "i" || event.key === "I") {
        window.location.href = "/sales/invoice/new";
      }
      if (event.key === "q" || event.key === "Q") {
        window.location.href = "/sales/quotation/new";
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const [open, setOpen] = useState(true);

  return (
    <div className="flex justify-evenly w-full h-full ">
      <div
        className={` ${
          open ? "w-96" : "w-20 "
        } bg-dark-blue h-screen duration-300 sticky top-0 overflow-y-auto`}
      >
        <div className="flex gap-x-4 items-center p-5 bg-cyan-600 ">
          <img
            src={User}
            className={`cursor-pointer duration-500`}
            onClick={() => setOpen(!open)}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Billing System
          </h1>
        </div>

        {open ? (
          <>
            <List className="text-xs text-white font-normal flex justify-center">
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "large",
                }}
              >
                <svg
                  className="w-[30px] h-[30px] text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "2px" }}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                  />
                </svg>
                Home
              </ListItem>
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "large",
                }}
              >
                <svg
                  className="w-[30px] h-[30px] text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "2px" }}
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Client
              </ListItem>
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "large",
                }}
              >
                <svg
                  className="w-[30px] h-[30px] text-white dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ marginRight: "2px" }}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z"
                  />
                </svg>
                Product
              </ListItem>
            </List>

            <MyAccordion
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "large",
                  }}
                >
                  <svg
                    className="w-[30px] h-[30px] text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ marginRight: "2px" }}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                    />
                  </svg>{" "}
                  Sales
                </div>
              }
              options={options.sales}
              defaultOpen={1}
            />
            <MyAccordion
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "large",
                  }}
                >
                  <svg
                    className="w-[30px] h-[30px] text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ marginRight: "2px" }}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                    />
                  </svg>
                  Purchase
                </div>
              }
              options={options.purchase}
            />
            <MyAccordion
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "large",
                  }}
                >
                  <svg
                    className="w-[30px] h-[30px] text-white dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ marginRight: "2px" }}
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  Settings
                </div>
              }
              options={options.settings}
            />
          </>
        ) : null}
      </div>

      <div className="flex flex-col items-center p-4 h-screen  justify-center w-full m-4">
        <div
          className=" flex  static  justify-center w-full gap-x-32"
          style={{ marginBottom: 100 }}
        >
          <div
            className="cursor-pointer flex items-center justify-center uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#23d2d8b0,-0.5rem_-0.5rem_#003899c9] hover:scale-105 transition-transform w-200 h-150 border border-gray-300 rounded-md shadow-[0.5rem_0.5rem_#23d2d8b0,-0.5rem_-0.5rem_#003899c9]"
            style={{ height: 150 }}
          >
            <div className="text-center">
              <span className="text-lg text-gray-600">Today's Sale</span> <br />
              <span className="font-bold text-black text-2xl mt-10">
                &#8377;10,000
              </span>
            </div>
          </div>

          <div
            className="cursor-pointer flex items-center justify-center uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#003899c9,-0.5rem_-0.5rem_#23d2d8b0] hover:scale-105 transition-transform w-200 h-150 border border-gray-300 rounded-md shadow-[0.5rem_0.5rem_#003899c9,-0.5rem_-0.5rem_#23d2d8b0]"
            style={{ height: 150 }}
          >
            <div className="text-center">
              <span className="text-lg text-gray-600">Total Orders</span> <br />
              <span className="font-bold text-black text-2xl mt-10">
                {invoiceCount}
              </span>
            </div>
          </div>
          <div
            className="cursor-pointer flex items-center justify-center uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#23d2d8b0,-0.5rem_-0.5rem_#003899c9] hover:scale-105 transition-transform w-200 h-150 border border-gray-300 rounded-md shadow-[0.5rem_0.5rem_#23d2d8b0,-0.5rem_-0.5rem_#003899c9]"
            style={{ height: 150 }}
          >
            <div className="text-center">
              <span className="text-lg text-gray-600">Pending Orders</span>{" "}
              <br />
              <span className="font-bold text-black text-2xl mt-10">5</span>
            </div>
          </div>
          <div
            className="cursor-pointer flex items-center justify-center uppercase bg-white px-4 py-2 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[0.5rem_0.5rem_#003899c9,-0.5rem_-0.5rem_#23d2d8b0] hover:scale-105 transition-transform w-200 h-150 border border-gray-300 rounded-md shadow-[0.5rem_0.5rem_#003899c9,-0.5rem_-0.5rem_#23d2d8b0]"
            style={{ height: 150 }}
          >
            <div className="text-center">
              <span className="text-lg text-gray-600">Sales Done</span> <br />
              <span className="font-bold text-black text-2xl mt-10">14</span>
            </div>
          </div>
        </div>
        <div className="main-container flex justify-center">
          <div className="three-column-container flex w-full max-w-screen-lg">
            {/* First column */}
            <div className="column">
              {/* Content of the first column */}
              <div className="flex flex-col mr-4">
                <ShortCutCard
                  title="SALES"
                  to="/sales/invoice/new"
                  color="#74B72E"
                  icon={
                    <svg
                      className="w-[30px] h-[30px] text-white dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginRight: "2px" }}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                      />
                    </svg>
                  }
                />
                <ShortCutCard
                  title="LEDGER"
                  to="/sales/ledger/show"
                  color="#74B72E"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M8 6h8M6 10h12M8 14h8M6 18h12"
                      />
                    </svg>
                  }
                />
                <ShortCutCard
                  title="REPORTS"
                  to="/sales/invoice/show"
                  color="#74B72E"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                      />
                    </svg>
                  }
                />

                <ShortCutCard
                  title={"PAYMENT"}
                  to="/sales/payment/new"
                  color="#74B72E"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginRight: 2 }}
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M5 12h14m-7 7V5"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
            {/* Second column */}
            <div className="column">
              {/* Content of the second column */}{" "}
              <div className="flex flex-col mr-4">
                <ShortCutCard
                  title="PURCHASE"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  }
                  to="/sales/purchase/new"
                  color="#990F02"
                />

                <ShortCutCard
                  title="INVENTORY"
                  to="/sales/inventory/show"
                  color="#990F02"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
                      />
                    </svg>
                  }
                />

                <ShortCutCard
                  title="EMPLOYEE MANAGEMENT"
                  to="/mgmt/employee/show"
                  color="#990F02"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="square"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  }
                />
                <ShortCutCard
                  title="EXPENSES"
                  to="/sales/expense/show"
                  color="#990F02"
                  icon={
                    <svg
                      class="w-[30px] h-[30px] text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginRight: 2 }}
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M5 12h14m-7 7V5"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
            {/* Third column */}
            <div className="column" style={{ margin: "380px 0px 0px 350px" }}>
              <div className="flex flex-col mr-4">
                <List className="text-black font-normal flex justify-center">
                  <ListItem
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "large",
                    }}
                  >
                    <svg
                      class="w-[30px] h-[30px] text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="1.5"
                        d="M8.737 8.737a21.49 21.49 0 0 1 3.308-2.724m0 0c3.063-2.026 5.99-2.641 7.331-1.3 1.827 1.828.026 6.591-4.023 10.64-4.049 4.049-8.812 5.85-10.64 4.023-1.33-1.33-.736-4.218 1.249-7.253m6.083-6.11c-3.063-2.026-5.99-2.641-7.331-1.3-1.827 1.828-.026 6.591 4.023 10.64m3.308-9.34a21.497 21.497 0 0 1 3.308 2.724m2.775 3.386c1.985 3.035 2.579 5.923 1.248 7.253-1.336 1.337-4.245.732-7.295-1.275M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                    Help
                  </ListItem>
                  <ListItem
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "large",
                    }}
                  >
                    <svg
                      class="w-[30px] h-[30px] text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"
                      />
                    </svg>
                    Learn Shortcut
                  </ListItem>
                  <ListItem
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "large",
                    }}
                  >
                    <svg
                      class="w-[30px] h-[30px] text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
                      />
                    </svg>
                    Video Tutorial
                  </ListItem>
                  <ListItem
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "large",
                    }}
                  >
                    <svg
                      class="w-[30px] h-[30px] text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M14.079 6.839a3 3 0 0 0-4.255.1M13 20h1.083A3.916 3.916 0 0 0 18 16.083V9A6 6 0 1 0 6 9v7m7 4v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-7-4v-6H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1Zm12-6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v-6Z"
                      />
                    </svg>
                    Customer Support
                  </ListItem>
                </List>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
