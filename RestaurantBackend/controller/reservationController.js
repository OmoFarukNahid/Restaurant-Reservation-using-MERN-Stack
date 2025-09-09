import ErrorHandler from '../error/error.js';
import {Reservation} from '../models/reservationSchema.js';

export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, phone, date, time } = req.body;
  
  if(!firstName || !lastName || !email || !phone || !date || !time) {
    return next(new ErrorHandler('Please fill all the fields', 400));
  }

  try {
    const reservationData = {
      firstName,
      lastName,
      email,
      phone: phone.toString(),
      date: new Date(date),
      time
    };
    
    await Reservation.create(reservationData);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return next(new ErrorHandler(validationErrors.join(", "), 400));
    }
    return next(error);
  }
}