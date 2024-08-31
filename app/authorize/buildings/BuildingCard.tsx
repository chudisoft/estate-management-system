import React from 'react';
import { Building } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteBuilding } from '../../store/buildingSlice';
import { AppDispatch } from '../../store/index';

interface BuildingCardProps {
  building: Building;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const BuildingCard: React.FC<BuildingCardProps> = ({ building, onEdit, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteBuilding(building.id.toString()));
    onDelete(building.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-600" />
        {building.name}
      </h3>
      <p className="text-gray-700 flex items-center mb-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
        {building.address}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(building.id)}
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

export default BuildingCard;
