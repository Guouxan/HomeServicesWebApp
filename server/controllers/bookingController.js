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
        select: 'name price duration covidRestrictions services discount',
        populate: {
          path: 'services.service',
          select: 'name'
        }
      })
      .sort({ dateTime: -1 });

    console.log('Found bookings:', JSON.stringify(bookings, null, 2));

    // Format the bookings data
    const formattedBookings = bookings.map(booking => {
      console.log('Processing booking:', booking);
      
      return {
        _id: booking._id,
        serviceName: booking.service?.name || booking.servicePackage?.name || 'Unnamed Service',
        price: booking.totalPrice,
        duration: booking.service?.duration || booking.servicePackage?.duration,
        covidRestrictions: booking.service?.covidRestrictions || booking.servicePackage?.covidRestrictions,
        services: booking.servicePackage?.services.map(s => s.service.name).join(', '),
        dateTime: booking.dateTime,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        isPackage: !!booking.servicePackage,
        discount: booking.servicePackage?.discount || 0,
        createdAt: booking.createdAt
      };
    });

    console.log('Formatted bookings:', JSON.stringify(formattedBookings, null, 2));
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, serviceId, packageId, status, paymentStatus, dateTime, totalPrice } = req.body;
    
    // If updating existing booking
    if (bookingId) {
      const booking = await Booking.findOne({ 
        _id: bookingId,
        user: req.user.id
      });

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if booking is already cancelled
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      // Check if booking is already completed
      if (booking.status === 'completed') {
        return res.status(400).json({ message: 'Cannot cancel a completed booking' });
      }

      // Update booking status
      booking.status = status;
      booking.paymentStatus = paymentStatus;
      await booking.save();

      return res.json({ 
        message: status === 'cancelled' ? 'Booking cancelled successfully' : 'Booking status updated successfully', 
        booking 
      });
    }

    // If creating new booking
    if (!dateTime || !totalPrice) {
      return res.status(400).json({ message: 'DateTime and totalPrice are required for new bookings' });
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      service: serviceId || null,
      servicePackage: packageId || null,
      dateTime: new Date(dateTime),
      status,
      paymentStatus,
      totalPrice
    });

    await newBooking.save();

    // Populate the booking with service/package details
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('service')
      .populate('servicePackage');

    res.json({ 
      message: 'Booking created successfully', 
      booking: populatedBooking 
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