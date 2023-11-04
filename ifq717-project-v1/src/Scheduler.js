import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {TimePicker, DatePicker, Select} from 'antd';
import './App.css';
import './index.css';
import './Tailwind.css';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/en_GB'
import 'dayjs/locale/en-gb';
import isoWeekday from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeekday);

const { Option } = Select;

const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

function WeekPickerComponent({ selectedDate, onDateChange }) {
  //console.log('Entering WeekPickerComponent with date:', selectedDate);
  //console.log('Day index for selectedDate:', dayjs(selectedDate).day());

  return (
    <div className="flex justify-between">
      <DatePicker.WeekPicker
        className="bg-white border p-2 rounded m-1"
        onChange={date => {
          //console.log('Date picked:', date);
          //console.log('Week picked:', date);
          onDateChange(date ? date.toDate() : null);
        }}
        value={selectedDate ? dayjs(selectedDate) : null}
        allowClear={false}
        showToday={null}
        format="DD MMM"
        locale={locale}
      />
    </div>
  );
}

function DatePickerDropdown({ onSelectChange }) {
  return (
    <Select className="bg-white h-10 rounded ml-4 w-28 hover:bg-tandaBlue"
      onChange={onSelectChange}
      defaultValue="week">
      <Option value="week" className="">Week</Option>
      <Option value="fortnight"className="">Fortnight</Option>
      <Option value="month" className="">Month</Option>
    </Select>
  );
}

function DateFormItem({ shiftDate }) {
  console.log("DateFormItem rendered with shiftDate:", shiftDate);
  return (
    <FormItemWrapper>
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-calendar w-5 h-5 ml-0.5 mr-4 text-tandaBlue"
        viewBox="0 0 16 16">
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
      </svg>
      <div>{shiftDate ? shiftDate.toDateString(): ''}</div>
    </FormItemWrapper>
  );
}

function calculateHours(startTime, finishTime) {
  if (!startTime || !finishTime) {
    return "";
  }
  // Extract hours and minutes from the start and finish times
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [finishHour, finishMinute] = finishTime.split(':').map(Number);

  // Calculate total start and finish minutes
  const totalStartMinutes = (startHour * 60) + startMinute;
  const totalFinishMinutes = (finishHour * 60) + finishMinute;

  // Calculate the difference in minutes
  let diffMinutes = totalFinishMinutes - totalStartMinutes;

  // Convert the difference to hours and minutes
  const hours = Math.floor(diffMinutes / 60);
  diffMinutes %= 60;

  // Return the formatted result
  if (diffMinutes === 0) {
    return `${hours}h `;
  } else {
    return `${hours}h ${diffMinutes}m`;  // Convert minutes to tenth of an hour
  }
}

function TimePickerComponent({ shiftDetails, setShiftDetails, hoursWorked, setHoursWorked }) {

  return (
    <FormItemWrapper
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="tanda-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    >
      <TimePicker.RangePicker
       format="HH:mm"
       suffixIcon={null}
       minuteStep={15}
       value={[
        shiftDetails.startTime ? dayjs(shiftDetails.startTime, "HH:mm") : null,
        shiftDetails.finishTime ? dayjs(shiftDetails.finishTime, "HH:mm") : null
      ]}
       onChange={dayjsValues => {
        const formattedStartTime = (dayjsValues && dayjsValues[0]) ? dayjsValues[0].format("HH:mm") : "";
        const formattedFinishTime = (dayjsValues && dayjsValues[1]) ? dayjsValues[1].format("HH:mm") : "";
        setShiftDetails(prev => ({ ...prev, startTime:formattedStartTime, finishTime: formattedFinishTime }));
        const calculatedHours = calculateHours(formattedStartTime, formattedFinishTime);
        setHoursWorked(calculatedHours)
      }}
      />
    </FormItemWrapper>
  );
}

