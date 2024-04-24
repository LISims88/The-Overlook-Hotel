import { expect } from "chai";
import { createLogin, filterRoomsByDate, filterRoomsByType } from "../src/booking";
import { users, rooms, bookings} from "./mock-data";

describe("login", () => {
    it("should create a login", () => {
        let user = 1
        const login = createLogin(`customer${user}`, "overlook2021")
        expect(login).to.deep.equal({username: `customer${user}`, password: "overlook2021"})
    });
    it("should create a different login", () => {
        let user = 2
        const login = createLogin(`customer${user}`, "overlook2021")
        expect(login).to.deep.equal({username: `customer${user}`, password: "overlook2021"})
    });
    it("should not accept an incorrect login", () => {
        const login = createLogin('lady12',"lovebug1")
        expect(login).to.equal('Invalid username format')
    });
    it("should not create a user with partial data", () => {
        const login = createLogin('customer1',"")
        expect(login).to.equal('Please fill out inputs')
    });
    it("should not accept a username that does not follow the expected format", () => {
        const login = createLogin('customer', "overlook2021");
        expect(login).to.equal('Invalid username format');
    });
    it("should not accept null or undefined inputs", () => {
        const login = createLogin(null, null);
        expect(login).to.equal('Please fill out inputs');
    });
});
describe("Booking a room", () => {
    it('should filter available rooms by date', () => {
        const availableRooms = filterRoomsByDate(rooms,bookings, "2024/4/27")

        expect(availableRooms).to.deep.equal([{
            number: 1,
            roomType: "presidential",
            bidet: true, 
            bedSize: "california king",
            numBeds: 1,
            costPerNight: 650.45
        },
        {
            number:2,
            roomType:"suite",
            bidet: false, 
            bedSize: "full",
            numBeds: 2,
            costPerNight: 378.42
        },
        {
            number:3,
            roomType:"suite",
            bidet: true, 
            bedSize: "full",
            numBeds: 2,
            costPerNight: 452.86
        }])
    })
    it("should be able to filter rooms by another date", () => {
        const availableRooms = filterRoomsByDate(rooms, bookings, "2024/9/25")
        
        expect(availableRooms).to.deep.equal([
        {
            number: 1,
            roomType: "presidential",
            bidet: true, 
            bedSize: "california king",
            numBeds: 1,
            costPerNight: 650.45
        },
        {
            number:3,
            roomType:"suite",
            bidet: true, 
            bedSize: "full",
            numBeds: 2,
            costPerNight: 452.86
        }
    ])
    });
    it("should let user know if no room available by date", () => {
        const availableRooms = filterRoomsByDate(rooms, bookings, "2024/4/25")
        expect(availableRooms).to.equal('No Rooms Available')
    });
    it("should be able to filter rooms by type", () => {
        const roomType =  "suite"
        const room = filterRoomsByType(rooms,roomType)
        expect(room).to.deep.equal([
        {
            number:2,
            roomType:"suite",
            bidet: false, 
            bedSize: "full",
            numBeds: 2,
            costPerNight: 378.42
        },
        {
            number:3,
            roomType:"suite",
            bidet: true, 
            bedSize: "full",
            numBeds: 2,
            costPerNight: 452.86
        }])
    });
});