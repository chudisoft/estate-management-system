import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuilding, createBuilding, updateBuilding } from '../../store/buildingSlice';
import { fetchUsers } from '../../store/userSlice';
import { fetchLawFirms } from '../../store/lawfirmSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { AppDispatch, RootState } from '../../store/index';

interface BuildingFormProps {
  buildingId?: number; // Optional ID for editing
}

const BuildingForm: React.FC<BuildingFormProps> = ({ buildingId }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lawFirmId, setLawFirmId] = useState<number | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);
  const [error, setError] = useState('');
  // const lawFirms = useSelector(fetchLawFirms);
  // const users = useSelector(fetchUsers);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const lawFirms = useSelector((state: RootState) => state.lawfirms.lawfirms);
  const users = useSelector((state: RootState) => state.users.managers);

  useEffect(() => {
    dispatch(fetchLawFirms());
    dispatch(fetchUsers());

    if (buildingId) {
      // Fetch building details for editing
      fetch(`/api/v1/buildings/${buildingId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name);
          setAddress(data.address);
          setLawFirmId(data.lawFirmId);
          setManagerId(data.managerId);
        })
        .catch((error) => setError('Failed to load building details'));
    }
  }, [buildingId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const buildingData = { name, address, lawFirmId, managerId };

    const url = buildingId ? `/api/v1/buildings/${buildingId}` : '/api/v1/buildings';
    const method = buildingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildingData),
    });

    if (res.ok) {
      router.push('/buildings');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save building');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">{buildingId ? 'Edit Building' : 'Add Building'}</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="name" className="block text-gray-700">Building Name</label>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBuilding} className="absolute ml-2 text-gray-400" />
              <input
                type="text"
                id="name"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLocationDot} className="absolute ml-2 text-gray-400" />
              <input
                type="text"
                id="address"
                className="mt-1 p-2 pl-10 border border-gray-300 rounded w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="lawFirm" className="block text-gray-700">Law Firm</label>
            <select
              id="lawFirm"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={lawFirmId ?? ''}
              onChange={(e) => setLawFirmId(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select Law Firm</option>
              {lawFirms.map((firm) => (
                <option key={firm.id} value={firm.id}>
                  {firm.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="manager" className="block text-gray-700">Manager</label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setManagerId(user.id)}
                  className={`cursor-pointer p-2 rounded ${
                    managerId === user.id ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  <img src={user.image?.toString()} alt={user.name?.toString()} className="w-16 h-16 rounded-full" />
                  <p className="text-center">{user.name}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {buildingId ? 'Update Building' : 'Add Building'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuildingForm;
