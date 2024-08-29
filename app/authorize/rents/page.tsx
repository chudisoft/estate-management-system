import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchApartments } from '../../store/apartmentSlice';
import { fetchUsers } from '../../store/userSlice';
import { AppDispatch, RootState } from '../../store/index';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RentFormProps {
  rentId?: number; // Optional ID for editing
}

const RentForm: React.FC<RentFormProps> = ({ rentId }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [totalAmount, setTotalAmount] = useState(0);
  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const apartments = useSelector((state: RootState) => state.apartments.apartments);
  const tenants = useSelector((state: RootState) => state.users.tenants);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchApartments());
    dispatch(fetchUsers());

    if (rentId) {
      // Fetch rent details for editing
      fetch(`/api/v1/rents/${rentId}`)
        .then((res) => res.json())
        .then((data) => {
          setStartDate(new Date(data.startDate));
          setEndDate(new Date(data.endDate));
          setTotalAmount(data.totalAmount);
          setApartmentId(data.apartmentId);
          setTenantId(data.tenantId);
        })
        .catch((error) => setError('Failed to load rent details'));
    }
  }, [rentId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Start Date and End Date are required');
      return;
    }

    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(now.getFullYear() + 2);

    if (startDate < twoYearsAgo) {
      setError('Start Date cannot be more than 2 years in the past');
      return;
    }

    if (endDate <= startDate) {
      setError('End Date must be after the Start Date');
      return;
    }

    if (endDate > twoYearsFromNow) {
      setError('End Date cannot be more than 2 years in the future');
      return;
    }

    const rentData = {
      startDate,
      endDate,
      totalAmount,
      apartmentId,
      tenantId,
    };

    const url = rentId ? `/api/v1/rents/${rentId}` : '/api/v1/rents';
    const method = rentId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rentData),
    });

    if (res.ok) {
      router.push('/rents');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save rent');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{rentId ? 'Edit Rent' : 'Add Rent'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700">Start Date</label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholderText="Select start date"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700">End Date</label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholderText="Select end date"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="totalAmount" className="block text-gray-700">Total Amount</label>
            <input
              type="number"
              id="totalAmount"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={totalAmount}
              onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="apartment" className="block text-gray-700">Apartment</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  onClick={() => setApartmentId(apartment.id)}
                  className={`cursor-pointer p-2 rounded ${
                    apartmentId === apartment.id ? 'bg-green-200' : 'bg-white'
                  }`}
                >
                  {/* <img
                    src={apartment.building.photo || '/default-apartment.png'}
                    alt={apartment.name}
                    className="w-16 h-16 rounded-full"
                  /> */}
                  <p className="text-center">{apartment.name}</p>
                  {/* <p className="text-center text-sm text-gray-500">{apartment.building.name}</p> */}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="tenant" className="block text-gray-700">Tenant</label>
            <select
              id="tenant"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={tenantId || ''}
              onChange={(e) => setTenantId(e.target.value)}
              required
            >
              <option value="" disabled>Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} | {tenant.phone}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {rentId ? 'Update Rent' : 'Add Rent'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentForm;
