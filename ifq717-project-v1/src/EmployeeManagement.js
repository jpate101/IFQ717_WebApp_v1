import React from 'react';
import { useState, useEffect } from 'react';

function EmployeeManagement() {
    const [showLocationForm, setShowLocationForm] = useState(false);
    const [showTeamsForm, setShowTeamsForm] = useState(false);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [showUpdateUsers, setShowUpdateUsers] = useState(false);
    const [showUpdateLocations, setShowUpdateLocations] = useState(false);
    const [showUpdateTeams, setShowUpdateTeams] = useState(false);
    const [showOnboardNewUser, setShowOnboardNewUser] = useState(false);
    const [showResult, setShowResult] = useState("");

    //search locations stuff 
    const [locationsList, setLocationsList] = useState([]);
    const [searchLocation, setSearchLocation] = useState(''); // State for search query
    const [filteredLocations, setFilteredLocations] = useState([]); // State for filtered locations

    const fetchLocations = async () => {
        try {
            const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
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
            const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
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
            const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
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
        setShowResult('');
    }
    const handleOnbooardNewUserClick = () => {
        setShowUpdateUsers(false);
        setShowUpdateLocations(false);
        setShowUpdateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowOnboardNewUser(true);
        setShowResult('');
    }
    //form
    const [formDataLocation, setFormDataLocation] = useState({
        locationsId: '',
        name: '',
        short_name: '',
        latitude: '',
        longitude: '',
        address: '',
        public_holiday_regions: ['au'],
        specific_holiday_dates: [
            { date: '' },
            { date: '', from: '', to: '' },
        ],
    });
    const [formDataTeams, setFormDataTeams] = useState({
        Id: '',
        name: '',
        location_id: '',
        export_name: '',
        colour: '',
        team_group: '',
        qualification_ids: [''],
        user_ids: [''],
        manager_ids: [''],
    });
    const [formDataEmployee, setFormDataEmployee] = useState({
        Id: '',
        name: '',
        date_of_birth: '',
        employment_start_date: '',
        employee_id: '',
        passcode: '',
        department_ids: [''],
        preferred_hours: null,
        part_time_fixed_hours: null,
        award_template_id: null,
        award_template_organisation_id: null,
        award_tag_ids: [''],
        report_department_id: null,
        managed_department_ids: [''],
        email: '',
        phone: '',
        days_overtime_averaged_over: null,
        overtime_calculated_over_period_start: '',
        can_see_costs: false,
        user_levels: [''],
        yearly_salary: null,
        next_pay_group_id: null,
        hourly_rate: null,
        bank_details_bsb: null,
        bank_details_account_number: null,
        bank_details_account_name: null,
        address: {
            street_line_one: '',
            street_line_two: '',
            city: '',
            state: '',
            country: '',
            postcode: '',
        },
        tax_declaration: {
            previous_family_name: '',
            australian_tax_resident: false,
            australian_tax_residency_status: '',
            tax_free_threshold: false,
            senior_tax_offset: false,
            zone_overseas_carer: false,
            student_loan: false,
            financial_supplement_debt: false,
            tax_code: false,
            employment_basis: '',
            tax_file_number: 0,
            student_loan_plans: [''],
            uk_tax_year_status: '',
            tax_scale_type: '',
            income_type: '',
            home_country: '',
            employment_type: '',
            senior_marital_status: '',
        },
        bank_details: {
            bsb: null,
            account_number: null,
            account_name: '',
        },
        super_fund_membership: {
            request: {
                employer_default: false,
                ioof: false,
                own_choice: false,
                elevate: false,
            },
            config: {
                super_contribution_type: '',
                trustee_director: false,
                member_number: '',
                occupational_rating: '',
                super_fund_id: null,
            },
        },
        regular_hours: {
            start_date: '',
            schedules: {
                week: null,
                day: '',
                start: '',
                end: '',
                breaks: '',
                department_id: null,
            },
        },
        temporary_employee_type: '',
        qualifications: [
            {
                qualification_id: null,
                enabled: null,
                license_number: "",
                expires: "",
                in_training: null,
                file_id: ""
            }
        ],
        enable_login: null,
    });
    const [formDataOnboarding, setFormDataOnboarding] = useState({
        Id: '',
        Name: '',
        Email: '',
        Phone: '',
        Custom_Message: '',

    });
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
            specific_holiday_dates: [
                {
                    date: '',
                },
                {
                    date: '',
                    from: null,
                    to: null,
                },
            ],
        };
        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
        console.log(requestBody);
        console.log(apiKey);

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

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

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

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

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

        const requestBody = {
            name: formDataLocation.name,
            short_name: formDataLocation.short_name,
            latitude: parseFloat(formDataLocation.latitude),
            longitude: parseFloat(formDataLocation.longitude),
            address: formDataLocation.address,
            public_holiday_regions: formDataLocation.public_holiday_regions,
            specific_holiday_dates: [
                {
                    date: '2016-03-14',
                },
                {
                    date: '2016-08-08',
                    from: 12,
                    to: 17,
                },
            ],
        };

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

        // Send a POST request to create an employee
        fetch(`https://my.tanda.co/api/v2/locations/${locationId}`, {
            method: 'PUT', // Use PUT method for updating
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
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
    function handleUpdateTeamsSubmit(e) {

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

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
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

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

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

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");
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

    const handleUpdateEmployee = (e) => {
        e.preventDefault();

        if (!formDataEmployee.Id) {
            setShowResult("Please fill in the Team ID field.");
            return;
        }

        // Create a copy of the formDataEmployee object
        //let updatedData = { ...formDataEmployee };

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


            //bank_details: {
            //    bsb: parseFloat(formDataEmployee.bank_details_bsb),
            //    account_number: parseFloat(formDataEmployee.bank_details_account_number),
            //    account_name: parseFloat(formDataEmployee.bank_details_account_name),
            //}
            /*
            //create seperate update for qualifications
            qualifications: [//
                {
                    qualification_id: parseFloat(formDataEmployee.qualifications.qualification_id),
                    enabled: formDataEmployee.qualifications.enabled,
                    license_number: formDataEmployee.qualifications.license_number,
                    expires: formDataEmployee.qualifications.expires,
                    in_training: formDataEmployee.qualifications.in_training,
                    file_id: formDataEmployee.qualifications.file_id
                }
            ]
            */

        }
        console.log(updatedData.employment_start_date);

        if (updatedData.name === '') {
            delete updatedData.name;
        }
        if (updatedData.email === '') {
            delete updatedData.email;
        }
        if (updatedData.enable_login === null) {
            delete updatedData.enable_login;
        }
        if (updatedData.date_of_birth === "") {
            delete updatedData.date_of_birth;
        }
        if (updatedData.employment_start_date === '') {
            delete updatedData.employment_start_date;
        }

        for (let field in updatedData) {
            //console.log(field);
            if (typeof updatedData[field] === 'object') {
                // Check if the property is an object (e.g., bank_details)
                for (let subField in updatedData[field]) {
                    if (field !== 'name' && (updatedData[field][subField] === "" || updatedData[field][subField] == null || isNaN(updatedData[field][subField]))) {
                        delete updatedData[field][subField];
                    }
                }
            } else if (field !== 'name' && field !== 'email' && field !== 'date_of_birth' && field !== 'employment_start_date' && (updatedData[field] === "" || updatedData[field] === null || isNaN(updatedData[field]))) {
                delete updatedData[field];
            }
        }



        // console.log("bsb check:", updatedData.bank_details.bsb);
        console.log(updatedData);
        //console.log("----------");

        const apiKey = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/, "$1");

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

    function handleOnboardNewUserSubmit(e) {
        e.preventDefault();
        //console.log('Onboard New User button pressed ');

        if (!formDataOnboarding.Name || !formDataOnboarding.Email || !formDataOnboarding.Phone || !formDataOnboarding.Custom_Message) {
            setShowResult("Please fill in all required fields.");
            return;
        }

        const onboardRequestData = {
            name: formDataOnboarding.Name,
            email: formDataOnboarding.Email,
            phone: formDataOnboarding.Phone,
            custom_message: formDataOnboarding.Custom_Message,
        };

        const apiKey = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/,
            "$1"
        );

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
        const apiKey = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/,
            "$1"
        );

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

    function handleResendOnboardInvitesUserSubmit(e) {
        console.log('send invite button pressed');
        e.preventDefault();

        if (!formDataOnboarding.Id) {
            setShowResult("Please fill in the User ID field.");
            return;
        }

        const userId = formDataOnboarding.Id;
        const apiKey = document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*=s*([^;]*).*$)|^.*$/,
            "$1"
        );
        fetch(`https://my.tanda.co/api/v2/users/${userId}/invite`, {
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
                            <a onClick={handleOnbooardNewUserClick}>Send Onboard User Invites</a>
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
                                <select
                                    value={formDataLocation.public_holiday_regions[0]}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, public_holiday_regions: [e.target.value] })}
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
                                <h3 className="secondary">Optional: Set Location Public Holiday Regions Details by Individual Dates</h3>
                                <p>todo: add forms later</p>



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
                        <div className="flex-container">
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
                                    <select
                                        value={formDataLocation.public_holiday_regions[0]}
                                        onChange={(e) =>
                                            setFormDataLocation({ ...formDataLocation, public_holiday_regions: [e.target.value] })
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
                                    <h3 className="secondary">Optional: Set Location Public Holiday Regions Details by Individual Dates</h3>
                                    <p>todo: add forms later</p>
                                </div>
                                <button type="submit" style={{ margin: '10px' }} className="EM-button">
                                    Update Location
                                </button>
                                {showResult && <p>{showResult}</p>}
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
                                <p>Id field is Mandatory</p>
                                <p>Other fields are Optional</p>

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

                                {/*<div>
                                    <h3 className="secondary">Bank Details:</h3>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="BSB"
                                            value={formDataEmployee.bank_details_bsb}
                                            onChange={e => setFormDataEmployee({ ...formDataEmployee, bank_details_bsb: e.target.value })}
                                        />
                                    </div>
                                 </div>*/}




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
                                    <h2 className="secondary h2-EM">Resend Onbarding Invites</h2>

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


                                    <button onClick={handleResendOnboardInvitesUserSubmit} type="submit" style={{ margin: '10px' }} className="EM-button">
                                        Resend Onbarding Invites
                                    </button>

                                    {showResult && <p>{showResult}</p>}
                                </form>
                            </div>

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
                        </div>
                    )
                    }
                </div>

            </div>
        </div>
    );
}

export default EmployeeManagement;