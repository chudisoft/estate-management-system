import React from 'react';
import { BookingStatus } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteBookingStatus } from '../../store/bookingStatusSlice';
import { AppDispatch } from '../../store/index';

interface BookingStatusCardProps {
  bookingStatus: BookingStatus;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({ bookingStatus, onEdit, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteBookingStatus(bookingStatus.id.toString()));
    onDelete(bookingStatus.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-600" />
        {bookingStatus.name}
      </h3>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(bookingStatus.id)}
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

export default BookingStatusCard;
