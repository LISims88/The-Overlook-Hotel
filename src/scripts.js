// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

//console.log('This is the JavaScript entry file - your code begins here.');
// An example of how you tell webpack to use a CSS (SCSS) file
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './css/styles.scss';
import { createLogin} from "./booking"
import {accessCustomerData,accessRoomData,accessBookingData} from "./apiCalls"

const login = document.querySelector('.login-container')
const dashboard = document.querySelector('.dashboard')
const results = document.querySelector('.results')
const submit = document.querySelector('.submit')
let name = document.querySelector('.name')
const loginForm = document.querySelector('.login-form')
var customers;
var rooms;
var bookings;



document.addEventListener('DOMContentLoaded', () => {
    accessCustomerData()
    accessRoomData()
    accessBookingData()
    
})

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let usernameField = document.getElementById('username').value;
    const passwordField = document.getElementById('pass').value;
    let userId = usernameField.match(/\d+/);
    let user;
    if (userId) {
        let customer = userId[0];
        let userPrefix = usernameField.replace(customer, "")
        user = userPrefix + customer;
    } else {
        userId = ""; 
        user = ""; 
    }
    createLogin(user, passwordField,userId);
    login.classList.add('hidden')
    dashboard.classList.remove('hidden')
    welcomeUser(customers)
});


const welcomeUser = (user) =>{
    console.log(user);
    //console.log(customersData[0]); 
    //console.log(customersData.length);

    
 //customersData.customer.name = name.innerHTML
} 



