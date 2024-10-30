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
      .populate('service')
      .populate('servicePackage')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, paymentStatus } = req.body;
    
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, user: req.user.id },
      { status, paymentStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
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