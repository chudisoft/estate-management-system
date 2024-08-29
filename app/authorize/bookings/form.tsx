import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/userSlice';
import { fetchApartments } from '../../store/apartmentSlice';
import { fetchBookingStatuses } from '../../store/bookingStatusSlice';
import { AppDispatch, RootState } from '../../store/index';
import { Apartment, BookingStatus, User } from '@prisma/client';

interface GuestBookingFormProps {
  guestBookingId?: number; // Optional ID for editing
}

const GuestBookingForm: React.FC<GuestBookingFormProps> = ({ guestBookingId }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [bookingStatusId, setBookingStatusId] = useState<number | null>(null);
  const [leaseTerm, setLeaseTerm] = useState('');
  const [error, setError] = useState('');

  const users = useSelector((state: RootState) => state.users.users);
  const apartments = useSelector((state: RootState) => state.apartments.apartments);
  const bookingStatuses = useSelector((state: RootState) => state.bookingStatuses.bookingStatuses);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchApartments());
    dispatch(fetchBookingStatuses());

    if (guestBookingId) {
      // Fetch guest booking details for editing
      fetch(`/api/v1/guestBookings/${guestBookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setStartDate(data.startDate);
          setEndDate(data.endDate);
          setUserId(data.userId);
          setApartmentId(data.apartmentId);
          setBookingStatusId(data.bookingStatusId);
          setLeaseTerm(data.leaseTerm);
        })
        .catch((error) => setError('Failed to load guest booking details'));
    }
  }, [guestBookingId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const guestBookingData = {
      startDate,
      endDate,
      userId,
      apartmentId,
      bookingStatusId,
      leaseTerm,
    };

    const url = guestBookingId
      ? `/api/v1/guestBookings/${guestBookingId}`
      : '/api/v1/guestBookings';
    const method = guestBookingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestBookingData),
    });

    if (res.ok) {
      router.push('/guestBookings');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save guest booking');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-gray-100 text-gray-700 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          {guestBookingId ? 'Edit Guest Booking' : 'Add Guest Booking'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user" className="block text-gray-700">
              Guest
            </label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {users.map((user: User) => (
                <div
                  key={user.id}
                  onClick={() => setUserId(user.id)}
                  className={`cursor-pointer p-2 rounded ${
                    userId === user.id ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  {/* <img
                    src={user.image}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  /> */}
                  <p className="text-center">{user.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="apartment" className="block text-gray-700">
              Apartment
            </label>
            <div className="carousel flex space-x-2 overflow-x-scroll p-2 border border-gray-300 rounded">
              {apartments.map((apartment: Apartment) => (
                <div
                  key={apartment.id}
                  onClick={() => setApartmentId(apartment.id)}
                  className={`cursor-pointer p-2 rounded ${
                    apartmentId === apartment.id ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  {/* <img
                    src={apartment.image || '/placeholder.jpg'}
                    alt={apartment.name}
                    className="w-16 h-16 rounded"
                  /> */}
                  <p className="text-center">{apartment.name}</p>
                  {/* <p className="text-center text-xs">{apartment.estate}</p> */}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="bookingStatus" className="block text-gray-700">
              Booking Status
            </label>
            <select
              id="bookingStatus"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={bookingStatusId ?? ''}
              onChange={(e) => setBookingStatusId(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select Booking Status</option>
              {bookingStatuses.map((status: BookingStatus) => (
                <option key={status.id} value={status.id}>
                  {status.status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="leaseTerm" className="block text-gray-700">
              Lease Term
            </label>
            <input
              type="text"
              id="leaseTerm"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              value={leaseTerm}
              onChange={(e) => setLeaseTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {guestBookingId ? 'Update Guest Booking' : 'Add Guest Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestBookingForm;
