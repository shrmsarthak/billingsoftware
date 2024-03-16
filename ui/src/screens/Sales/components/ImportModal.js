import React, { useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

export function ImportModal({
  open,
  handleOpen,
  isClient = false,
  isProduct = false,
  downloadSampleFile,
  uploadFile,
}) {
  const fileInputRef = useRef(null); // Create a ref for the file input
  const handleButtonClick = () => {
    // Trigger file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader>
            <Typography variant="h5" color="blue-gray">
              Import Clients
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider className="grid place-items-center gap-4">
          <Typography color="blue" variant="h4">
            Importing Your Clients from Excel(.xls)
          </Typography>

          <Typography variant="h4">Follow these steps:</Typography>
          <Typography className="font-normal">
            <div>
              1. Download the Excel template to your computer by clicking the
              Download Sample button.
            </div>
            <div>
              2 Integrate your data into the template file, minding the column
              order.
            </div>
            <div>3 Click Upload File.</div>
          </Typography>
          <Typography variant="h4">IMPORTANT :</Typography>
          <Typography className="font-normal">
            <div>- Do not change the column order in the template file.</div>
            <div>
              - If you do not have data for a particular column, leave it empty
              and do not move or delete the column.
            </div>
            {isClient && (
              <div>
                - If the shipping address is the same as the billing address,
                leave the shipping address columns empty.
              </div>
            )}
          </Typography>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={downloadSampleFile}>
            Download Sample
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={uploadFile}
            accept=".xlsx"
          />

          <Button color="indigo" onClick={handleButtonClick}>
            Upload File
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
