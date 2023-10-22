import React from 'react';

import { useState } from 'react';


function EmployeeManagement() {
    const [content, setContent] = useState("under construction");
    const [showLocationForm, setShowLocationForm] = useState(false);
    const [showTeamsForm, setShowTeamsForm] = useState(false);
    const [showEmployeeForm, setShowEmployeeForm] = useState(false);
    const [showUpadateUsers, setShowUpadateUsers] = useState(false);
    const [showUpadateLocations, setShowUpadateLocations] = useState(false);
    const [showUpadateTeams, setShowUpadateTeams] = useState(false);

    // display functions 
    const handleCreateLocationsClick = () => {
        setShowLocationForm(true);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
        setShowUpadateUsers(false);
        setShowUpadateLocations(false);
        setShowUpadateTeams(false);
    };

    const handleCreateTeamsClick = () => {
        setShowEmployeeForm(false);
        setShowLocationForm(false);
        setShowTeamsForm(true);
        setShowUpadateUsers(false);
        setShowUpadateLocations(false);
        setShowUpadateTeams(false);
    };

    const handleCreateUsersClick = () => {
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(true);
        setShowUpadateUsers(false);
        setShowUpadateLocations(false);
        setShowUpadateTeams(false);
    };
    const handleUpadateUsersClick = () => {
        setShowUpadateUsers(true);
        setShowUpadateLocations(false);
        setShowUpadateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
    }
    const handleUpadateLocationsClick = () => {
        setShowUpadateUsers(false);
        setShowUpadateLocations(true);
        setShowUpadateTeams(false);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
    }
    const handleUpadateTeamsClick = () => {
        setShowUpadateUsers(false);
        setShowUpadateLocations(false);
        setShowUpadateTeams(true);
        setShowLocationForm(false);
        setShowTeamsForm(false);
        setShowEmployeeForm(false);
    }

    //form
    const [formDataLocation, setFormDataLocation] = useState({
        name: '',
        short_name: '',
        latitude: '',
        longitude: '',
        address: '',
        public_holiday_regions: [''],  // Initialize as an empty array with one empty string
        specific_holiday_dates: [
            { date: '' },
            { date: '', from: '', to: '' },
        ],
    });

    const [formDataTeams, setFormDataTeams] = useState({
        name: '',
        location_id: '',
        export_name: '',
        colour: '',
        team_group: '',
        qualification_ids: [''],  // Initialize as an empty array with one empty string
        user_ids: [''],
    });

    const [formDataEmployee, setFormDataEmployee] = useState({
        name: '',
        date_of_birth: '',
        employment_start_date: '',
        employee_id: '',
        passcode: '',
        department_ids: [''],
        preferred_hours: 0,
        part_time_fixed_hours: 0,
        award_template_id: 0,
        award_template_organisation_id: 0,
        award_tag_ids: [''],
        report_department_id: 0,
        managed_department_ids: [''],
        email: '',
        phone: '',
        days_overtime_averaged_over: 0,
        overtime_calculated_over_period_start: '',
        can_see_costs: false,
        user_levels: [''],
        hourly_rate: 0,
        yearly_salary: 0,
        next_pay_group_id: 0,
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
            bsb: 0,
            account_number: 0,
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
                super_fund_id: 0,
            },
        },
        regular_hours: {
            start_date: '',
            schedules: {
                week: 0,
                day: '',
                start: '',
                end: '',
                breaks: '',
                department_id: 0,
            },
        },
        temporary_employee_type: '',
    });
    //button functions 

    function handleCreateLocationSubmit(e) {
        e.preventDefault();

        // Validate the form fields
        if (!formDataLocation.name || !formDataLocation.latitude || !formDataLocation.longitude || !formDataLocation.address) {
            alert("Please fill in all required fields.");
            return; // Stop the submission if any field is empty
        }
        
        // Create the request body with the form data
        const requestBody = {
            name: formDataLocation.name,
            short_name: formDataLocation.short_name,
            latitude: parseFloat(formDataLocation.latitude), // Convert to a number
            longitude: parseFloat(formDataLocation.longitude), // Convert to a number
            address: formDataLocation.address,
            public_holiday_regions: ['au'],
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

        const apiKey = 'YOUR_API_KEY'; 
    
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
                setContent("Location created successfully!");
            } else {
                // Handle errors
                setContent("Failed to create location");
            }
        })
        .catch(error => {
            // Handle network errors
            setContent("Network error: " + error.message);
        });
    }

    function handleCreateTeamsSubmit(e) {
        // Handle team creation here
        e.preventDefault();
        // ...

        // Example of handling team creation
        const teamRequestBody = {
            name: formDataTeams.name,
            location_id: formDataTeams.location_id,
            export_name: formDataTeams.export_name,
            colour: formDataTeams.colour,
            team_group: formDataTeams.team_group,
            qualification_ids: formDataTeams.qualification_ids,
            user_ids: formDataTeams.user_ids,
        };

        const apiKey = 'YOUR_API_KEY';

        // Send a POST request to create a team
        fetch('https://my.tanda.co/api/v2/teams', {
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
                    setContent("Team created successfully!");
                } else {
                    // Handle errors
                    setContent("Failed to create team");
                }
            })
            .catch(error => {
                // Handle network errors
                setContent("Network error: " + error.message);
            });
    }

    function handleCreateEmployeeSubmit(e) {
        e.preventDefault();
        // Handle employee creation here
        // ...

        // Example of handling employee creation
        const employeeRequestBody = {
            name: formDataEmployee.name,
            date_of_birth: formDataEmployee.date_of_birth,
            // Include more properties here
        };

        const apiKey = 'YOUR_API_KEY';

        // Send a POST request to create an employee
        fetch('https://my.tanda.co/api/v2/employees', {
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
                setContent("Employee created successfully!");
            } else {
                // Handle errors
                setContent("Failed to create employee");
            }
        })
        .catch(error => {
            // Handle network errors
            setContent("Network error: " + error.message);
        });
    }

    return (
        <div className="background" >
          <h1 className="primary"> EmployeeManagement </h1>
          <div className="flex-container" >
            <div className="left-column-nav-EM">
                <ul className="navEM" style={{ listStyleType: 'none' }}>
                    <li>
                        <a onClick={handleCreateTeamsClick}>Create Teams</a>
                    </li>
                    <li>
                        <a onClick={handleUpadateTeamsClick}>Update Teams</a>
                    </li>
                    <li>
                        <a onClick={handleCreateLocationsClick}>Create Locations</a>
                    </li>
                    <li>
                        <a onClick={handleUpadateLocationsClick}>Update Locations</a>
                    </li>
                    <li>
                        <a onClick={handleCreateUsersClick}>Create Users</a>
                    </li>
                    <li>
                        <a onClick={handleUpadateUsersClick}>Update Users</a>
                    </li>
                </ul>
            </div>
            <div >
            {showLocationForm ? (
                            
                            <form onSubmit={handleCreateLocationSubmit} style={{  padding: '30px'}} className="primary" >
                            <h2 className="secondary">Create location</h2>
                            <div>
                                <h3 className="secondary">Set Location Name Details:</h3>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={formDataLocation.name}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, name: e.target.value })}
                                />
                                <input
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
                                    placeholder="Latitude"
                                    value={formDataLocation.latitude}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, latitude: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    value={formDataLocation.longitude}
                                    onChange={e => setFormDataLocation({ ...formDataLocation, longitude: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
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
                                    {/* Add more options for other regions if needed */}
                                </select>
                            </div>
                            <div>
                                <h3 className="secondary">Optional: Set Location Public Holiday Regions Details by Individual Dates</h3>
                                <p>todo: add forms later</p>
                                
                        
                                 
                            </div>
                            <button type="submit" style={{ margin: '10px' }} className="EM-button" >Create Location</button>
                        </form>
                ) : showTeamsForm ? (
                    // Team form
                    <form onSubmit={handleCreateTeamsSubmit} style={{ padding: '30px' }} className="primary">
                        <h2 className="secondary">Create Team</h2>
                        <div>
                            <h3 className="secondary">Set Team Details:</h3>
                            <input
                                type="text"
                                placeholder="Team Name"
                                value={formDataTeams.name}
                                onChange={e => setFormDataTeams({ ...formDataTeams, name: e.target.value })}
                            /> 
                        </div>
                        <div>
                             <input
                                type="text"
                                placeholder="Location ID"
                                value={formDataTeams.location_id}
                                onChange={e => setFormDataTeams({ ...formDataTeams, location_id: e.target.value })}
                            />
                        </div>
                        <div>
                             <input
                                type="text"
                                placeholder="Export Name"
                                value={formDataTeams.export_name}
                                onChange={e => setFormDataTeams({  ...formDataTeams, export_name: e.target.value  })}
                            />
                        </div>
                        <div>
                            <input
                            type="text"
                            placeholder="Colour"
                            value={formDataTeams.colour}
                            onChange={e => setFormDataTeams({ ...formDataTeams, colour: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                            type="text"
                            placeholder="Team Group"
                            value={formDataTeams.team_group}
                            onChange={e => setFormDataTeams({ ...formDataTeams, team_group: e.target.value })}
                             />  
                        </div>
                        <div>
                            <input
                            type="text"
                            placeholder="Qualification IDs (comma-separated)"
                            value={Array.isArray(formDataTeams.qualification_ids) ? formDataTeams.qualification_ids.join(',') : ''}
                            onChange={e => setFormDataTeams({ ...formDataTeams, qualification_ids: e.target.value.split(',') })}
                            />
                        </div>
                        <div>
                           <input
                                type="text"
                                placeholder="Manager IDs (comma-separated)"
                                value={Array.isArray(formDataTeams.qualification_ids) ? formDataTeams.qualification_ids.join(',') : ''}
                                onChange={e => setFormDataTeams({ ...formDataTeams, manager_ids: e.target.value.split(',') })}
                             />
                        </div>

                        <button type="submit" style={{ margin: '10px' }} className="EM-button">Create Team</button>
                    </form>
                ) : showEmployeeForm ? (
                    <form onSubmit={handleCreateEmployeeSubmit} style={{  padding: '30px'}} className="primary">
                        <h2 className="secondary">Create Employee</h2>
                        <div>
                        <h3 className="secondary">Employee Details:</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formDataEmployee.name}
                            onChange={e => setFormDataEmployee({ ...formDataEmployee, name: e.target.value })}
                        />
                        </div>
                        <div>
                        <input
                            type="text"
                            placeholder="Date of Birth"
                            value={formDataEmployee.date_of_birth}
                            onChange={e => setFormDataEmployee({ ...formDataEmployee, date_of_birth: e.target.value })}
                        />
                        </div>
                        <div>
                        <h3 className="secondary">Employment Start Date:</h3>
                        <input
                            type="date" // You can use the date input type for date values
                            id="employment_start_date"
                            name="employment_start_date"
                            value={formDataEmployee.employment_start_date}
                            onChange={e => setFormDataEmployee({ ...formDataEmployee, employment_start_date: e.target.value })}
                        />
                        </div>
                        <button type="submit" style={{ margin: '10px' }} className="EM-button">Create Employee</button>
                    </form>
                ) :showUpadateUsers ? (
                    content
                ) :showUpadateLocations ? (
                    content
                ) :showUpadateTeams ? (
                    content
                ) : (
                    content 
                )
            }
            </div>

          </div>
        </div>
      );
}

export default EmployeeManagement;