import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApartments } from '../../store/apartmentSlice';
import { AppDispatch, RootState } from '../../store';
import ApartmentCard from './ApartmentCard';
import Pagination from '../../Pagination';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Apartment } from '@prisma/client';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const ApartmentList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { apartments, status, error } = useSelector((state: RootState) => state.apartments);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column: keyof typeof apartments[0]) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    // Sort logic based on column and order
  };

  const filteredApartments = apartments
    .filter((firm: Apartment) => firm.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApartments = filteredApartments.slice(indexOfFirstItem, indexOfLastItem);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Address', 'Cost', 'Cost By', 'Building Id']],
      body: apartments.map((firm: Apartment) => 
        [ 
          firm.name, firm.address, firm.cost, firm.costBy, 
          firm.buildingId
        ]),
    });
    doc.save('apartments.pdf');
  };

  const exportToExcel = () => {
    const csvData = apartments.map((apartment: Apartment) => ({
      Name: apartment.name,
      Address: apartment.address,
      cost: apartment.cost,
      costBy: apartment.costBy,
      'Number of Rooms': apartment.numberOfRooms,
      'Number of Palours': apartment.numberOfPalours,
      'Building Id': apartment.buildingId,
      // Rent: apartment.rentAmount,
      // Status: apartment.status,
    }));
  
    const csvRows = [
      Object.keys(csvData[0]).join(','), // headers
      ...csvData.map(row => Object.values(row).join(',')) // rows
    ];
  
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, 'apartments.csv');
  };
  

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border rounded"
        />
        <div className="flex space-x-2">
          <CSVLink data={apartments} filename={'apartments.csv'} className="btn btn-primary">
            Export to CSV
          </CSVLink>
          <button onClick={exportToPDF} className="btn btn-primary">
            Export to PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-primary">
            Export to Excel
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentApartments.map((firm: Apartment) => (
          <ApartmentCard key={firm.id} apartment={firm} onEdit={function (id: number): void {
            throw new Error('Function not implemented.');
          } } onDelete={function (id: number): void {
            throw new Error('Function not implemented.');
          } } />
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredApartments.length}
        currentPage={currentPage}
        paginate={(pageNumber: number) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default ApartmentList;
