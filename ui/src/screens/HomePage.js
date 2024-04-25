import React, { useEffect } from "react";
import { useState } from "react";
import User from "../assets/images/User.png";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  List,
  ListItem,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";

import {
  api_show_invoice,
  api_show_client,
  api_new_invoice,
  api_show_product,
  api_add_company,
  api_show_quotation,
  api_add_debit,
  api_show_debit,
  api_add_credit,
  api_show_credit,
  api_show_payment,
} from "../utils/PageApi";
import { Link } from "react-router-dom";

const options = {
  sales: [
    { title: "Invoice", onClick: api_show_invoice },
    { title: "Quotations, Proformas & Challans", onClick: api_show_quotation },
    { title: "Credit Notes", onClick: api_show_credit },
    { title: "Debit Notes", onClick: api_show_debit },
    { title: "Payment Documents", onClick: api_show_payment },
    { title: "Clients", onClick: api_show_client },
    { title: "Products/Services", onClick: api_show_product },
  ],
  purchase: [
    { title: "Vendors", onClick: api_show_invoice },
    { title: "Bills", onClick: api_show_invoice },
    { title: "Purchase Orders", onClick: api_show_invoice },
    { title: "Expenses", onClick: api_show_invoice },
  ],
  tools: [
    { title: "Backup Data", onClick: api_show_invoice },
    { title: "Restore Data", onClick: api_show_invoice },
    { title: "GSTR Reports", onClick: api_show_invoice },
    { title: "Inventory & Sales Reports", onClick: api_show_invoice },
  ],
  settings: [
    { title: "Company Details", onClick: api_add_company },
    { title: "Taxes", onClick: api_show_invoice },
    { title: "Email", onClick: api_show_invoice },
    { title: "Preferences", onClick: api_show_invoice },
  ],
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

function ShortCutCard({ title, to, color }) {
  return (
    <Link to={to}>
      <div
        className="flex flex-col mb-3 bg-clip-border rounded border-2 border-primary p-6 bg-gray-100 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        style={{
          minWidth: "300px",
          maxWidth: "300px",
          alignItems: "center",
          padding: 60,
          maxHeight: "144px",
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgb(202 203 216 / 53%) 46%, rgb(33 150 243 / 0.5) 100%)"
        }}
      >
        <div className="">
          <h3 className="text-sm font-bold text-gray-600 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = "Billing System";
  });
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
            <MyAccordion
              title="SALES REPORTS"
              options={options.sales}
              defaultOpen={1}
            />
            <MyAccordion title="PURCHASE REPORTS" options={options.purchase} />
            <MyAccordion title="TOOLS" options={options.tools} />
            <MyAccordion title="SETTINGS" options={options.settings} />
          </>
        ) : null}
      </div>

      <div className="flex flex-col items-center p-4 h-screen  justify-center w-full m-4">
        <div
          className=" flex  static  justify-center w-full gap-x-16"
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
              <span className="font-bold text-black text-2xl mt-10">22</span>
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
        <div className=" mt-3 flex flex-col items-center">
          <div className="flex justify-evenly gap-32">
            <div>
              <div className="flex flex-col mr-4">
                <ShortCutCard title="SALES" to="/sales/invoice/show" />

                <ShortCutCard title="PAYMENT" to="/sales/payment/show" />

                <ShortCutCard title="LEDGER" to="/sales/ledger/show" />

                <ShortCutCard title="EXPENSES" />
              </div>
            </div>
            <div>
              <div className="flex flex-col">
                <ShortCutCard title="PURCHASE" />

                <ShortCutCard title="REPORTS" />

                <ShortCutCard title="INVENTORY" />

                <ShortCutCard title="EMPLOYEE MANAGEMENT" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