function EmployeesDropdown({ employees, onSelectChange, selectedEmployeeId }) {
  return (
    <FormItemWrapper
      icon={
        <svg xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="tanda-icon">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      }
    >
      <Select 
        popupClassName="tanda-dropdown"
        onChange={(value) => onSelectChange(value)}
        value={selectedEmployeeId}
        placeholder="Select an Employee"
        style={{ width: '218px'}}
        showSearch
        filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {employees && employees.map(employee => (
          <Option key={employee.id} value={employee.id}>
            {employee.name}
          </Option>
        ))}
      </Select>
    </FormItemWrapper>
  );
}

function TeamsDropdown({ teams, onSelectChange, employeeTeams }) {
  
  return (
    <FormItemWrapper
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-people tanda-icon" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
        </svg>
      }
    >
        <Select
        popupClassName="tanda-dropdown"
        onChange={value => onSelectChange(value)}
        defaultValue="Select a Team"
        style={{ 
          width: '218px',
        }}
        showSearch
        filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {employeeTeams && employeeTeams.map(team => (
          <Option key={team.id} value={team.id}>
            {team.name}
          </Option>
        ))}
      </Select>
    </FormItemWrapper>
  )
}

function AddANote({ shiftDetails, setShiftDetails}) {
  return (
    <FormItemWrapper
      icon={
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      }
    >
      <textarea
        placeholder="Add shift note"
        value ={shiftDetails.note}
        onChange={e => setShiftDetails(prev => ({ ...prev, note: e.target.value}))}
      ></textarea>
    </FormItemWrapper>
  );
}

function FormItemWrapper({ children, icon}) {
  return (
    <div className="flex">
      {icon && <div className="text-tandaBlue mr-2">{icon}</div>}
      {children}
    </div>
  );
}

 export default function Scheduler() {

  // Set token to the cookie when you receive it after login
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");

  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [setselectedUser, setSelectedUserId] = useState([]);
  const [hoursWorked, setHoursWorked] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [view, setView] = useState('week')
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [shiftDate, setShiftDate] = useState(null);
  const fromDate = dayjs(selectedDate).startOf(view).format('YYYY-MM-DD');
  const toDate = dayjs(selectedDate).endOf(view).format('YYYY-MM-DD');

  const initialRow = useMemo(() => ({
    Mon: "",
    Tues: "",
    Wed: "",
    Thur: "",
    Fri: "",
    Sat: "",
    Sun: ""
  }), []);

  const [allHours, setAllHours] = useState([initialRow]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shiftDetails, setShiftDetails] = useState({
  employee: "",
  date: new Date(),
  startTime: "",
  finishTime: "",
  team: "",
  note: "",
});

const employeeIdToName = employees.reduce((acc, employee) => {
  acc[employee.id] = employee.name; // Assuming the employee object has an 'id' and 'name' property
  return acc;
}, {});

console.log(`Token being used for request: ${token}`);

const fetchShifts = useCallback(async () => {
  console.log('Starting to fetch shifts...');
  
  try {
    const response = await fetch(`https://my.tanda.co/api/v2/shifts?from=${fromDate}&to=${toDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('Fetch attempted, response status:', response.status);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw shift data fetched:', data);

    // Process the shifts data here
    const processedShifts = data.reduce((acc, shift) => {
      console.log('Processing shift:', shift);
      const shiftDate = dayjs(shift.start * 1000).format('YYYY-MM-DD');
      if (!acc[shiftDate]) {
        acc[shiftDate] = [];
      }
      acc[shiftDate].push(shift);
      return acc;
    }, {});

    console.log("Processed shift data:", processedShifts);
    setShifts(processedShifts);
  } catch (error) {
    console.error("There was an error fetching the shifts:", error);
  }
}, [fromDate, toDate, token]);

// Use useEffect to call fetchShifts when the component mounts or when dependencies change
useEffect(() => {
  fetchShifts();
}, [fetchShifts]);

const handleOpenNewShiftModal = (dayIndex) => {
  setSelectedEmployee(null);
  const newShiftDate = getFormattedDateForDay(dayIndex);
  // Initialize the shift details with the selected date
  setShiftDetails({
    employee: "",
    date: newShiftDate,
    startTime: "",
    finishTime: "",
    team: "",
    note: "",
  });
  setIsModalOpen(true);
};

const handleOpenEditShiftModal = (selectedShift) => {
  const employeeForShift = employees.find(emp => emp.id === selectedShift.user_id) || { id: selectedShift.user_id };
  setShiftDetails({
    id: selectedShift.id,
    employee: employeeForShift,
    date: new Date(selectedShift.start * 1000),
    startTime: dayjs(selectedShift.start * 1000).format('HH:mm'),
    finishTime: dayjs(selectedShift.finish * 1000).format('HH:mm'),
    team: selectedShift.department_id, 
    note: selectedShift.metadata
  });
  setIsModalOpen(true);
};

const handleSaveShift = async () => {
  console.log('Saving shift with details:', shiftDetails);

  const formattedDate = dayjs(shiftDetails.date).format('YYYY-MM-DD');
  const shiftStartDate = new Date(`${formattedDate}T${shiftDetails.startTime}:00`);
  const shiftFinishDate = new Date(`${formattedDate}T${shiftDetails.finishTime}:00`);
  
  // Convert the Date objects to Unix epoch time (in seconds)
  const startEpoch = Math.floor(shiftStartDate.getTime() / 1000);
  const finishEpoch = Math.floor(shiftFinishDate.getTime() / 1000);

  const shiftData = {
    user_id: selectedEmployee,
    date: formattedDate,
    start: startEpoch,
    finish: finishEpoch,
    department_id: selectedTeam, // Assuming team is an object with id
    metadata: "",
  };
  console.log("shiftData", shiftData);
  try {
    const method = shiftDetails.id ? 'PUT' : 'POST';
    const url = shiftDetails.id ? `https://my.tanda.co/api/v2/shifts/${shiftDetails.id}` : 'https://my.tanda.co/api/v2/shifts';

    console.log('Attempting to save shift with method:', method, 'and data:', shiftData);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shiftData),
    });

    console.log('Save attempted, response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error(`Failed to save shift: ${response.status}`);
    }

    setSelectedEmployee(null);
    setSelectedTeam(null);

    alert('Shift saved successfully!');
    console.log('Shift saved successfully. Refreshing shifts...');
    await fetchShifts();
    setIsModalOpen(false);
  } catch (error) {
    console.error('Error saving shift:', error);
    alert('Error saving shift: ' + error.message);
  }
};

