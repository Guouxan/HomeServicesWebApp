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
    const { serviceId, packageId, status, paymentStatus, dateTime, totalPrice } = req.body;
    
    // Find existing booking or create new one
    let booking;
    if (serviceId) {
      booking = await Booking.findOne({ 
        service: serviceId,
        user: req.user.id,
        dateTime: new Date(dateTime)
      });

      if (!booking) {
        booking = new Booking({
          service: serviceId,
          user: req.user.id,
          dateTime: new Date(dateTime),
          status,
          paymentStatus,
          totalPrice
        });
      }
    } else if (packageId) {
      booking = await Booking.findOne({ 
        servicePackage: packageId,
        user: req.user.id,
        dateTime: new Date(dateTime)
      });

      if (!booking) {
        booking = new Booking({
          servicePackage: packageId,
          user: req.user.id,
          dateTime: new Date(dateTime),
          status,
          paymentStatus,
          totalPrice
        });
      }
    } else {
      return res.status(400).json({ message: 'Either serviceId or packageId is required' });
    }

    // Update status and totalPrice if it's an existing booking
    booking.status = status;
    booking.paymentStatus = paymentStatus;
    if (totalPrice) {
      booking.totalPrice = totalPrice;
    }

    await booking.save();

    res.json({ 
      message: 'Booking status updated successfully', 
      booking 
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      message: 'Error updating booking status', 
      error: error.message 
    });
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