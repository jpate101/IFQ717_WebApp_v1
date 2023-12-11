import { getLocations, getDevices } from '../API/Utilities.js'; 

export const getLocationDevices = async () => {
  try {
    const locations = await getLocations();
    const devices = await getDevices();

    const locationDevices = locations.map(location => {
      const locationDevices = devices.filter(device => device.location_ids.includes(location.id));
      return {
        ...location,
        devices: locationDevices,
        locationDevice: locationDevices.length > 0
      };
    });

    return locationDevices;
  } catch (error) {
    console.error('Failed to get location devices:', error);
    return [];
  }
};

export default getLocationDevices;