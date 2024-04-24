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
const postBookingData = (newBooking) => {
    return fetch('http://localhost:3001/api/v1/bookings', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Booking error! Please try again!");
        }
        return response.json();
    })
    .then(data => {
        return data.newnbookingdata;
    })
    .catch(error => {
        console.error("Error while booking:", error);
        throw error;
    });
};

export {
    accessCustomerData,
    accessRoomData,
    accessBookingData,
    postBookingData
}