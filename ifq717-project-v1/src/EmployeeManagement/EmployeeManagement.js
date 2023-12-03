import React from 'react';
import { useState, useEffect } from 'react';
import { useLocationForm, useTeamsForm, useEmployeeForm, useOnboardingForm, useDataBusinessHours } from './EmployeeManagementFormData';


function EmployeeManagement() {
    const [showLocationForm, setShowLocationForm] = useState(false);
    const [showTeamsForm, setShowTeamsForm] = useState(false);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [showUpdateUsers, setShowUpdateUsers] = useState(false);
    const [showUpdateLocations, setShowUpdateLocations] = useState(false);
    const [showUpdateTeams, setShowUpdateTeams] = useState(false);
    const [showOnboardNewUser, setShowOnboardNewUser] = useState(false);
    const [showInactivateEmployee, setShowInactivateEmployee] = useState(false);
    const [showResult, setShowResult] = useState("");

    //input form variables 
    const [formDataLocation, setFormDataLocation] = useLocationForm();
    const [formDataTeams, setFormDataTeams] = useTeamsForm();
    const [formDataEmployee, setFormDataEmployee] = useEmployeeForm();
    const [formDataOnboarding, setFormDataOnboarding] = useOnboardingForm();
    const [formDataBusinessHours, setFormDataBusinessHours] = useDataBusinessHours();


    const [inputSpecificHolidayDates, setInputSpecificHolidayDates] = useState('');


    //search locations stuff 
    const [locationsList, setLocationsList] = useState([]);
    const [searchLocation, setSearchLocation] = useState(''); // State for search query
    const [filteredLocations, setFilteredLocations] = useState([]); // State for filtered locations

    //update Business hours 
    const [showBusinessHoursResult, setShowBusinessHoursResult] = useState('');

    //key
    const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

    //search locations stuff 
    const fetchLocations = async () => {
        try {
            const response = await fetch(`https://my.tanda.co/api/v2/locations?platform=false&show_business_hours=false`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFilteredLocations(data); // Update the filteredLocations state with the fetched locations
                setLocationsList(data);
            } else {
                setShowResult('Failed to fetch locations');
            }
        } catch (error) {
            setShowResult('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchLocations(); // Fetch locations when the component mounts
    }, []);

    useEffect(() => {
        if (searchLocation.trim() === '') {
            // If the query is empty, show all locations
            setFilteredLocations(locationsList);
        } else {
            // Filter the locations based on the query
            const filtered = locationsList.filter((location) => {
                return (
                    location.id.toString().includes(searchLocation) ||
                    location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                    location.short_name.toLowerCase().includes(searchLocation.toLowerCase())
                );
            });
            setFilteredLocations(filtered);
        }
    }, [searchLocation, locationsList]);
    // search USers stuff 
    const [usersList, setUsersList] = useState([]);
    const [searchUsers, setSearchUsers] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`https://my.tanda.co/api/v2/users?show_wages=false`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredUsers(data);
                setUsersList(data);
            } else {
                setShowResult('Failed to fetch users');
            }
        } catch (error) {
            setShowResult('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users when the component mounts
    }, []);

    useEffect(() => {
        if (searchUsers.trim() === '') {
            // If the query is empty, show all users
            setFilteredUsers(usersList);
        } else {
            // Filter the users based on the query
            const filtered = usersList.filter((user) => {
                return (
                    user.id.toString().includes(searchUsers) ||
                    user.name.toLowerCase().includes(searchUsers.toLowerCase())
                );
            });
            setFilteredUsers(filtered);
        }
    }, [searchUsers, usersList]);


    //search teams stuff 

    const [teamsList, setTeamsList] = useState([]);
    const [searchTeams, setSearchTeams] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);

    const fetchTeams = async () => {
        try {
            //console.log("fetch teams exe");
            const response = await fetch(`https://my.tanda.co/api/v2/departments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFilteredTeams(data);
                setTeamsList(data);
            } else {
                setShowResult('Failed to fetch users');
            }
        } catch (error) {
            setShowResult('Network error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchTeams(); // Fetch users when the component mounts
    }, []);

    useEffect(() => {
        if (searchTeams.trim() === '') {
            // If the query is empty, show all users
            setFilteredTeams(teamsList);
        } else {
            // Filter the users based on the query
            const filtered = teamsList.filter((team) => {
                return (
                    team.id.toString().includes(searchTeams) ||
                    team.name.toLowerCase().includes(searchTeams.toLowerCase())
                );
            });
            setFilteredTeams(filtered);
        }
    }, [searchTeams, teamsList]);
    // display functions 
    const handleCreateLocationsClick = () => {
        setShowLocationForm(true);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    };
    const handleCreateTeamsClick = () => {
        setShowEmployeeForm(false);
        setShowLocationForm(false);
        setShowTeamsForm(true);
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    };
    const handleCreateUsersClick = () => {
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(true);
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    };
    const handleUpdateUsersClick = () => {
        setShowUpdateUsers(true);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    }
    const handleUpdateLocationsClick = () => {
        setShowUpdateUsers(false);
        setShowUpdateLocations(true);
        setShowUpdateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    }
    const handleUpdateTeamsClick = () => {
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(true);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(false);
        setShowResult('');
    }
    const handleOnboardNewUserClick = () => {
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(true);
        setShowInactivateEmployee(false);
        setShowResult('');
    }

    const handleInactivateEmployeeClick = () => {
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(false);
        setShowInactivateEmployee(true);
        setShowResult('');
    }

    //button functions 
    function handleCreateLocationSubmit(e) {
        e.preventDefault();

        if (!formDataLocation.name || !formDataLocation.latitude || !formDataLocation.longitude || !formDataLocation.address) {
            //alert("Please fill in all required fields.");
            setShowResult("Please fill in all required fields.");
            return;
        }


        const requestBody = {
            name: formDataLocation.name,
            short_name: formDataLocation.short_name,
            latitude: parseFloat(formDataLocation.latitude),
            longitude: parseFloat(formDataLocation.longitude),
            address: formDataLocation.address,
            public_holiday_regions: formDataLocation.public_holiday_regions,
        };
        // Send a POST request to your API endpoint
        fetch('https://my.tanda.co/api/v2/locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success
                    console.log("Location created successfully!");
                    setShowResult("Location created successfully!");
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();
                } else if (response.status === 403) {
                    // Handle 403 error (forbidden)
                    console.log("You do not have the required permissions to create a location.");
                    setShowResult("You do not have the required permissions to create a location.");
                } else {
                    // Handle other errors
                    console.log("Failed to create location");
                    setShowResult("Failed to create location");
                }
            })
            .catch(error => {
                // Handle network errors
                setShowResult("Network error: " + error.message);
            });
    }

    function handleCreateTeamsSubmit(e) {
        // Handle team creation here
        e.preventDefault();

        if (!formDataTeams.name || !formDataTeams.location_id) {
            //alert("Please fill in all required fields.");
            setShowResult("Please fill in all required fields.");
            return;
        }

        const teamRequestBody = {
            name: formDataTeams.name,
            location_id: formDataTeams.location_id,
        };
        // Send a POST request to create a team
        fetch('https://my.tanda.co/api/v2/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(teamRequestBody),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success
                    //console.log("Location created successfully!");
                    setShowResult("Team created successfully!");
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();
                } else if (response.status === 403) {
                    // Handle 403 error (forbidden)
                    //console.log("You do not have the required permissions to create a location.");
                    setShowResult("You do not have the required permissions to create a Team.");
                } else {
                    // Handle other errors
                    //console.log("Failed to create location");
                    setShowResult("Failed to create Team");
                }
            })
            .catch(error => {
                // Handle network errors
                setShowResult("Network error: " + error.message);
            });
    }

    function handleCreateEmployeeSubmit(e) {
        e.preventDefault();

        if (!formDataEmployee.name) {
            setShowResult("Please fill in all required fields.");
            return;
        }
        // Handle employee creation here
        const employeeRequestBody = {
            name: formDataEmployee.name,
            //email: "homer.simpson@springfieldpowerplant.com",
            //phone: "0404 123 123",

            // Include more properties here
        };

        // Send a POST request to create an employee
        fetch('https://my.tanda.co/api/v2/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(employeeRequestBody),
        })
            .then(response => {
                if (response.ok) {
                    // Handle success
                    setShowResult("Employee created successfully!");
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();
                } else if (response.status === 403) {
                    // Handle 403 error (forbidden)
                    setShowResult("You do not have the required permissions to create a Employee.");
                } else {
                    // Handle errors
                    setShowResult("Failed to create employee");
                }
            })
            .catch(error => {
                // Handle network errors
                setShowResult("Network error: " + error.message);
            });
    }

    function handleUpdateLocationSubmit(e) {
        e.preventDefault();

        if (!formDataLocation.locationsId) {
            setShowResult("Please fill in all required fields.");
            return;
        }
        const locationId = formDataLocation.locationsId;

        const specificHolidayDatesArray = inputSpecificHolidayDates ? inputSpecificHolidayDates.split(',') : [];

        const requestBody = {
            name: formDataLocation.name,
            short_name: formDataLocation.short_name,
            latitude: parseFloat(formDataLocation.latitude),
            longitude: parseFloat(formDataLocation.longitude),
            address: formDataLocation.address,
            public_holiday_regions: formDataLocation.public_holiday_regions,
            specific_holiday_dates: specificHolidayDatesArray.map((date) => ({ date: date.trim() })),
        };

        // Filter out properties with empty or null values
        const requestBodyTrim = Object.fromEntries(
            Object.entries(requestBody).filter(([key, value]) => {
                if (value === NaN || value === '' || value === null || (Array.isArray(value) && value.length === 0)) {
                    return false; // Exclude empty values
                }
                if ((key === 'latitude' || key === 'longitude') && isNaN(parseFloat(value))) {
                    return false;
                }
                return true;
            })
        );

        console.log(requestBodyTrim);
        // Send a POST request to create an employee
        fetch(`https://my.tanda.co/api/v2/locations/${locationId}`, {
            method: 'PUT', // Use PUT method for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBodyTrim),
        })
            .then(response => {
                if (response.ok) {
                    console.log("Location updated successfully!");
                    setShowResult("Location updated successfully!");
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();
                    // Handle any additional actions after successful update.
                } else if (response.status === 403) {
                    console.log("You do not have the required permissions to update this location.");
                    setShowResult("You do not have the required permissions to update this location.");
                } else {
                    console.log("Failed to update location");
                    setShowResult("Failed to update location");
                }
            })
            .catch(error => {
                // Handle network errors
                setShowResult("Network error: " + error.message);
            });
    }

    function handleUpdateName(e) {
        console.log('Update Team Name button pressed');
        // Perform the Update Team Name action
        // You can put the relevant code here.

        e.preventDefault();

        if (!formDataTeams.Id) {
            setShowResult("Please fill in all required fields.");
            return;
        }

        const teamUpdateRequestName = {
            name: formDataTeams.name,

        };
        const teamId = parseInt(formDataTeams.Id); // Assuming formDataTeams.Id is the ID of the team to be updated



        fetch(`https://my.tanda.co/api/v2/departments/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(teamUpdateRequestName),
        })
            .then(response => {
                if (response.ok) {
                    setShowResult("Team Name updated successfully!");
                    console.log("Success Response:", response);
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();
                } else {
                    setShowResult("Failed to update team.");
                }
            })
            .catch(error => {
                setShowResult("Network error: " + error.message);
            });
    }

    function handleUpdateQualifications(e) {
        console.log('Update Team Qualifications button pressed');
        e.preventDefault(); // Prevent the default form submission

        if (!formDataTeams.Id) {
            setShowResult("Please fill in the Team ID field.");
            return;
        }

        const teamUpdateRequestQualification = {
            qualification_ids: formDataTeams.qualification_ids.map(Number), // Convert to integers
        };

        console.log(teamUpdateRequestQualification);

        const teamId = parseInt(formDataTeams.Id);

        fetch(`https://my.tanda.co/api/v2/departments/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(teamUpdateRequestQualification),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update team.");
                }
            })
            .then(data => {
                setShowResult("Team Qualifications updated successfully!");
                console.log("Success Response:", data);
                fetchLocations();
                fetchTeams();
                fetchUsers();
            })
            .catch(error => {
                setShowResult("Network error: " + error.message);
            });
    }

    function handleUpdateUsersAndManagers(e) {
        e.preventDefault();
        console.log('Update Team Users and Managers button pressed');



        if (!formDataTeams.Id) {
            setShowResult("Please fill in all required fields.");
            return;
        }

        const teamUpdateRequestUsersManagers = {
            user_ids: formDataTeams.user_ids.map(Number),
            manager_ids: formDataTeams.manager_ids.map(Number),
        };

        console.log(teamUpdateRequestUsersManagers);
        if (teamUpdateRequestUsersManagers.user_ids[0] == 0) {
            delete teamUpdateRequestUsersManagers.user_ids;
        }

        if (teamUpdateRequestUsersManagers.manager_ids[0] == 0) {
            delete teamUpdateRequestUsersManagers.manager_ids;
        }

        console.log(teamUpdateRequestUsersManagers);
        const teamId = parseInt(formDataTeams.Id);
        fetch(`https://my.tanda.co/api/v2/departments/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(teamUpdateRequestUsersManagers),
        })
            .then(response => {
                if (response.ok) {
                    setShowResult("Team Users and Managers updated successfully!");
                    console.log("Success Response:", response);
                } else {
                    setShowResult("Failed to update team Users and Managers.");
                }
            })
            .catch(error => {
                setShowResult("Network error: " + error.message);
            });
    }



    function handleOnboardNewUserSubmit(e) {
        e.preventDefault();
        //console.log('Onboard New User button pressed ');

        if (!formDataOnboarding.Name || !formDataOnboarding.Email || !formDataOnboarding.Phone) {
            setShowResult("Please fill in all required fields.");
            return;
        }

        const onboardRequestData = {
            name: formDataOnboarding.Name,
            email: formDataOnboarding.Email,
            phone: formDataOnboarding.Phone,
            custom_message: formDataOnboarding.Custom_Message,
        };

        fetch('https://my.tanda.co/api/v2/users/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(onboardRequestData),
        })
            .then((response) => {
                if (response.status === 201) {
                    setShowResult("New user onboarded successfully!");
                    console.log("Success Response:", response);
                    fetchUsers();
                } else {
                    return response.json().then((errorData) => {
                        const errorMessage = errorData.error || 'Failed to onboard new user.';
                        setShowResult(errorMessage);
                        console.error("Error Response:", errorData);
                    });
                }
            })
            .catch((error) => {
                setShowResult("Network error: " + error.message);
            });
    }

    function handleOnboardExistingUserSubmit(e) {
        console.log('Onboard Existing User button pressed');
        e.preventDefault();

        if (!formDataOnboarding.Id) {
            setShowResult("Please fill in the User ID field.");
            return;
        }

        const userId = formDataOnboarding.Id;

        fetch(`https://my.tanda.co/api/v2/users/${userId}/onboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    setShowResult("Existing user onboarded successfully!");
                    console.log("Success Response:", response);
                } else {
                    return response.json().then((errorData) => {
                        const errorMessage = errorData.error || 'Failed to onboard existing user.';
                        setShowResult(errorMessage);
                        console.error("Error Response:", errorData);
                    });
                }
            })
            .catch((error) => {
                setShowResult("Network error: " + error.message);
            });
    }

    function handleInactivateEmployeeSubmit(e) {
        console.log('deactivate user button pressed');
        e.preventDefault();

        if (!formDataOnboarding.Id) {
            setShowResult("Please fill in the User ID field.");
            return;
        }
        const userId = formDataOnboarding.Id;
        fetch(`https://my.tanda.co/api/v2/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    setShowResult("Employee Deactivated Successfully!");
                    console.log("Success Response:", response);
                    fetchUsers();
                } else {
                    return response.json().then((errorData) => {
                        const errorMessage = errorData.error || 'Failed to Deactivate Employee user.';
                        setShowResult(errorMessage);
                        console.error("Error Response:", errorData);
                    });
                }
            })
            .catch((error) => {
                setShowResult("Network error: " + error.message);
            });
    }

    async function updateUser(userId, updatedData) {
        try {
            const response = await fetch(`https://my.tanda.co/api/v2/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            return { success: true, message: 'User updated successfully!' };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    }

    async function sendOnboardingInvite(userId) {
        try {
            const response = await fetch(`https://my.tanda.co/api/v2/users/${userId}/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });

            if (response.status === 201) {
                return { success: true, message: 'Onboarding invite sent successfully!' };
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Failed to send onboarding invite.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    }

    async function handleResendOnboardInvitesUserSubmit(e) {
        console.log('Resend onboarding invite pressed');
        e.preventDefault();
        const { Id, email, phone } = formDataOnboarding;
        try {
            if (email || phone) {
                const payload = {};
                if (email) payload.email = email;
                if (phone) payload.phone = phone;
                await updateUser(Id, payload);
                await sendOnboardingInvite(Id);
                setShowResult('Onboarding invite sent successfully');
            } else {
                setShowResult('Error: Please provide either email or phone for updating');
            }
        } catch (error) {
            console.error('Error during onboarding invite resend:', error);
            setShowResult('Error: Unable to resend onboarding invite');
        }
    }

    const getWeekdayName = (weekday) => {
        const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekdayNames[weekday];
    };


    const handleUpdateBusinessHoursSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formDataLocation.locationsId || formDataBusinessHours.business_hours.length === 0) {
            setShowBusinessHoursResult("Please fill in all required fields.");
            return;
        }

        const locationId = formDataLocation.locationsId;


        const updatedFormDataBusinessHours = {
            ...formDataBusinessHours,
            business_hours: formDataBusinessHours.business_hours
                .filter(({ start, finish }) => start !== '' && finish !== '')
                .map((hours, index) => ({ weekday: index, ...hours })),
        };

        console.log(updatedFormDataBusinessHours)



        try {
            const response = await fetch(`https://my.tanda.co/api/v2/locations/${locationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, // Replace apiKey with your actual API key
                },
                body: JSON.stringify(updatedFormDataBusinessHours),
            });

            if (response.ok) {
                console.log("Business hours updated successfully!");
                setShowBusinessHoursResult("Business hours updated successfully!");
                // You might want to refresh the entire form or update other related components here
                fetchLocations(); // Replace with the actual function that fetches and updates location data
                // Handle any additional actions after successful update.
            } else if (response.status === 403) {
                console.log("You do not have the required permissions to update business hours for this location.");
                setShowBusinessHoursResult("You do not have the required permissions to update business hours for this location.");
            } else {
                console.log("Failed to update business hours");
                setShowBusinessHoursResult("Failed to update business hours");
            }
        } catch (error) {
            // Handle network errors
            console.error("Network error:", error);
            setShowBusinessHoursResult("Network error: " + error.message);
        } finally {
            /*setFormDataBusinessHours({
                locationsId: '',
                business_hours: Array(7).fill({ start: '', finish: '' }), // Reset to default values
            });*/
        }
    };

    const handleBusinessHoursChange = (weekday, field, value) => {
        // Assuming formDataBusinessHours is a state variable that holds business hours data
        setFormDataBusinessHours((prevData) => {
            const updatedBusinessHours = prevData.business_hours.map((hours) => {
                if (hours.weekday === weekday) {
                    return {
                        ...hours,
                        [field]: value,
                    };
                }
                return hours;
            });

            return {
                ...prevData,
                business_hours: updatedBusinessHours,
            };
        });
    };

    const handleSpecificHolidayDateChange = (e) => {
        setInputSpecificHolidayDates(e.target.value);
    };

    const handleQualificationChange = (e, index, property) => {
        //console.log(index);
        //console.log(property);
        const updatedQualifications = [...formDataEmployee.qualifications];
        updatedQualifications[index][property] =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        setFormDataEmployee({
            ...formDataEmployee,
            qualifications: updatedQualifications,
        });
        console.log(formDataEmployee.qualifications[index][property]);
    };

    const handleUpdateEmployee = (e) => {
        e.preventDefault();

        if (!formDataEmployee.Id) {
            setShowResult("Please fill in the Team ID field.");
            return;
        }
        let updatedData = {
            name: formDataEmployee.name,
            employee_id: formDataEmployee.employee_id,
            passcode: formDataEmployee.passcode,
            phone: formDataEmployee.phone,
            date_of_birth: formDataEmployee.date_of_birth,
            employment_start_date: formDataEmployee.employment_start_date,
            email: formDataEmployee.email,

            hourly_rate: parseFloat(formDataEmployee.hourly_rate),
            enable_login: formDataEmployee.enable_login,


            bank_details: {
                bsb: formDataEmployee.bank_details_bsb,
                account_number: formDataEmployee.bank_details_account_number,
                account_name: formDataEmployee.bank_details_account_name,
            }

            //create seperate update for qualifications


        }
        console.log(updatedData);

        const cleanObject = (obj) => {
            for (const key in obj) {
                if (obj[key] === null || obj[key] === '' || (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object') {
                    cleanObject(obj[key]);
                }
            }
        };
        cleanObject(updatedData);

        if (isNaN(updatedData.hourly_rate)) {
            delete updatedData.hourly_rate;
        }

        //console.log("bsb check:", updatedData.bank_details_account_name);
        //console.log("bsb check:", formDataEmployee.bank_details_account_name);
        //console.log(formDataEmployee.qualifications[0].license_number);
        //console.log("Hourly rate after removal:", updatedData.hourly_rate);
        console.log(JSON.stringify(updatedData));
        // Send a fetch request to update the user's information
        fetch(`https://my.tanda.co/api/v2/users/${formDataEmployee.Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (response.ok) {
                    setShowResult("User updated successfully!. Please reload page to see updated search results");
                    console.log("Success Response:", response);
                    fetchLocations();
                    fetchTeams();
                    fetchUsers();

                } else {
                    setShowResult("Failed to update User.");
                }
            })
            .catch((error) => {
                // Handle network or other errors
                console.error(error);
            });
    };







    function handleUpdateTeamsSubmit(e) {

    }

    return (
        <div className="background" >
            <h1 className="title-EM primary  "> Employee Management </h1>
            <div className="flex-container" >
                <div className="left-column-nav-EM">
                    <ul className="navEM" style={{ listStyleType: 'none' }}>
                        <li>
                            <a onClick={handleCreateLocationsClick}>Create Locations</a>
                        </li>
                        <li>
                            <a onClick={handleUpdateLocationsClick}>Update Locations</a>
                        </li>
                        <li>
                            <a onClick={handleCreateUsersClick}>Create Users</a>
                        </li>
                        <li>
                            <a onClick={handleUpdateUsersClick}>Update Users</a>
                        </li>
                        <li>
                            <a onClick={handleCreateTeamsClick}>Create Teams</a>
                        </li>
                        <li>
                            <a onClick={handleUpdateTeamsClick}>Update Teams</a>
                        </li>
                        <li>
                            <a onClick={handleOnboardNewUserClick}>Send Onboard User Invites</a>
                        </li>
                        <li>
                            <a onClick={handleInactivateEmployeeClick}>Deactivate employee</a>
                        </li>
                    </ul>
                </div>
                <div >
                    {showLocationForm ? (

                        <form onSubmit={handleCreateLocationSubmit} style={{ padding: '30px' }} className="primary" >
                            <h2 className="secondary h2-EM">Create location</h2>
                            <div >
                                <h3 className="secondary">Set Location Name Details:</h3>
                                <input
                                    style={{ margin: '5px' }}
                                    type="text"
                                    placeholder="Name"
                                    value={formDataLocation.name}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, name: e.target.value })}
                                />
                                <input
                                    style={{ margin: '5px' }}
                                    type="text"
                                    placeholder="Short_Name"
                                    value={formDataLocation.short_name}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, short_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <h3 className="secondary">Set Location Geotag Details:</h3>
                                <input
                                    type="number"
                                    style={{ margin: '5px' }}
                                    placeholder="Latitude"
                                    value={formDataLocation.latitude}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    style={{ margin: '5px' }}
                                    placeholder="Longitude"
                                    value={formDataLocation.longitude}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, longitude: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    style={{ margin: '5px' }}
                                    value={formDataLocation.address}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, address: e.target.value })}
                                />

                            </div>
                            <div>
                                <h3 className="secondary">Set Location Public Holiday Regions Details:</h3>
                                <p> To select muitiple Regions hold CTRL and click on each region </p>
                                <p> To unselect hold CTRL and click already selected region </p>
                                <select
                                    multiple
                                    value={formDataLocation.public_holiday_regions}
                                    onChange={(e) =>
                                        setFormDataLocation({ ...formDataLocation, public_holiday_regions: Array.from(e.target.selectedOptions, option => option.value) })
                                    }
                                >
                                    <option value="au">Australia</option>
                                    <option value="us">United States</option>
                                    <option value="ca">Canada</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="fr">France</option>
                                    {/* Add more options for other regions if needed */}
                                </select>
                            </div>

                            <button type="submit" style={{ margin: '10px' }} className="EM-button" >Create Location</button>
                            {showResult && <p>{showResult}</p>}
                        </form>


                    ) : showTeamsForm ? (
                        // Team form
                        <div className="flex-container">
                            <form onSubmit={handleCreateTeamsSubmit} style={{ padding: '30px' }} className="primary">
                                <h2 className="secondary h2-EM">Create Team</h2>
                                <div>
                                    <h3 className="secondary">Set Team Details:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Team Name"
                                        value={formDataTeams.name}
                                        onChange={e => setFormDataTeams({ ...formDataTeams, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Location ID"
                                        value={formDataTeams.location_id}
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, location_id: e.target.value })}
                                    />
                                    <select
                                        value={formDataTeams.location_id}
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, location_id: e.target.value })}
                                    >
                                        <option value="">Select Location ID</option>
                                        {filteredLocations.map((location) => (
                                            <option key={location.id} value={location.id}>
                                                {location.name} - {location.short_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" style={{ margin: '10px' }} className="EM-button">Create Team</button>
                                {showResult && <p>{showResult}</p>}
                            </form>
                        </div>
                    ) : showEmployeeForm ? (
                        <form onSubmit={handleCreateEmployeeSubmit} style={{ padding: '30px' }} className="primary">
                            <h2 className="secondary h2-EM">Create Employee</h2>
                            <div>
                                <h3 className="secondary">Employee Details:</h3>
                                <input

                                    type="text"
                                    style={{ margin: '5px' }}
                                    placeholder="Name"
                                    value={formDataEmployee.name}
                                    onChange={e => setFormDataEmployee({ ...formDataEmployee, name: e.target.value })}
                                />
                            </div>

                            <button type="submit" style={{ margin: '10px' }} className="EM-button">Create Employee</button>
                            {showResult && <p>{showResult}</p>}
                        </form>
                    ) : showUpdateLocations ? (
                        <div className="">
                            <form
                                onSubmit={handleUpdateLocationSubmit}
                                style={{ padding: '30px' }}
                                className="primary"
                            >
                                <h2 className="secondary h2-EM">Update Location</h2>
                                <h3 className="secondary">Update fields that you wish to change</h3>
                                <p>ID must be provided</p>

                                <input
                                    type="text"
                                    placeholder="Location ID"
                                    value={formDataLocation.locationsId}
                                    onChange={(e) =>
                                        setFormDataLocation({ ...formDataLocation, locationsId: e.target.value })
                                    }
                                />

                                <select
                                    value={formDataLocation.locationsId}
                                    onChange={(e) => setFormDataLocation({ ...formDataLocation, locationsId: e.target.value })}
                                >
                                    <option value="">Select Location ID</option>
                                    {filteredLocations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name} - {location.short_name}
                                        </option>
                                    ))}
                                </select>

                                <div>
                                    <h3 className="secondary">Set Location Name Details:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Name"
                                        value={formDataLocation.name}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, name: e.target.value })
                                        }
                                    />
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Short_Name"
                                        value={formDataLocation.short_name}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, short_name: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <h3 className="secondary">Set Location Geotag Details:</h3>
                                    <input
                                        type="number"
                                        style={{ margin: '5px' }}
                                        placeholder="Latitude"
                                        value={formDataLocation.latitude}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, latitude: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        placeholder="Longitude"
                                        style={{ margin: '5px' }}
                                        value={formDataLocation.longitude}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, longitude: e.target.value })
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        style={{ margin: '5px' }}
                                        value={formDataLocation.address}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, address: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <h3 className="secondary">Set Location Public Holiday Regions Details:</h3>
                                    <p> To select muitiple Regions hold CTRL and click on each region </p>
                                    <select
                                        multiple
                                        value={formDataLocation.public_holiday_regions}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, public_holiday_regions: Array.from(e.target.selectedOptions, option => option.value) })
                                        }
                                    >
                                        <option value="au">Australia</option>
                                        <option value="us">United States</option>
                                        <option value="ca">Canada</option>
                                        <option value="uk">United Kingdom</option>
                                        <option value="fr">France</option>
                                        {/* Add more options for other regions if needed */}
                                    </select>
                                </div>
                                <div>
                                    <h3 className="secondary">Set Specific Holiday Dates:</h3>
                                    <p>Inputs for Specific Holiday Dates should look like this for example -  eg 2016-03-14 , 2016-03-15</p>
                                    <p>separate using commas</p>
                                    <input
                                        type="text"
                                        placeholder="Date"
                                        value={inputSpecificHolidayDates}
                                        onChange={handleSpecificHolidayDateChange}
                                    />

                                </div>
                                <button type="submit" style={{ margin: '10px' }} className="EM-button">
                                    Update Location
                                </button>
                                {showResult && <p>{showResult}</p>}
                            </form>
                            <form
                                onSubmit={handleUpdateBusinessHoursSubmit}
                                style={{ padding: '30px' }}
                                className="primary"
                            >
                                <h2 className="secondary h2-EM">Update Business Hours</h2>

                                <p>ID must be provided</p>

                                <input
                                    type="text"
                                    placeholder="Location ID"
                                    value={formDataLocation.locationsId}
                                    onChange={(e) =>
                                        setFormDataLocation({ ...formDataLocation, locationsId: e.target.value })
                                    }
                                />

                                <select
                                    value={formDataLocation.locationsId}
                                    onChange={(e) => setFormDataLocation({ ...formDataLocation, locationsId: e.target.value })}
                                >
                                    <option value="">Select Location ID</option>
                                    {filteredLocations.map((location) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name} - {location.short_name}
                                        </option>
                                    ))}
                                </select>

                                <div>
                                    <h3 className="secondary">Set Business Hours:</h3>
                                    <p>In the below input fields please use 24 hour time. eg 07:00 for 7am or 14:00 for 2pm</p>
                                    {formDataBusinessHours.business_hours.map((hours) => (
                                        <div key={hours.weekday}>
                                            <h3>{getWeekdayName(hours.weekday)}</h3>
                                            <input
                                                type="text"
                                                placeholder="Start time"
                                                value={hours.start}
                                                onChange={(e) => handleBusinessHoursChange(hours.weekday, 'start', e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Finish time"
                                                value={hours.finish}
                                                onChange={(e) => handleBusinessHoursChange(hours.weekday, 'finish', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" style={{ margin: '10px' }} className="EM-button">
                                    Update Business Hours
                                </button>
                                {showBusinessHoursResult && <p>{showBusinessHoursResult}</p>}
                            </form>
                        </div>
                    ) : showUpdateTeams ? (
                        <div className="flex-container">
                            <form onSubmit={handleUpdateTeamsSubmit} style={{ padding: '30px' }} className="primary">
                                <h2 className="secondary h2-EM">Update Teams</h2>
                                <p>todo - users and managers update still doesnt work </p>

                                <div>
                                    <h3 className="secondary">Team Id:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Team ID"
                                        value={formDataTeams.Id}
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, Id: e.target.value })}
                                    />
                                    <select
                                        value={formDataTeams.Id}
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, Id: e.target.value })}
                                    >
                                        <option value="">Select Team ID</option>
                                        {filteredTeams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name} - {team.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <div>
                                    <h3 className="secondary">Set Team Details:</h3>
                                    <input
                                        type="text"
                                        placeholder="Team Name"
                                        style={{ margin: '5px' }}
                                        value={formDataTeams.name}
                                        onChange={e => setFormDataTeams({ ...formDataTeams, name: e.target.value })}
                                    />
                                </div>
                                <button onClick={handleUpdateName} type="submit" style={{ margin: '10px' }} className="EM-button">Update Team Name</button>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Qualification IDs (comma-separated)"
                                        style={{ margin: '5px' }}
                                        value={formDataTeams.qualification_ids.join(',')} // Join the array for display
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, qualification_ids: e.target.value.split(',') })}
                                    />
                                </div>
                                <button onClick={handleUpdateQualifications} type="submit" style={{ margin: '10px' }} className="EM-button">Update Team Qualifications</button>
                                <div >
                                    <input
                                        type="text"
                                        placeholder="User IDs (comma-separated)"
                                        style={{ margin: '5px' }}
                                        value={formDataTeams.user_ids.join(',')} // Join the array for display
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, user_ids: e.target.value.split(',') })}
                                    />
                                    <p>user IDs current dont work</p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Manager IDs (comma-separated)"
                                        style={{ margin: '5px' }}
                                        value={formDataTeams.manager_ids.join(',')} // Join the array for display
                                        onChange={(e) => setFormDataTeams({ ...formDataTeams, manager_ids: e.target.value.split(',') })}
                                    />
                                </div>
                                <button onClick={handleUpdateUsersAndManagers} type="submit" style={{ margin: '10px' }} className="EM-button">Update Team Users and managers</button>
                                {showResult && <p>{showResult}</p>}
                            </form>
                            <div className="Users-list">
                                <input
                                    type="text"
                                    style={{ margin: '5px' }}
                                    placeholder="Search Users"
                                    value={searchUsers}
                                    onChange={(e) => setSearchUsers(e.target.value)}
                                />
                                {searchUsers && (
                                    <ul >
                                        {filteredUsers.map((Users) => (
                                            <li key={Users.id} className='li-EM '>
                                                <p>ID: {Users.id}</p>
                                                <p>Name: {Users.name}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : showUpdateUsers ? (
                        <div className="flex-container">
                            <form onSubmit={handleUpdateEmployee} style={{ padding: '30px' }} className="primary">
                                <h2 className="secondary h2-EM">Update User</h2>
                                <p>Id field is Mandatory.</p>
                                <p>Other fields are Optional.</p>
                                <p>Note - Updating a field with the same value as already in the system will result in updating failing.</p>

                                <div>
                                    <h3 className="secondary">User Id:</h3>
                                    <input
                                        type="text"
                                        placeholder="User ID"
                                        style={{ margin: '5px' }}
                                        value={formDataEmployee.Id}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, Id: e.target.value })}
                                    />
                                    <select
                                        value={formDataEmployee.Id}
                                        onChange={(e) => setFormDataEmployee({ ...formDataEmployee, Id: e.target.value })}
                                    >
                                        <option value="">Select User ID</option>
                                        {filteredUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <h3 className="secondary">Set User/Employee Details:</h3>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="User Name"
                                        style={{ margin: '5px' }}
                                        value={formDataEmployee.name}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Employee ID"
                                        value={formDataEmployee.employee_id}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, employee_id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Passcode"
                                        style={{ margin: '5px' }}
                                        value={formDataEmployee.passcode}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, passcode: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        style={{ margin: '5px' }}
                                        value={formDataEmployee.phone}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        style={{ margin: '5px' }}
                                        value={formDataEmployee.email}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, email: e.target.value })}
                                    />
                                </div>


                                <div>
                                    <h4 className="secondary">Date of Birth:</h4>
                                    <input
                                        type="date"
                                        style={{ margin: '5px' }}
                                        placeholder="Date of Birth"
                                        value={formDataEmployee.date_of_birth}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, date_of_birth: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h4 className="secondary">Employment Start Date:</h4>
                                    <input
                                        type="date"
                                        style={{ margin: '5px' }}
                                        placeholder="Employment Start Date"
                                        value={formDataEmployee.employment_start_date}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, employment_start_date: e.target.value })}
                                    />
                                </div>



                                <div>
                                    <input
                                        type="text"
                                        placeholder="Hourly Rate"
                                        value={formDataEmployee.hourly_rate}
                                        onChange={e => setFormDataEmployee({ ...formDataEmployee, hourly_rate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <h3 className="secondary">Enable Login:</h3>
                                    <label>
                                        <input
                                            type="radio"
                                            style={{ margin: '5px' }}
                                            value="true"
                                            checked={formDataEmployee.enable_login === true}
                                            onChange={() => setFormDataEmployee({ ...formDataEmployee, enable_login: true })}
                                        />
                                        True
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="false"
                                            style={{ margin: '5px' }}
                                            checked={formDataEmployee.enable_login === false}
                                            onChange={() => setFormDataEmployee({ ...formDataEmployee, enable_login: false })}
                                        />
                                        False
                                    </label>
                                </div>


                                <div>
                                    <h3 className="secondary">Bank Details:</h3>
                                    <p>Note - On first update of bank details user must submit all bank details or details wont be updated</p>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="BSB"
                                            value={formDataEmployee.bank_details_bsb}
                                            onChange={e => setFormDataEmployee({ ...formDataEmployee, bank_details_bsb: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Account Number"
                                            value={formDataEmployee.bank_details_account_number}
                                            onChange={e => setFormDataEmployee({ ...formDataEmployee, bank_details_account_number: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Account Name"
                                            value={formDataEmployee.bank_details_account_name}
                                            onChange={e => setFormDataEmployee({ ...formDataEmployee, bank_details_account_name: e.target.value })}
                                        />
                                    </div>
                                 </div>

                                <button type="submit" style={{ margin: '10px' }} className="EM-button">Update Users Submit</button>
                                {showResult && <p>{showResult}</p>}
                            </form>
                        </div>

                    ) : showOnboardNewUser ? (
                        <div className="flex-container">
                            <form style={{ padding: '30px' }} className="primary">
                                <h2 className="secondary h2-EM">Onboard A New User</h2>

                                <div>
                                    <h3 className="secondary">Name:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Name"
                                        value={formDataOnboarding.Name}
                                        onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h3 className="secondary">Email:</h3>
                                    <input
                                        type="email"
                                        style={{ margin: '5px' }}
                                        placeholder="Email"
                                        value={formDataOnboarding.Email}
                                        onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h3 className="secondary">Phone:</h3>
                                    <input
                                        type="tel"
                                        style={{ margin: '5px' }}
                                        placeholder="Phone"
                                        value={formDataOnboarding.Phone}
                                        onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <h3 className="secondary">Custom Message:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="Custom Message"
                                        value={formDataOnboarding.Custom_Message}
                                        onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Custom_Message: e.target.value })}
                                    />
                                </div>

                                <button onClick={handleOnboardNewUserSubmit} type="submit" style={{ margin: '10px' }} className="EM-button">
                                    Onboard New User
                                </button>

                                {showResult && <p>{showResult}</p>}
                            </form>
                            <div className=''>
                                <form style={{ padding: '30px' }} className="primary">
                                    <h2 className="secondary h2-EM">Onboard A Existing User</h2>

                                    <div>
                                        <h3 className="secondary">User ID:</h3>
                                        <input
                                            type="text"
                                            style={{ margin: '5px' }}
                                            placeholder="User ID"
                                            value={formDataOnboarding.Id}
                                            onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                        />
                                        <select
                                            value={formDataOnboarding.Id}
                                            onChange={(e) => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                        >
                                            <option value="">Select User ID</option>
                                            {filteredUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} - {user.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <button onClick={handleOnboardExistingUserSubmit} type="submit" style={{ margin: '10px' }} className="EM-button">
                                        Onboard New User
                                    </button>

                                    {showResult && <p>{showResult}</p>}
                                </form>
                                <form style={{ padding: '30px' }} className="primary">
                                    <h2 className="secondary h2-EM">Resend Onbording Invites</h2>
                                    <p>Must change email or phone number to resend invite</p>
                                    <p>note that this will also change employees email and phone within system</p>

                                    <div>
                                        <h3 className="secondary">User ID:</h3>
                                        <input
                                            type="text"
                                            style={{ margin: '5px' }}
                                            placeholder="User ID"
                                            value={formDataOnboarding.Id}
                                            onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                        />
                                        <select
                                            value={formDataOnboarding.Id}
                                            onChange={(e) => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                        >
                                            <option value="">Select User ID</option>
                                            {filteredUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} - {user.email}
                                                </option>
                                            ))}
                                        </select>


                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            style={{ margin: '5px' }}
                                            placeholder="Email"
                                            value={formDataOnboarding.email}
                                            onChange={e => setFormDataOnboarding({ ...formDataOnboarding, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            style={{ margin: '5px' }}
                                            placeholder="Phone"
                                            value={formDataOnboarding.phone}
                                            onChange={e => setFormDataOnboarding({ ...formDataOnboarding, phone: e.target.value })}
                                        />
                                    </div>


                                    <button onClick={handleResendOnboardInvitesUserSubmit} type="submit" style={{ margin: '10px' }} className="EM-button">
                                        Resend Onbording Invites
                                    </button>

                                    {showResult && <p>{showResult}</p>}
                                </form>
                            </div>

                        </div>
                    ) : showInactivateEmployee ? (
                        <div>
                            <form style={{ padding: '30px' }} className="primary">
                                <h2 className="secondary h2-EM">Deactivate Employee</h2>

                                <div>
                                    <h3 className="secondary">User ID:</h3>
                                    <input
                                        type="text"
                                        style={{ margin: '5px' }}
                                        placeholder="User ID"
                                        value={formDataOnboarding.Id}
                                        onChange={e => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                    />
                                    <select
                                        value={formDataOnboarding.Id}
                                        onChange={(e) => setFormDataOnboarding({ ...formDataOnboarding, Id: e.target.value })}
                                    >
                                        <option value="">Select User ID</option>
                                        {filteredUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                <button onClick={handleInactivateEmployeeSubmit} type="submit" style={{ margin: '10px' }} className="EM-button">
                                    Deactivate  a Employee
                                </button>

                                {showResult && <p>{showResult}</p>}
                            </form>
                        </div>
                    ) : (
                        <div style={{ paddingLeft: '20px' }}>
                            <h2 className="secondary h2-EM">Welcome to Employee Management</h2>
                            <p>
                                We're excited to have you on board! This is your Employee Management system, where you can manage employee data, locations, teams, and more.
                            </p>
                            <p>
                                Use the navigation on the left to get started. If you have any questions or need assistance, feel free to reach out to our support team.
                            </p>
                            <p>
                                Here's a brief overview of what you can do:
                            </p>
                            <ul>
                                <li><strong>Create Locations:</strong> Click on "Create Locations" to add new locations to your system.</li>
                                <li><strong>Update Locations:</strong> Use "Update Locations" to modify existing location details.</li>
                                <li><strong>Create Users:</strong> Click on "Create Users" to add new employees to your system.</li>
                                <li><strong>Update Users:</strong> Use "Update Users" to edit employee information or make changes.</li>
                                <li><strong>Create Teams:</strong> Click on "Create Teams" to form new teams within your organization.</li>
                                <li><strong>Update Teams:</strong> Use "Update Teams" to modify existing team details.</li>
                                <li><strong>Send Onboard User Invites:</strong> Click on "Send Onboard User Invites" to initiate the onboarding process for new users.</li>
                                <li><strong>Deactivate Employee:</strong> Use "Deactivate Employee" to deactivate or remove an employee from the system.</li>
                            </ul>
                        </div>
                    )
                    }
                </div>

            </div >
        </div >
    );
}

export default EmployeeManagement; 