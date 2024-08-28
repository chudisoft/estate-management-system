import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const LawFirmForm: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin' && user?.role !== 'manager') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/law-firms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (!response.ok) {
        throw new Error('Failed to save law firm details');
      }

      router.push('/law-firms');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin' && user?.role !== 'manager') {
    return null; // Or you could return a loading spinner
  }

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Law Firm Form</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Name"
            className="p-2 pl-10 w-full border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="p-2 pl-10 w-full border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Phone"
            className="p-2 pl-10 w-full border border-gray-300 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4 relative">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Address"
            className="p-2 pl-10 w-full border border-gray-300 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default LawFirmForm;
