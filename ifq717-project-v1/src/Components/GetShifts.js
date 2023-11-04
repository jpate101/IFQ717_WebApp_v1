import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

function GetShifts(props) {
    const [shifts, setShifts] = useState({});

    const { fromDate, toDate } = props;

    useEffect(() => {

        if (!fromDate || !toDate) {
            // If fromDate or toDate is not set, do not proceed with fetching data.
            return;
        }
        
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        async function fetchShiftData() {
            try {
                // 1. Log the URL and headers
                console.log("Fetching shifts with URL:", `https://my.tanda.co/api/v2/shifts?from=${fromDate}&to=${toDate}&show_costs=true&show_notes=true`);
                console.log("Headers:", headers);

                const response = await fetch(`https://my.tanda.co/api/v2/shifts?from=${fromDate}&to=${toDate}&show_costs=true&show_notes=true`, {
                    method: 'GET',
                    headers: headers
                });

                // 2. Log the response status and statusText
                console.log("Response Status:", response.status);
                console.log("Response Status Text:", response.statusText);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();

                // 3. Log the actual data
                console.log("Data:", data);

                // Process the shifts data here
                const processedShifts = data.reduce((acc, shift) => {
                    const shiftDate = dayjs(shift.start * 1000).format('YYYY-MM-DD'); // Assuming shift.start is already in milliseconds. If it's in seconds, use shift.start * 1000
                    if (!acc[shiftDate]) {
                        acc[shiftDate] = [];
                    }
                    acc[shiftDate].push(shift);
                    return acc;
                }, {});

                setShifts(processedShifts);
            } catch (error) {
                console.error("There was an error fetching the shifts:", error);
            }
        }

        fetchShiftData();
    }, [fromDate, toDate]);

    return props.children(shifts);
}

export default GetShifts;
