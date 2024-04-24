// let customersData;
// let roomData;
// let bookingData;

const accessCustomerData = () => {
    return fetch('http://localhost:3001/api/v1/customers')
    .then(response => response.json())
    
    .catch(error => console.error(error))
};
const accessRoomData = ()=> {
    return fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .catch(error => console.error(error))
};

const accessBookingData = () => {
    return fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
    .catch(error => console.error(error))
};

module.exports = {
    accessCustomerData,
    accessRoomData,
    accessBookingData,
    // customersData, 
    // roomData,
    // bookingData   
}