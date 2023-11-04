import React, { useState, useEffect } from 'react';

function GetUsers(props) {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Fetch all users with show_wages=true and set them in state
        fetch('https://my.tanda.co/api/v2/users?show_wages=true', {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(usersData => {
            const usersMap = usersData.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});
            setUsers(usersMap);
        });
    }, []);

    return props.children(users);
}

export default GetUsers;
