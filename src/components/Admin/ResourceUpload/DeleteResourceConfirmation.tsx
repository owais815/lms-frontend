import React, { useState } from 'react';
import { DeleteIcon } from '../../Icons/DeleteIcon';
import { toast } from 'react-toastify';
import { deleteResource } from '../../../api/auth';
import CrossIcon from '../../Icons/CrossIcon';
import { Loader } from '../../Loader';


interface DeleteResourceConfirmationProps {
  resourceId: string;
  onDeleteSuccess: () => void;
}

const DeleteResourceConfirmation: React.FC<DeleteResourceConfirmationProps> = ({ resourceId, onDeleteSuccess }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleConfirmDelete = async () => {
    setIsLoading(true); // Show loader
    try {
      await deleteResource(resourceId);
      toast.success('Resource deleted successfully');
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    } finally {
      setIsLoading(false); // Hide loader
      setShowDeleteDialog(false);
      onDeleteSuccess();
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDeleteDialog(true)}
        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
      >
        <DeleteIcon />
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
            <button
              onClick={() => setShowDeleteDialog(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <CrossIcon /> {/* Cross icon to close the modal */}
            </button>
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this resource?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? <Loader /> : 'Delete'} {/* Show loader or text */}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteResourceConfirmation;
