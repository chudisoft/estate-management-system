import React from 'react';
import { Rent } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCalendarAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteRent } from '../../store/rentSlice';
import { AppDispatch } from '../../store/index';

interface RentCardProps {
  rent: Rent;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RentCard: React.FC<RentCardProps> = ({ rent, onEdit, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteRent(rent.id.toString()));
    onDelete(rent.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-gray-600" />
        Amount: ${rent.amount.toFixed(2)}
      </h3>
      <p className="text-gray-700 flex items-center mb-2">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-600" />
        Due Date: {new Date(rent.dueDate).toLocaleDateString()}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(rent.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RentCard;
