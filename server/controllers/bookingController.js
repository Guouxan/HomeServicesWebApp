const Booking = require('../models/Booking');
const Service = require('../models/Service');
const ServicePackage = require('../models/ServicePackage');

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, packageId, dateTime, totalPrice } = req.body;
    
    const bookingData = {
      user: req.user.id,
      dateTime: new Date(dateTime),
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    };

    if (serviceId) {
      bookingData.service = serviceId;
    } else if (packageId) {
      bookingData.servicePackage = packageId;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'service',
        select: 'name price duration covidRestrictions'
      })
      .populate({
        path: 'servicePackage',
        select: 'name price duration covidRestrictions discount'
      })
      .sort({ createdAt: -1 });

    // Format the bookings data
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      serviceName: booking.service ? booking.service.name : booking.servicePackage?.name,
      dateTime: booking.dateTime,
      status: booking.status,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      covidRestrictions: booking.service ? booking.service.covidRestrictions : booking.servicePackage?.covidRestrictions
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, paymentStatus, dateTime, amount } = req.body;
    
    // If bookingId is provided, update existing booking
    if (bookingId) {
      const booking = await Booking.findOne({ 
        _id: bookingId,
        user: req.user.id
      }).populate('service servicePackage');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if the booking can be cancelled
      if (status === 'cancelled') {
        const bookingDate = new Date(booking.dateTime);
        const now = new Date();
        const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

        // For educational purposes, allow cancellation at any time
        // Remove the 24-hour restriction
        /*
        if (hoursDifference < 24) {
          return res.status(400).json({ 
            message: 'Bookings can only be cancelled at least 24 hours before the service time' 
          });
        }
        */

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
          return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Check if booking is already completed
        if (booking.status === 'completed') {
          return res.status(400).json({ message: 'Cannot cancel a completed booking' });
        }
      }

      booking.status = status;
      booking.paymentStatus = paymentStatus;
      await booking.save();

      // Format the response data
      const formattedBooking = {
        _id: booking._id,
        serviceName: booking.service ? booking.service.name : booking.servicePackage?.name,
        dateTime: booking.dateTime,
        status: booking.status,
        totalPrice: booking.totalPrice,
        paymentStatus: booking.paymentStatus,
        covidRestrictions: booking.service ? booking.service.covidRestrictions : booking.servicePackage?.covidRestrictions
      };

      return res.json({ 
        message: status === 'cancelled' ? 'Booking cancelled successfully' : 'Booking status updated successfully', 
        booking: formattedBooking
      });
    }

    // Create new booking if no bookingId provided
    if (!dateTime || !amount) {
      return res.status(400).json({ message: 'DateTime and amount are required for new bookings' });
    }

    const newBooking = new Booking({
      service: serviceId,
      user: req.user.id,
      dateTime: new Date(dateTime),
      status,
      paymentStatus,
      totalPrice: amount
    });
    await newBooking.save();
    
    res.json({ message: 'Booking created and status updated successfully', booking: newBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    .populate('service')
    .populate('servicePackage');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};