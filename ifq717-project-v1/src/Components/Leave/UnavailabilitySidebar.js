import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup, FormCheck } from 'react-bootstrap';
import { DatePicker } from 'antd';
import { getCurrentUser, createUnavailability } from '../../API/Utilities';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const BASE_URL = 'https://my.tanda.co';

const UnavailabilitySidebar = ({ show, handleClose }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isAllDay, setIsAllDay] = useState(false);
  const [frequency, setFrequency] = useState('Once-off');
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatsForever, setRepeatsForever] = useState(false);
  const defaultStart = dayjs().hour(8).minute(0);
  const defaultEnd = dayjs().hour(18).minute(0);
  const [dateRange, setDateRange] = useState([defaultStart, defaultEnd]); 
  const [unavailabilityRequest, setUnavailabilityRequest] = useState({
    user_id: '',
    title: '',
    all_day: isAllDay,
    repeating: false,
    start: '',
    finish: '',
    frequency: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
        setUnavailabilityRequest((ur) => ({ ...ur, user_id: userData.id }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

    const handleFrequencyChange = (eventKey) => {
      let repeatingValue;
      switch (eventKey) {
        case 'Weekly':
          repeatingValue = true;
          break;
        case 'Daily':
          repeatingValue = true;
          break;
        case 'Once-off':
        default:
          repeatingValue = false;
          break;
      }
  
      setUnavailabilityRequest({ 
        ...unavailabilityRequest, 
        frequency: eventKey,
        repeating: repeatingValue
      });
      setFrequency(eventKey);
    };

    const handleDayToggle = (val) => setSelectedDays(val);

    const handleCreateUnavailabilityRequest = async () => {
      const formatDate = (date) => {
        return date ? date.format("YYYY-MM-DD") : null;
      };
  
      let repeatingInfo = {};
  
      if (repeatsForever && frequency === 'Weekly') {
        repeatingInfo = {
          interval: 'week', 
          occurrences: 156, 
          days_of_week: selectedDays.join(','), 
        };

      } else if (frequency === 'Weekly') {
        repeatingInfo = {
          interval: 'week',
          days_of_week: selectedDays.join(','),
          upto: formatDate(dateRange[1]),
        };

      } else if (frequency === 'Daily') {
        repeatingInfo = {
          interval: 'day',
          occurrences: calculateOccurrences(dateRange[0], dateRange[1], 'day')
        };
      }
  
      const requestData = {
        user_id: currentUser.id.toString(),
        title: unavailabilityRequest.title,
        all_day: isAllDay,
        repeating: unavailabilityRequest.repeating,
        date_from: formatDate(dateRange[0]),
        date_to: formatDate(dateRange[1]), 
        auto_approved: true,
        ...(Object.keys(repeatingInfo).length && { repeating_info: repeatingInfo })
      };

      console.log('Request Data:', requestData);

      try {
        const createdUnavailability = await createUnavailability(requestData);
        console.log('Unavailability created successfully:', createdUnavailability);
        handleClose();
      } catch (error) {
        console.error('Error creating unavailability:', error);
      }
    };
    
    const calculateOccurrences = (startDate, endDate, interval) => {
      if (!startDate || !endDate || startDate.isAfter(endDate)) return 0;
      if (interval === 'day') {
        return endDate.diff(startDate, 'days') + 1;
      } else if (interval === 'week') {
        return endDate.diff(startDate, 'weeks') + 1;
      }
      return 0;
    };
    
    

    const daysOfWeek = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];


  const handleRepeatsForeverChange = (checked) => {
    console.log("handleRepeatsForeverChange - checked:", checked);
    setRepeatsForever(checked);

    if (checked && frequency === 'Weekly') {
      const newEndDate = dayjs(dateRange[0]).add(156, 'weeks');

      setDateRange([dateRange[0], newEndDate]);
      setUnavailabilityRequest((currentRequest) => ({
        ...currentRequest,
        finish: newEndDate.format("YYYY-MM-DD")
      }));

    } else {
      const updatedEndDate = defaultEnd.format("YYYY-MM-DD");
      setDateRange([dateRange[0], defaultEnd]);
      setUnavailabilityRequest((currentRequest) => ({
        ...currentRequest,
        finish: updatedEndDate
      }));
    }
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    console.log("handleDateRangeChange - dates:", dates, "dateStrings:", dateStrings);

    if (dates) {
      const newStartDate = dates[0];
      const today = dayjs();
      const minimumNoticeDays = 4;

    if (newStartDate.isBefore(today.add(minimumNoticeDays, 'day'))) {
      alert(`Unavailability cannot be set within ${minimumNoticeDays} days of the current date.`);
      return;
    }

    let newEndDate;

    if (repeatsForever && frequency === 'Weekly') {
      newEndDate = dayjs(newStartDate).add(156, 'weeks');

    } else {
      newEndDate = dates[1] ? dates[1] : defaultEnd;
    }

    setDateRange([newStartDate, newEndDate]);
    setUnavailabilityRequest((currentRequest) => ({
      ...currentRequest,
      start: newStartDate.format("YYYY-MM-DD"),
      finish: newEndDate.format("YYYY-MM-DD")
    }));

    } else {
      setDateRange([defaultStart, defaultEnd]);
      setUnavailabilityRequest((currentRequest) => ({
        ...currentRequest,
        start: defaultStart.format("YYYY-MM-DD"),
        finish: defaultEnd.format("YYYY-MM-DD")
      }));
    }
  };

    return (
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Unavailability</Offcanvas.Title>
        </Offcanvas.Header>
            <Offcanvas.Body>
              <div>
                <img 
                  src={currentUser.photo ? (currentUser.photo.startsWith('http') ? currentUser.photo : `${BASE_URL}${currentUser.photo}`) : 'default_image_path'}
                  alt={currentUser.name || 'Default Name'} 
                  style={{ width: '100px', height: '100px' }}
                />
                <h3 className="mt-3">{currentUser.name}</h3>
              </div>
                <Form>
                <DropdownButton 
                    id="frequency-dropdown"
                    title={frequency || "Select Frequency"}
                    className="leave-custom-dropdown"
                    onSelect={handleFrequencyChange}
                >
                    <Dropdown.Item eventKey="Once-off">Once-off</Dropdown.Item>
                    <Dropdown.Item eventKey="Daily">Daily</Dropdown.Item>
                    <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
                </DropdownButton>
                    {frequency === 'Weekly' && (
                        <>
                            <ToggleButtonGroup 
                              type="checkbox"
                              value={selectedDays}
                              onChange={handleDayToggle}
                            >
                              {daysOfWeek.map((day, index) => (
                                <ToggleButton 
                                className={`daysOfWeek ${selectedDays.includes(day) ? 'daysOfWeekSelected' : 'daysOfWeekUnselected'}`}
                                  key={index}
                                  id={`tbg-btn-${index}`}
                                  value={day}
                                  >
                                  {day}
                                </ToggleButton>
                              ))}
                            </ToggleButtonGroup>
                            <Form.Group className="mt-3">
                              <Form.Label>Repeats Indefinitely?</Form.Label>
                              <FormCheck
                                type="switch"
                                checked={repeatsForever}
                                onChange={(e) => handleRepeatsForeverChange(e.target.checked)}
                              />
                            </Form.Group>
                        </>
                    )}
                    <Form.Group>
                        <Form.Label>All-day</Form.Label>
                        <FormCheck
                            type = "switch" 
                            checked={isAllDay} 
                            onChange={(e) => setIsAllDay(e.target.checked)} 
                        />
                    </Form.Group>
                    <Form.Group>
                      <RangePicker
                        showTime={!isAllDay}
                        format={isAllDay ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"}
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        disabled={[false, repeatsForever]}
                        allowClear={false}
                        placeholder={['Start Date', repeatsForever ? 'Onwards' : 'End Date']}
                      />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Reason</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            onChange={(e) => setUnavailabilityRequest({...unavailabilityRequest, title: e.target.value})}
                        />
                    </Form.Group>
                    <Button 
                      className="create-button"
                      variant="primary" 
                      onClick={handleCreateUnavailabilityRequest}
                    >
                      Create
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default UnavailabilitySidebar;
