import React from 'react';
import { Expense } from '@prisma/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyCheckAlt, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteExpense } from '../../store/expenseSlice';
import { AppDispatch } from '../../store/index';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
    const dispatch: AppDispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteExpense(expense.id.toString()));
    onDelete(expense.id);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        <FontAwesomeIcon icon={faReceipt} className="mr-2 text-gray-600" />
        {expense.name}
      </h3>
      <p className="text-gray-700 flex items-center mb-2">
        <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2 text-gray-600" />
        Amount: ${expense.amount.toFixed(2)}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(expense.id)}
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

export default ExpenseCard;
