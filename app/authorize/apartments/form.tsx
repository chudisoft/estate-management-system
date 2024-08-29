import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuildings } from '../../store/buildingSlice';
import { AppDispatch, RootState } from '../../store/index';

interface ApartmentFormProps {
  apartmentId?: number; // Optional ID for editing
}

const ApartmentForm: React.FC<ApartmentFormProps> = ({ apartmentId }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
  const [costBy, setCostBy] = useState('');
  const [address, setAddress] = useState('');
  const [buildingId, setBuildingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const buildings = useSelector((state: RootState) => state.buildings.buildings);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchBuildings());

    if (apartmentId) {
      // Fetch apartment details for editing
      fetch(`/api/v1/apartments/${apartmentId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setCost(data.cost);
          setCostBy(data.costBy);
          setAddress(data.address);
          setBuildingId(data.buildingId);
        })
        .catch((error) => setError('Failed to load apartment details'));
    }
  }, [apartmentId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apartmentData = { name, cost, costBy, address, buildingId };

    const url = apartmentId ? `/api/v1/apartments/${apartmentId}` : '/api/v1/apartments';
    const method = apartmentId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apartmentData),
    });

    if (res.ok) {
      router.push('/apartments');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save apartment');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{apartmentId ? 'Edit Apartment' : 'Add Apartment'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Apartment Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cost" className="block text-gray-700">Cost</label>
            <input
              type="number"
              id="cost"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="costBy" className="block text-gray-700">Cost By</label>
            <input
              type="text"
              id="costBy"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={costBy}
              onChange={(e) => setCostBy(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="building" className="block text-gray-700">Building</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  onClick={() => setBuildingId(building.id)}
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {apartmentId ? 'Update Apartment' : 'Add Apartment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApartmentForm;
