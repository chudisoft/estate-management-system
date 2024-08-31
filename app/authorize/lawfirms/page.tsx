import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLawFirms } from '../../store/lawfirmSlice';
import { AppDispatch, RootState } from '../../store';
import LawFirmCard from './LawFirmCard';
import Pagination from '../../Pagination';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LawFirm } from '@prisma/client';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const LawFirmList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { lawfirms, status, error } = useSelector((state: RootState) => state.lawfirms);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchLawFirms());
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (column: keyof typeof lawfirms[0]) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    // Sort logic based on column and order
  };

  const filteredLawFirms = lawfirms
    .filter((firm: LawFirm) => firm.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLawFirms = filteredLawFirms.slice(indexOfFirstItem, indexOfLastItem);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Address', 'Phone', 'Email']],
      body: lawfirms.map((firm: LawFirm) => [firm.name, firm.address, firm.phone, firm.email]),
    });
    doc.save('lawfirms.pdf');
  };

  const exportToExcel = () => {
    const csvData = lawfirms.map((firm: LawFirm) => ({
      Name: firm.name,
      Address: firm.address,
      Phone: firm.phone,
      Email: firm.email,
    }));
    const csvBlob = new Blob([csvData.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, 'lawfirms.csv');
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
          <CSVLink data={lawfirms} filename={'lawfirms.csv'} className="btn btn-primary">
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
        {currentLawFirms.map((firm: LawFirm) => (
          <LawFirmCard key={firm.id} lawFirm={firm} />
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredLawFirms.length}
        currentPage={currentPage}
        paginate={(pageNumber: number) => setCurrentPage(pageNumber)}
      />
    </div>
  );
};

export default LawFirmList;
