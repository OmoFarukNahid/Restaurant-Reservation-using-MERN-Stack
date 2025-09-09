import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:[ 3, 'First name must be at least 2 characters long'],
        maxLength: [ 30, 'First name must be at most 50 characters long'],

    },
    lastName: {
        type: String,
        required: true,
        minLength:[ 3, 'Last name must be at least 2 characters long'],
        maxLength: [ 30, 'Last name must be at most 50 characters long'],

    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email must be a valid email address'
        }
    },
    phone: {
        type: String,
        required: true,
        minLength:[ 11, 'Phone number must contain only 11 digits'],
        maxLength: [ 11,'Phone number must contain only 11 digits'],

    },
    time: {
        type: String,
        required: true,
        
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date();
            },
            message: 'Date must be in the future'
        } 

    }
})

export const Reservation = mongoose.model('Reservation', reservationSchema);