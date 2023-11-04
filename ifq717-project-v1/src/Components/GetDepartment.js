import { useState, useEffect } from 'react';

function GetDepartment({ departmentId, children }) {
    const [department, setDepartment] = useState(null);

    useEffect(() => {
        // Only proceed if departmentId is provided
        if (!departmentId) return;

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Fetch a specific department by ID
        fetch(`https://my.tanda.co/api/v2/departments/${departmentId}`, {
            method: 'GET',
            headers: headers
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(departmentData => {
            setDepartment(departmentData);
        })
        .catch(error => {
            console.error("Error fetching department:", error);
        });
    }, [departmentId]); // Re-run the effect if departmentId changes

    // Render the children with the department data, or null if not loaded
    return children(department);
}

export default GetDepartment;
