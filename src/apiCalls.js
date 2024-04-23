// let customersData;
// let roomData;
// let bookingData;

const accessCustomerData = () => {
    fetch('http://localhost:3001/api/v1/customers')
    .then(response => response.json())
    .then(data =>{
        customers = data
        console.log('Customers',customers)
    })
    .catch(error => console.error(error))
};
const accessRoomData = ()=> {
    fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
    .then(data =>{
        rooms = data
        console.log('rooms',rooms)
    })
    .catch(error => console.error(error))
};

const accessBookingData = () => {
    fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
    .then(data =>{
        bookings = data
        console.log('bookings',bookings)
    })
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