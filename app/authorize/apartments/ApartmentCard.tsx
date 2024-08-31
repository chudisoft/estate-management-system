import React from 'react';
import { Apartment } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faMoneyBillWave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteApartment } from '../../store/apartmentSlice';
import { AppDispatch, RootState } from '../../store/index';

interface ApartmentCardProps {
  apartment: Apartment;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onEdit, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteApartment(apartment.id.toString()));
    onDelete(apartment.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-600" />
        {apartment.name}
      </h3>
      <p className="text-gray-700 flex items-center mb-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
        {apartment.address}
      </p>
      <p className="text-gray-700 flex items-center mb-2">
        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-gray-600" />
        Cost: ${apartment.cost.toFixed(2)}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(apartment.id)}
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

export default ApartmentCard;
