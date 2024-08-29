import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRent } from '../../store/rentSlice';
import { fetchUsers } from '../../store/userSlice';
import { AppDispatch, RootState } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Rent } from '@prisma/client';


interface PaymentFormProps {
  paymentId?: number; // Optional ID for editing
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentId }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [accountPaidTo, setAccountPaidTo] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [rent, setRent] = useState({} as Rent);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const rentId = parseInt(router.query.rentId as string, 10);
  
//   const rent = useSelector((state: RootState) => state.rents.selectedRent);
  const tenants = useSelector((state: RootState) => state.users.tenants);
  
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (rentId) {
        // Fetch rent details for editing
        fetch(`/api/v1/rents/${rentId}`)
          .then((res) => res.json())
          .then((data) => {
            setRent(data.tenantId);
          })
          .catch((error) => setError('Failed to load rent details'));
    }
    dispatch(fetchUsers());
  }, [dispatch, rentId]);

  useEffect(() => {
    if (paymentId) {
      // Fetch payment details for editing (similar to the rent fetch)
      fetch(`/api/v1/payments/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          setAmountPaid(data.amountPaid);
          setAccountPaidTo(data.accountPaidTo);
          setPaymentDate(data.paymentDate);
        })
        .catch((error) => setError('Failed to load payment details'));
    }
  }, [paymentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = { amountPaid, accountPaidTo, paymentDate, rentId, tenantId: rent?.tenantId };

    const url = paymentId ? `/api/v1/payments/${paymentId}` : '/api/v1/payments';
    const method = paymentId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (res.ok) {
      router.push('/payments');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save payment');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{paymentId ? 'Edit Payment' : 'Add Payment'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="amountPaid" className="block text-gray-700">Amount Paid</label>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faDollarSign} className="absolute ml-2 text-gray-400" />
              <input
                type="number"
                id="amountPaid"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded w-full"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="accountPaidTo" className="block text-gray-700">Account Paid To</label>
            <input
              type="text"
              id="accountPaidTo"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={accountPaidTo}
              onChange={(e) => setAccountPaidTo(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="paymentDate" className="block text-gray-700">Payment Date</label>
            <input
              type="date"
              id="paymentDate"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tenant</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className={`cursor-pointer p-2 rounded ${
                    rent?.tenantId === tenant.id ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  {/* <img src={tenant.image} alt={tenant.name} className="w-16 h-16 rounded-full" /> */}
                  <p className="text-center">{tenant.name}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {paymentId ? 'Update Payment' : 'Add Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