async function deleteShift(shiftId) {
  const response = await fetch(`https://my.tanda.co/api/v2/shifts/${shiftId}`, {  // Use DELETE method
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete shift.');
  }
}

async function handleDeleteShift() {
  if (!selectedShift) {
      console.log('No shift selected!');
      alert('No shift selected to delete!');
      return;
  }

  try {
      await deleteShift(selectedShift.id);

      const shiftDate = dayjs(selectedShift.start * 1000).format('YYYY-MM-DD');
      if (shifts[shiftDate]) {
          shifts[shiftDate] = shifts[shiftDate].filter(s => s.id !== selectedShift.id);
          setShifts({ ...shifts });
      } else {
          console.error('Unexpected state: The date of the shift was not found in shifts object.', shifts);
      }

      alert('Shift deleted successfully!');
      setIsModalOpen(false);
      setSelectedShift(null);  // Clear out the selected shift
  } catch (error) {
      console.log('Error deleting shift:', error);
      alert('Failed to delete shift: ' + error.message);
  }
}

useEffect(() => {
  async function fetchEmployees() {
    try {
      const response = await fetch('https://my.tanda.co/api/v2/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched employees:', data);
      setEmployees(data);
      setSelectedUserId(data);
    } catch (error) {
      console.error("There was an error fetching the employees:", error);
    }
  }

  fetchEmployees();
}, []);

const [allTeams, setAllTeams] = useState([]); // holds all teams

useEffect(() => {
  async function fetchAllTeams() {
    try {
      console.log("Attempting to fetch all teams...");

      const response = await fetch('https://my.tanda.co/api/v2/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        console.log("Error fetching teams. Response status:", response.status);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAllTeams(data);

      console.log("Fetched all teams successfully:", data);
    } catch (error) {
      console.error("There was an error fetching all the teams:", error);
    }
  }

  fetchAllTeams();
}, []); // This useEffect runs only once to fetch all teams

useEffect(() => {
  // Filter the teams from allTeams
  const employeeTeams = allTeams.filter(team => team.staff.includes(selectedEmployee));
  setTeams(employeeTeams);

  console.log("Filtered teams for the selected employee:", employeeTeams);
  
}, [selectedEmployee, allTeams]);

const handleTodayButtonClick = () => {
  console.log("Today button clicked");
  const today = dayjs().toDate();
  console.log("Today's Date:", today);
  setSelectedDate(today);
}

  const handleViewChange = (selectedView) => {
    //Handle view selection changes
    console.log("handleViewChange triggered with view:", selectedView);
    setView(selectedView);
  }

  useEffect(() => {
    //console.log("Date or view has changed. Date:",selectedDate, "View:", view);
    //Use the dateRange and view to filter and display data
  }, [selectedDate, view]);

  const getStartOfWeek = (date) => {
    const dayOfWeek = dayjs(date).isoWeekday();  // Monday is 1, Sunday is 7
    return dayjs(date).subtract(dayOfWeek - 1, 'days');
  };
 
  const startOfWeek = getStartOfWeek(selectedDate);
 
  const getDateForDay = (dayIndex) => {
    const refDate = startOfWeek.add(dayIndex, 'days');
    //console.log(`For dayIndex ${dayIndex}, computed date is:`, refDate.format('dddd, DD MMM YYYY'));
    return `${refDate.date()} ${refDate.format('MMM')}`;
  };

  const getFormattedDateForDay = (dayIndex) => {
    return startOfWeek.add(dayIndex, 'days').toDate();
   };
 
  // Determine the number of days to show based on the selected view
  const getNumberOfDays = () => {
    switch (view) {
      case "week":
        return 7;
      case "fortnight":
        return 14;
      case "month":
        return dayjs(selectedDate).daysInMonth();
      default:
        return 7;
      }
  };

  const numberOfDays = getNumberOfDays();
  
  const addEmptyRow = () => {
    setAllHours([...allHours, initialRow]);
  };
  
  const [isDotDotDotModalOpen, setIsDotDotDotModalOpen] = useState(false);

  return (
    <div className="mx-auto px-4 md:px-3 lg:px-4 pt-3 pb-3">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <WeekPickerComponent 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <button onClick={handleTodayButtonClick} 
          className="border p-2 rounded bg-tandaBlue text-white">
            Today
          </button>
        </div>
          <DatePickerDropdown
            onSelectChange={handleViewChange}
          />
      </div>
      <div className="scheduler flex flex-col w-full overflow-x-auto">
        <div className="days-row flex">
          {Array.from({ length: numberOfDays }).map((_, index) => (
            <div 
              key={index}
              style={{
                width: `calc(${100 / numberOfDays}% - 2px)`,
                minWidth: '50px'
              }}
              className="day bg-gray-100 border p-2 rounded m-1 overflow-hidden">
              <h3 className="font-bold text-center">
                {selectedDate !== null && daysOfWeek[index % 7]}
              </h3>
              <div className="text-sm text-center">{getDateForDay(index)}</div>
            </div>
          ))}
        </div>
  
        {allHours.map((hoursForDays, rowIndex) => (
          <div className="empty-row flex " key={rowIndex}>
            
            {Array.from({ length: numberOfDays }).map((_, index) => {

              function formatShiftTime(epochTime) {
                return dayjs(epochTime * 1000).format('h:mma'); // This will format the time as e.g. "9:00a"
              }

              const currentFormattedDate = dayjs(getFormattedDateForDay(index)).format('YYYY-MM-DD');
              //console.log('Current formatted date:', currentFormattedDate);
              const dayShifts = shifts[currentFormattedDate] || [];
              //console.log('dayShifts:', dayShifts);
        
              return (
                <div 
                  key={index}
                  style={{
                    width: `calc(${100 / numberOfDays}% - 2px)`,
                    minWidth: '50px'
                  }}
                  className="day bg-white border p-2 rounded m-1 overflow-hidden">
                    <div className="flex flex-col items-center justify-center">
                      <svg 
                        onClick={() => {
                          handleOpenNewShiftModal(index)
                          setShiftDate(getFormattedDateForDay(index));
                          setSelectedRowIndex(rowIndex);
                          //setIsModalOpen(true);
                        }}
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-plus-circle cursor-pointer hover:text-tandaBlue"
                        viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>

                    </div>
                    {/* Add the logic here to display shift details */}
                    {dayShifts.map((shift, index) => (
                      <div
                        className="cursor-pointer hover:bg-gray-200"
                        key={shift.id}
                        onClick={() => {
                          handleOpenEditShiftModal(shift);
                          setSelectedShift(shift)
                          //Displays the current shifts in the table
                          setIsModalOpen(true);
                        }}
                        // ... rest of the ShiftComponent attributes ...
                      >
                        {/* Display shift data as needed */}
                        <div>{employeeIdToName[shift.user_id] || "Unknown"}</div>
                        <div>{formatShiftTime(shift.start)} - {formatShiftTime(shift.finish)}</div>
                      </div>
                    ))}
                
                    {/* ... rest of your code for each cell ... */}
                    
                </div>
              );
            })}
          </div>
        ))}

          
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black">
            <div className="relative bg-white p-5 rounded-lg h-auto max-h-[80vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} 
              className="absolute top-2 right-2 text-xl font-bold">&times;
              </button>
              <div className="my-2">
                <DateFormItem shiftDate={shiftDetails.date}
                />
              </div>
              <div className="my-2">
                <TimePickerComponent
                  shiftDetails={shiftDetails}
                  setShiftDetails={setShiftDetails}
                  hoursWorked={hoursWorked}
                  setHoursWorked={setHoursWorked}
                />
              </div>
              <div className="my-2">
              <EmployeesDropdown
                employees={shiftDetails.id ? [shiftDetails.employee] : employees}
                selectedEmployeeId={selectedEmployee}
                onSelectChange= {(value) => {
                  console.log("Selected Employee ID", value);
                  setSelectedEmployee(value);
                }}
              />
              </div>
              <div className="my-2">
                <TeamsDropdown
                  teams={teams}
                  employeeTeams={teams}
                  onSelectChange= {(value) => setSelectedTeam(value)}
                />
              </div>
              <div className="my-2">
                <AddANote
                  shiftDetails={shiftDetails}
                  setShiftDetails={setShiftDetails}
                />
              </div>
              <div className="flex justify-between my-2">
                <div>{hoursWorked}</div>
                <div className="flex items-center">
                  <svg 
                    onClick={() => setIsDotDotDotModalOpen(true)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-3 cursor-pointer hover:text-tandaBlue">
                    <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <svg
                    onClick=
                    {handleDeleteShift}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-3 cursor-pointer hover:text-tandaBlue">
                    <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                <button
                  onClick={handleSaveShift}
                  className="bg-white text-tandaBlue px-4 py-2 rounded border-2 border-tandaBlue tandaBlue hover:bg-tandaBlue hover:text-white">
                    Save
                </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button onClick={addEmptyRow}
      className = "mt-4 mx-auto block bg-tandaBlue text-white px-4 py2 rounded hover:bg-tandaBlue focus: outline-none focus:border-indigo-500 focus:ring-1 focus: ring-indigo 500">
        Add
      </button>
      {/*Add in a ... button for:
      -repeat shift
      -find replacement
      -view employee profile
      -delete shift */}
      
      {isDotDotDotModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black">
            <div className="relative w-[90%] h-[90%] max-h-[90vh] max-w-[90vw] bg-white p-5 rounded-lg overflow-y-auto shadow-2xl">
                <button 
                    onClick={() => setIsDotDotDotModalOpen(false)} 
                    className="absolute top-2 right-2 text-xl font-bold">
                    &times;
                </button>
                {employeeData ? (
                  <div>
                    <h3>{employeeData.name}</h3>
                    <p>ID: {employeeData.id}</p>
                    <p>Wage: {employeeData.wage}</p>
                    {/* Add other details from the fetched data as needed */}
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
                {/* Add other content for this modal here */}
            </div>
        </div>
      )}
    </div>
  );  
}