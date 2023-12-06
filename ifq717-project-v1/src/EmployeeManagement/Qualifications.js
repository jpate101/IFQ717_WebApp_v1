import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { 
    getQualificationList, 
    createQualification, 
    getUsers, 
    getAllDepartments,
    updateQualification,
    deleteQualification
} from '../API/Utilities';
import EditButton from '../Components/Buttons/EditButton';
import NewQualificationModal from '../Components/Qualifications/CreateQualificationModal';

const Qualifications = () => {
    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [editQualification, setEditQualification] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
        const qualificationData = await getQualificationList();
        const userData = await getUsers();
        const departmentsData = await getAllDepartments();
        qualificationData.sort((a, b) => a.name.localeCompare(b.name));
        console.log("Qualifications: ", qualificationData);
        console.log("Users: ", userData);
        console.log("Departments: ", departmentsData); 
        setQualifications(qualificationData);
        setUsers(userData);
        setDepartments(departmentsData);
        } catch (error) {
        console.error('Error:', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const countStaffWithQualification = (qualificationId) => {
        console.log('Qualification ID:', qualificationId);
        const count = users.reduce((acc, user) => {
            if (user.qualifications && Array.isArray(user.qualifications)) {
                const hasQualification = user.qualifications.some(qual =>
                    Number(qual.qualification_id) === Number(qualificationId) && qual.enabled
                );
                if (hasQualification) {
                    acc++;
                }
            } else {
                console.log(`User ${user.name} has no valid qualifications array:`, user);
            }
            return acc;
        }, 0);
    
        console.log('Count for qualification ID', qualificationId, ':', count);
        return count;
    };
        
    const countTeamsWithQualification = (qualificationId) => {
        console.log('Qualification ID:', qualificationId);
        const count = departments.reduce((acc, department) => {
            console.log(`Checking department: ${department.name}`, department);
            if (department.qualifications && Array.isArray(department.qualifications)) {
                const hasQualification = department.qualifications.includes(Number(qualificationId));
                if (hasQualification) {
                    acc++;
                }
            } else {
                console.log(`Department ${department.name} has no valid qualifications array:`, department);
            }
            return acc;
        }, 0);
    
        console.log('Team count for qualification ID', qualificationId, ':', count);
        return count;
    };
    
    const handleEditClick = (qualificationId) => {
        const qualificationToEdit = qualifications.find(q => q.id === qualificationId);
        if (qualificationToEdit) {
            console.log("Editing qualification:", qualificationToEdit);
            setEditQualification(qualificationToEdit);
            setIsModalOpen(true);
        }
    };      

    const handleCreateOrUpdateQualification = async (qualificationData) => {
        try {
            if (editQualification) {
            console.log('Updating qualification:', editQualification.id, qualificationData);
            await updateQualification(editQualification.id, qualificationData);
            } else {
            console.log('Creating new qualification:', qualificationData);
            await createQualification(qualificationData);
            }
            alert('Qualification successfully saved');
            await fetchData();
            setIsModalOpen(false);
            setEditQualification(null);
        } catch (error) {
            console.error('Error saving qualification:', error);
        }
    };

    const handleNewQualificationClick = () => {
        setEditQualification(null);
        setIsModalOpen(true);
    };

    const handleDeleteQualification = async (qualificationId) => {
        try {
            await deleteQualification(qualificationId);
            alert('Qualification deleted successfully');
            setIsModalOpen(false);
            await fetchData();
        } catch (error) {
            console.error('Error deleting qualification:', error);
        }
    };
    
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>{}</h1>
                <Button 
                    onClick={handleNewQualificationClick}
                    variant="primary"
                    className="tanda-button"
                    >
                        New Qualification
                </Button>
            </div>
            <NewQualificationModal
                key={editQualification ? editQualification.id : 'new'}  
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setEditQualification(null); 
                }}
                createOrUpdateQualification={handleCreateOrUpdateQualification}
                editQualification={editQualification}
                onDeleteQualification={handleDeleteQualification}
            />
            <Table striped bordered hover className="timesheet-table">
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
                                <td>{countStaffWithQualification(qualification.id)}</td>
                                <td>{countTeamsWithQualification(qualification.id)}</td>
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
