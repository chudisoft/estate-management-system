import React from 'react';
import { LawFirm } from '@prisma/client';
import { useDispatch } from 'react-redux';
import { deleteLawFirm } from '../../store/lawfirmSlice';
import { AppDispatch, RootState } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faMapMarkerAlt, faMoneyBillWave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface LawFirmCardProps {
  lawFirm: LawFirm;
}

const LawFirmCard: React.FC<LawFirmCardProps> = ({ lawFirm }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteLawFirm(lawFirm.id.toString()));
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">{lawFirm.name}</h2>
      <p>{lawFirm.address}</p>
      <p>{lawFirm.phone}</p>
      <p>{lawFirm.email}</p>
      <div className="flex justify-between mt-4">
        <button className="btn btn-secondary">
          <FontAwesomeIcon icon={faEdit} className="mr-2" />Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default LawFirmCard;
