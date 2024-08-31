import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuildings } from '../../store/buildingSlice'; // Ensure you have this slice
import { AppDispatch, RootState } from '../../store';
import BuildingCard from './BuildingCard'; // Ensure you have this component
import Pagination from '../../Pagination';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Building } from '@prisma/client';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const BuildingList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { buildings, status, error } = useSelector((state: RootState) => state.buildings);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column: keyof typeof buildings[0]) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    // Sort logic based on column and order
  };

  const filteredBuildings = buildings
    .filter((building: Building) => building.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBuildings = filteredBuildings.slice(indexOfFirstItem, indexOfLastItem);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Address', 'Number of Floors']],
      body: buildings.map((building: Building) => [building.name, building.address, building.numberOfFloors]),
    });
    doc.save('buildings.pdf');
  };

  const exportToExcel = () => {
    const csvData = buildings.map((building: Building) => ({
      Name: building.name,
      Address: building.address,
      'Number of Floors': building.numberOfFloors,
    }));
  
    const csvRows = [
      Object.keys(csvData[0]).join(','), // headers
      ...csvData.map(row => Object.values(row).join(',')) // rows
    ];
  
    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, 'buildings.csv');
  };

  const onEdit = (id: number) => {
    // Handle edit logic
  };

  const onDelete = (id: number) => {
    // Handle delete logic
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
          <CSVLink data={buildings} filename={'buildings.csv'} className="btn btn-primary">
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
        {currentBuildings.map((building: Building) => (
          <BuildingCard
            key={building.id}
            building={building}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredBuildings.length}
        currentPage={currentPage}
        paginate={(pageNumber: number) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default BuildingList;
