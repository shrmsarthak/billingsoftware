import React from "react";
import { Link } from "react-router-dom";

const BackButton = ({ to }) => {
  return (
    <Link to={to}>
      <button
        className="cursor-pointer duration-200 hover:scale-110 active:scale-100"
        title="Go Back"
        style={{
          border: "1px solid lightslategray",
          marginLeft: 20,
          padding: 8,
          borderRadius: 5,
        }}
      >
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
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
            stroke-width="2"
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
      </button>
    </Link>
  );
};

export default BackButton;
