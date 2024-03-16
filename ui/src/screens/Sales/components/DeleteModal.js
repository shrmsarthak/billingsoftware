import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function DeleteModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  closeDeleteModal,
  handleDelete,
}) {
  return (
    <>
      <Dialog
        open={isDeleteModalOpen}
        handler={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        size="xs"
      >
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            Confirmation
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>Are you sure want to delete?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={closeDeleteModal}
            className="mr-1"
          >
            <span>No</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleDelete}>
            <span>Yes</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
