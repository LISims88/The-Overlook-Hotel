const createLogin = (user, password) => {
    if (!user || !password) {
        return 'Please fill out inputs';
    }
    const usernamePattern = /^customer([1-50])$/;
    if (!usernamePattern.test(user)) {
        return 'Invalid username format';
    }
    if (password !== "overlook2021") {
        return 'Invalid password';
    }
    console.log('Successful Login');
    return { username: user, password: password };
};

const filterRoomsByDate = (rooms, bookings, date) => {
    let bookedRooms = [];
    bookings.forEach(booking => {
        if (booking.date === date) {
            bookedRooms.push(booking.roomNumber);
        }
    });
    let availableRooms = rooms.filter(room => {
        return !bookedRooms.includes(room.number);
    });
    if (availableRooms.length === 0) {
        return 'No Rooms Available';
    }
    return availableRooms;
};

const filterRoomsByType= (rooms, type) =>{
    let roomType = rooms.filter(room =>{
        return room.roomType === type
    })
    return roomType
};

module.exports = {
    createLogin,
    filterRoomsByDate,
    filterRoomsByType,
}