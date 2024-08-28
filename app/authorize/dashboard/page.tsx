import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCheckCircle, faMoneyBillWave, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0);
  const [occupiedApartments, setOccupiedApartments] = useState(0);
  const [duePayments, setDuePayments] = useState(0);
  const [upcomingPayments, setUpcomingPayments] = useState(0);
  const [chartData, setChartData] = useState({ bookings: [], rents: [], expenses: [] });


  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Bookings',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Rents',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: [12, 19, 3, 5, 2, 3, 20],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,  // Explicitly specify the string literal type
      },
      title: {
        display: true,
        text: 'Yearly Bookings, Rents, and Expenses',
      },
    },
  };

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const [apartmentsRes, paymentsRes, chartRes] = await Promise.all([
          fetch('/api/v1/dashboard/total-apartments'),
          fetch('/api/v1/dashboard/payments'),
          fetch('/api/v1/dashboard/chart-data')
        ]);

        const apartmentsData = await apartmentsRes.json();
        const paymentsData = await paymentsRes.json();
        const chartData = await chartRes.json();

        setTotalApartments(apartmentsData.total);
        setOccupiedApartments(apartmentsData.occupied);
        setDuePayments(paymentsData.due);
        setUpcomingPayments(paymentsData.upcoming);
        setChartData(chartData);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul>
          <li className="mb-4"><a href="/dashboard" className="text-gray-300 hover:text-white">Overview</a></li>
          <li className="mb-4"><a href="/apartments" className="text-gray-300 hover:text-white">Apartments</a></li>
          <li className="mb-4"><a href="/payments" className="text-gray-300 hover:text-white">Payments</a></li>
          <li className="mb-4"><a href="/expenses" className="text-gray-300 hover:text-white">Expenses</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Apartments */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FontAwesomeIcon icon={faBuilding} className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Total Apartments</p>
              <h3 className="text-2xl font-bold">{totalApartments}</h3>
            </div>
          </div>

          {/* Occupied Apartments */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Occupied Apartments</p>
              <h3 className="text-2xl font-bold">{occupiedApartments}</h3>
            </div>
          </div>

          {/* Due Payments */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-red-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Due Payments</p>
              <h3 className="text-2xl font-bold">{duePayments}</h3>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-600">Upcoming Payments</p>
              <h3 className="text-2xl font-bold">{upcomingPayments}</h3>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Yearly Overview</h3>
          {/* Chart would be inserted here. For simplicity, let's assume it's a simple placeholder */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            {/* Replace this with your chart library */}
            <Bar data={data} options={options} />;
            <p>Yearly Bookings/Rents/Expenses Chart Placeholder</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
