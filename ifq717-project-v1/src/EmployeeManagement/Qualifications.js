import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { getQualificationList } from '../API/Utilities';
import EditButton from '../Components/Buttons/EditButton';

const Qualifications = () => {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQualifications = async () => {
      setLoading(true);
      try {
        const data = await getQualificationList();
        setQualifications(data);
      } catch (error) {
        console.error('Error fetching qualifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, []);

  const handleEditClick = (qualificationId) => {
    // Placeholder for edit logic
    console.log('Edit clicked for qualification ID:', qualificationId);
  };

  return (
    <div>
      <Table striped bordered hover className="qualifications-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Maximum Hours</th>
            <th>Staff</th>
            <th>Teams</th>
            <th>Automatically Assign Team</th>
            <th>Block Roster Publishing</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          ) : (
            qualifications.map((qualification) => (
              <tr key={qualification.id}>
                <td>{qualification.name}</td>
                <td>{qualification.maximum_hours ? qualification.maximum_hours : 'N/A'}</td>
                <td>{/* Staff data */}</td>
                <td>{/* Teams data */}</td>
                <td>{/* Automatically Assign Team logic */}</td>
                <td>{/* Block Roster Publishing logic */}</td>
                <td>
                  <EditButton onClick={() => handleEditClick(qualification.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Qualifications;
