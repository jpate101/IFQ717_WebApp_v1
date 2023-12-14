import React, { useState, useEffect } from 'react';
import getLocationDevices from './getLocationDevices';
import Pagination from '../Components/Pagination';
import '../style.css';

export default function OrganisationGrid() {
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLocationDevices = async () => {
    const locationDevices = await getLocationDevices();
    locationDevices.sort((a, b) => (a.locationDevice === b.locationDevice) ? 0 : a.locationDevice ? -1 : 1);
    setRowData(locationDevices);
  };

  useEffect(() => {
    fetchLocationDevices();
  }, []);

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedRowData = rowData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Site clockin enabled</th>
          </tr>
        </thead>
        <tbody>
        {selectedRowData.map((row) => (
            <tr key={row.id}>
              <td className="border px-4 py-2">{row.id}</td>
              <td className="border px-4 py-2">{row.name}</td>
              <td className="border px-4 py-2">
             {row.locationDevice ? 'Enabled' : 
                <a 
                href="https://my.tanda.co/timeclocks/new" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
                >
                Add device
                </a>
                }
            </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div className="flex justify-center">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={rowData.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
      </div>
    );
    }