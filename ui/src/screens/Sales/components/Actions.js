import { PencilIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/solid";

export const Actions = ({ handleEdit, handleDelete, handleView }) => {
  return (
    <div className="flex items-center gap-4">
      {handleEdit && <PencilIcon className="h-4 w-4" onClick={handleEdit} />}

      {handleView && <EyeIcon className="h-4 w-4" onClick={handleView} />}

      {handleDelete && <XMarkIcon className="h-4 w-4" onClick={handleDelete} />}
    </div>
  );
};
