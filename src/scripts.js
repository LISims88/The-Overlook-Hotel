// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

//console.log('This is the JavaScript entry file - your code begins here.');
// An example of how you tell webpack to use a CSS (SCSS) file
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
//Impr=orts
import './css/styles.scss';
import { createLogin, filterRoomsByDate, filterRoomsByType} from "./booking";
import { calculateAllBookingCosts, calculateCostPerNight, calculateFutureBookingCosts, showFutureBooking, showPastBookings } from './customer';
import {accessCustomerData,accessRoomData,accessBookingData} from "./apiCalls";


//Dom Elements
const login = document.querySelector('.login-container');
const loginForm = document.querySelector('.login-form');
const dashboard = document.querySelector('.dashboard');
const searchSelect = document.getElementById('search-select')
const roomSelect = document.getElementById('rooms-select') 
const results = document.querySelector('.results');
const list = document.querySelector('#room-list');
const grid = document.querySelector('.grid')
let name = document.querySelector('.name');
const back = document.querySelector('.back')
const dateInput = document.querySelector('#date')

//Global API variables 
let customers;
let rooms;
let bookings;
let userId
let available = [ ]
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
            <th>Cost per Night</th>
        </tr>
    `,
    'roomsByType': `
        <tr>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Bidet</th>
            <th>Bed Size</th>
            <th>Number of Beds</th>
            <th>Cost per Night</th>
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
})

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
    
    
})
back.addEventListener('click', function(){
    results.classList.add('hidden');
    dashboard.classList.remove('hidden');
})

dateInput.addEventListener('change', (event) =>{
    const selectedDate= event.target.value
    renderRoomsByDate(selectedDate)
})






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
}
function welcomeUser (userId, customers){
    const user = customers?.customers.find(customer => customer.id === userId);
    if (user) {
        console.log('Welcome, ' + user.name);
        name.innerHTML = user.name
    } else {
        console.error('User not found');
    }
}
function updateGridItems(contentType ){
    const htmlContent = gridContent[contentType] || ''
    grid.innerHTML = htmlContent
}
function renderPastBookings (userId, selectedValue){
    if (!userId) {
        console.error('User ID not provided');
        return;
    }
    let user = customers?.customers.find(customer => customer.id === userId);
    
    
    let pastBookings = showPastBookings(bookings.bookings, userId);
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
};
function renderfutureBookings(userId, selectedValue) {
    if (!userId) {
        console.error('User ID not provided');
        return;
    }
    
    let user = customers?.customers.find(customer => customer.id === userId);
    let futureBookings = showFutureBooking(bookings.bookings, userId);
    
    if (futureBookings.length === 0) {
        console.log('No future bookings found.');
        alert('No future bookings found.')
        return; // Do nothing if there are no future bookings
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
    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('futureBookings');
};

function renderRoomsByDate(selectedDate){
    available.length = 0;
    const date = new Date(selectedDate);
    const roomsByDate = filterRoomsByDate(rooms.rooms,bookings.bookings, date);
    if (roomsByDate.length === 0) {
        console.log('No rooms available for the selected date.');
        alert('No rooms available for the selected date.')
        return;
    }
    roomsByDate.forEach(room =>
        available.push(room)
    )

    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('roomsByDate');
    return available
}
 function renderRoomsByType(selectedType){
    available.length = 0
    let roomsByType = filterRoomsByType(rooms.rooms, type)
    if (roomsByType.length === 0) {
        console.log('No rooms available for the selected type.');
        alert('No rooms available for the selected type.')
        return;
    }
    roomsByType.forEach(room => {
        available.push(room)
    })
    dashboard.classList.add('hidden');
    results.classList.remove('hidden');
    updateGridItems('roomsBytype');
    return available
 }

// function showCosts (){
//     let cost = calculateCostPerNight(rooms, roomNumber, days = 1)
// }
//functions to use

// let futureBookingCosts = calculateFutureBookingCosts(bookings,rooms,days,user);
// let pastBookingCosts = calculatePastBookingCosts(bookings,rooms,days,user);
// let allBookingCosts = calculateAllBookingCosts(bookings,rooms,days,user)
// }