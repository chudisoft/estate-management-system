import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuildings } from '../../store/buildingSlice';
import { fetchApartments } from '../../store/apartmentSlice';
import { AppDispatch, RootState } from '../../store/index';

interface ExpenseFormProps {
  expenseId?: number; // Optional ID for editing
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expenseId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const buildings = useSelector((state: RootState) => state.buildings.buildings);
  const apartments = useSelector((state: RootState) => state.apartments.apartments);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchBuildings());
    dispatch(fetchApartments());

    if (expenseId) {
      // Fetch expense details for editing
      fetch(`/api/v1/expenses/${expenseId}`)
        .then((res) => res.json())
        .then((data) => {
          setDescription(data.description);
          setAmount(data.amount);
          setCategory(data.category);
          setBuildingId(data.buildingId || null);
          setApartmentId(data.apartmentId || null);
        })
        .catch((error) => setError('Failed to load expense details'));
    }
  }, [expenseId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      description,
      amount,
      category,
      buildingId,
      apartmentId,
    };

    const url = expenseId ? `/api/v1/expenses/${expenseId}` : '/api/v1/expenses';
    const method = expenseId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (res.ok) {
      router.push('/expenses');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save expense');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{expenseId ? 'Edit Expense' : 'Add Expense'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700">Category</label>
            <input
              type="text"
              id="category"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="building" className="block text-gray-700">Building</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  onClick={() => {
                    setBuildingId(building.id);
                    setApartmentId(null); // Clear apartment selection if building is chosen
                  }}
                  className={`cursor-pointer p-2 rounded ${
                    buildingId === building.id ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  {/* <img src={building.photo || '/default-building.png'} alt={building.name} className="w-16 h-16 rounded-full" /> */}
                  <p className="text-center">{building.name}</p>
                  <p className="text-center text-sm text-gray-500">{building.estate}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="apartment" className="block text-gray-700">Apartment</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  onClick={() => {
                    setApartmentId(apartment.id);
                    setBuildingId(null); // Clear building selection if apartment is chosen
                  }}
                  className={`cursor-pointer p-2 rounded ${
                    apartmentId === apartment.id ? 'bg-green-200' : 'bg-white'
                  }`}
                >
                  {/* <img src={apartment.building.photo || '/default-apartment.png'} alt={apartment.name} className="w-16 h-16 rounded-full" /> */}
                  <p className="text-center">{apartment.name}</p>
                  {/* <p className="text-center text-sm text-gray-500">{apartment.building.name}</p> */}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {expenseId ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
