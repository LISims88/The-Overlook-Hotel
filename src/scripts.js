// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

//console.log('This is the JavaScript entry file - your code begins here.');
// An example of how you tell webpack to use a CSS (SCSS) file
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
//Imports
import './css/styles.scss';
import { createLogin, filterRoomsByDate, filterRoomsByType} from "./booking";
import { calculatePastBookingCosts, calculateCostPerNight, calculateFutureBookingCosts, showFutureBooking, showPastBookings } from './customer';
import {accessCustomerData,accessRoomData,accessBookingData} from "./apiCalls";
//Dom Elements
const login = document.querySelector('.login-container');
const loginForm = document.querySelector('.login-form');
const dashboard = document.querySelector('.dashboard');
const searchSelect = document.getElementById('search-select')
const results = document.querySelector('.results');
const list = document.querySelector('#room-list');
const grid = document.querySelector('.grid')
let name = document.querySelector('.name');
const back = document.querySelector('.back')
const dateInput = document.querySelector('#date')
const checkboxes = document.querySelectorAll('.room-options input[type="checkbox"]');
const costElement = document.querySelector('.cost h2')
//Global API Variables/ Variables
let customers;
let rooms;
let bookings;
let userId;
let available = [ ];
//const allBookingCosts = calculateAllBookingCosts(bookings,rooms,days,user)
const gridContent = {
    'pastBookings': `
        <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Room Number</th>
        </tr>
    `,
    'futureBookings': `
        <tr>
            <th>Booking ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Room Number</th>
        </tr>
    `,
    'roomsByDate': `
        <tr>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Bidet</th>
            <th>Bed Size</th>
            <th>Number of Beds</th>
            <th>Cost/Night</th>
        </tr>
    `,
    'roomsByType': `
        <tr>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Bidet</th>
            <th>Bed Size</th>
            <th>Number of Beds</th>
            <th>Cost/Night</th>
        </tr>
    `
};
//Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    accessCustomerData()
    .then(data =>{
        customers = data
        console.log('Customers',customers)
    })
    accessRoomData()
    .then(data =>{
        rooms = data
        console.log('rooms',rooms)
    })
    accessBookingData()
    .then(data =>{
        bookings = data
        console.log('bookings',bookings)
    })
});
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let usernameField = document.getElementById('username').value;
    const passwordField = document.getElementById('password').value;
    
    userId = getUserIdFromUsername(usernameField, customers);
    if (userId) {
        const user = usernameField; 
        createLogin(user, passwordField, userId);
        login.classList.add('hidden');
        dashboard.classList.remove('hidden');
        console.log(customers)
        welcomeUser(userId, customers);
    } else {
        console.log('User ID not found');
    }
});
searchSelect.addEventListener('change',(event) => {
    const selectedValue = event.target.value;
    if(selectedValue === 'past'){
        renderPastBookings(userId,selectedValue)
    } else if (selectedValue === 'future'){
        renderfutureBookings(userId, selectedValue)
    }
    
    
});
back.addEventListener('click', function(){
    results.classList.add('hidden');
    dashboard.classList.remove('hidden');
    costElement.textContent = "Cost: 0.00"
});
dateInput.addEventListener('change', (event) =>{
    const selectedDate= event.target.value
    renderRoomsByDate(selectedDate)
});
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', event => {
        renderRoomsByType();
    });
});
//Event Handlers
function getUserIdFromUsername(username, customers) {
    const userIdMatches = username.match(/\d+/);
    if (userIdMatches) {
        const userId = parseInt(userIdMatches[0]); 
        const user = customers.customers.find(customer => `customer${customer.id}` === username);
        if (user) {
            return userId;
        } else {
            return null;
        }
    } else {
        return null;
    }
};
function welcomeUser (userId, customers){
    const user = customers?.customers.find(customer => customer.id === userId);
    if (user) {
        console.log('Welcome, ' + user.name);
        name.innerHTML = user.name
    } else {
        console.error('User not found');
    }
};
function updateGridItems(contentType ){
    const htmlContent = gridContent[contentType] || ''
    grid.innerHTML = htmlContent
};
function renderPastBookings (userId, selectedValue){
    let days = 1 
    const cost = calculateCostPerNight(rooms.rooms, rooms.roomNumber, days)
    let pastBookings = showPastBookings(bookings.bookings, userId);
    if (!userId) {
        console.error('User ID not provided');
        return;
    }
    let user = customers?.customers.find(customer => customer.id === userId);
    
    
    const pastBookingCosts = calculatePastBookingCosts(bookings.bookings,rooms.rooms,days,userId);
    console.log('Past Bookings:', pastBookings);
    
    pastBookings.forEach(booking => {
        const tr = document.createElement('tr');
        
        const bookingIdCell = document.createElement('td');
        bookingIdCell.textContent = booking.id;
        tr.appendChild(bookingIdCell);
        
        const userIdCell = document.createElement('td');
        userIdCell.textContent = booking.userID;
        tr.appendChild(userIdCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = booking.date;
        tr.appendChild(dateCell);
        
        const roomNumberCell = document.createElement('td');
        roomNumberCell.textContent = booking.roomNumber;
        tr.appendChild(roomNumberCell);
        
        list.appendChild(tr);
    });
    
    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('pastBookings');
    updateCost(pastBookingCosts)
};
function renderfutureBookings(userId, selectedValue) {
    let days = 1;
    const cost = calculateCostPerNight(rooms.rooms, rooms.roomNumber, days);
    const futureBookingCosts = calculateFutureBookingCosts(bookings.bookings, rooms.rooms, days, userId);
    
    if (!userId) {
        console.error('User ID not provided');
        return;
    }
    
    let user = customers?.customers.find(customer => customer.id === userId);
    let futureBookings = showFutureBooking(bookings.bookings, userId);
    
    if (futureBookings.length === 0) {
        console.log('No future bookings found.');
        alert('No future bookings found.');
        return;
    }
    
    console.log('Future bookings:', futureBookings);
    
    futureBookings.forEach(booking => {
        const tr = document.createElement('tr');
        
        const bookingIdCell = document.createElement('td');
        bookingIdCell.textContent = booking.id;
        tr.appendChild(bookingIdCell);
        
        const userIdCell = document.createElement('td');
        userIdCell.textContent = booking.userID;
        tr.appendChild(userIdCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = booking.date;
        tr.appendChild(dateCell);
        
        const roomNumberCell = document.createElement('td');
        roomNumberCell.textContent = booking.roomNumber;
        tr.appendChild(roomNumberCell);
        
        list.appendChild(tr);
    });
    
    // Update the cost in the UI
    updateCost(futureBookingCosts);
    
    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('futureBookings');
};
function renderRoomsByDate(selectedDate){
    const date = new Date(selectedDate);
    const roomsByDate = filterRoomsByDate(rooms.rooms,bookings.bookings, date);
    if (roomsByDate.length === 0) {
        console.log('No rooms available for the selected date.');
        alert('No rooms available for the selected date.')
        return;
    }
    roomsByDate.forEach(room => {
        const tr = document.createElement('tr');
        
        const roomNumberCell = document.createElement('td');
        roomNumberCell.textContent = room.number;
        tr.appendChild(roomNumberCell);
        
        const roomTypeCell = document.createElement('td');
        roomTypeCell.textContent = room.roomType;
        tr.appendChild(roomTypeCell);
        
        const bidetCell = document.createElement('td');
        bidetCell.textContent = room.bidet;
        tr.appendChild(bidetCell);
               
        const bedSizeCell = document.createElement('td');
        bedSizeCell.textContent = room.bedSize;
        tr.appendChild(bedSizeCell);

        const numBedsCell = document.createElement('td');
        numBedsCell.textContent = room.numBeds;
        tr.appendChild(numBedsCell);

        const costPerNightCell = document.createElement('td');
        costPerNightCell.textContent = room.costPerNight;
        tr.appendChild(costPerNightCell);
    
        list.appendChild(tr);
    })

    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('roomsByDate'); 
};
function renderRoomsByType() {
    available.length = 0;
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const selectedType = checkbox.value;
            const roomsByType = filterRoomsByType(rooms.rooms, selectedType);
            roomsByType.forEach(room => {
                available.push(room);
            });
        }
    });

    if (available.length === 0) {
        console.log('No rooms available for the selected type(s).');
        return;
    }

    available.forEach(room => {
        const tr = document.createElement('tr');
        
        const roomNumberCell = document.createElement('td');
        roomNumberCell.textContent = room.roomNumber;
        tr.appendChild(roomNumberCell);
        
        const roomTypeCell = document.createElement('td');
        roomTypeCell.textContent = room.roomType;
        tr.appendChild(roomTypeCell);
        
        const bidetCell = document.createElement('td');
        bidetCell.textContent = room.bidet;
        tr.appendChild(bidetCell);
               
        const bedSizeCell = document.createElement('td');
        bedSizeCell.textContent = room.bedSize;
        tr.appendChild(bedSizeCell);

        const numBedsCell = document.createElement('td');
        numBedsCell.textContent = room.numBeds;
        tr.appendChild(numBedsCell);

        const costPerNightCell = document.createElement('td');
        costPerNightCell.textContent = room.costPerNight;
        tr.appendChild(costPerNightCell);
    
        list.appendChild(tr);
    });
    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('roomsByType');
    
 };
function updateCost(cost) {
    costElement.textContent = `Cost: ${cost.toFixed(2)}`
 }
function bookRooms (){
    
}