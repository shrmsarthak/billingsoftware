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
} from "../utils/PageApi";

const options = {
  sales: [
    { title: "Invoice", onClick: api_show_invoice },
    { title: "Quotations, Proformas & Challans", onClick: api_show_client },
    { title: "Credit Notes", onClick: api_show_client },
    { title: "Debit Notes", onClick: api_show_client },
    { title: "Payment Documents", onClick: api_show_client },
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
    { title: "Compamy Details", onClick: api_show_invoice },
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

function NewVoiceCard({ onClick }) {
  return (
    <Card className="border border-gray-300 my-4">
      <CardBody onClick={onClick}>
        <div className="flex flex-col w-full justify-center items-center hover:cursor-pointer ">
          <div className="text-xl">New Invoice</div>
        </div>
      </CardBody>
    </Card>
  );
}

function ShortCutCard({ title, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col mb-3
      bg-clip-border rounded border-2 border-primary p-6 bg-gray-100 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:border-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
    >
      <div className="">
        <h3 className="text-sm font-bold text-gray-600 dark:text-white">
          + {title}
        </h3>
      </div>
    </div>
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
        <div className=" flex  static  justify-center w-full gap-x-4">
          <div className="">
            <Button color="blue" className=" border-none px-4 py-2">
              Unpaid Invoices{" "}
            </Button>
          </div>
          <div>
            {" "}
            <Button color="blue" className=" border-none px-4 py-2">
              Overdue Quotes{" "}
            </Button>
          </div>
          <div>
            <Button color="blue" className=" border-none px-4 py-2">
              Low Stock Items{" "}
            </Button>
          </div>
          <div>
            {" "}
            <Button color="blue" className=" border-none px-4 py-2">
              Unpaid Bills{" "}
            </Button>
          </div>
        </div>
        <div className=" mt-1 flex flex-col items-center">
          <div className="w-full">
            <NewVoiceCard onClick={api_new_invoice} />
          </div>
          <div className="flex justify-evenly gap-3">
            <div>
              <div className="flex flex-col mr-1">
                <ShortCutCard title="QUOTATION" />

                <ShortCutCard title="PROFORMA INVOICE" />

                <ShortCutCard title="BILL OF SUPPLY" />

                <ShortCutCard title="CREDIT NOTE" />
              </div>
            </div>
            <div>
              <div className="flex flex-col">
                <ShortCutCard title="DELIVERY NOTE/CHALLAN" />

                <ShortCutCard title="PURCHASE ORDER" />

                <ShortCutCard title="BILL" />

                <ShortCutCard title="DEBIT NOTE" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-6">
              <Button color="blue">+ EXPENSE</Button>
              <Button color="blue">+ PAYMENT</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
