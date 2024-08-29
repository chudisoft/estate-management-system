import React from 'react';
import { LawFirm } from '@prisma/client';
import { useDispatch } from 'react-redux';
import { deleteLawFirm } from '../../store/lawfirmSlice';

interface LawFirmCardProps {
  lawFirm: LawFirm;
}

const LawFirmCard: React.FC<LawFirmCardProps> = ({ lawFirm }) => {
  const dispatch = useDispatch();

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
        <button className="btn btn-secondary">Edit</button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default LawFirmCard;
