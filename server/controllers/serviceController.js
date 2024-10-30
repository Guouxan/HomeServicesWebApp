const Service = require('../models/Service');
const ServicePackage = require('../models/ServicePackage');

exports.searchServices = async (req, res) => {
  try {
    const { query, category } = req.query;
    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      searchCriteria.category = category;
    }

    const services = await Service.find(searchCriteria)
      .sort({ price: 1 })
      .limit(20);

    // Add some delay to simulate real-world API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json(services);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching services', error: error.message });
  }
};

exports.bookService = async (req, res) => {
  try {
    const { serviceId, date, time } = req.body;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const bookingDateTime = new Date(`${date}T${time}:00Z`);
    const isAvailable = service.availableDates.some(d => d.getTime() === bookingDateTime.getTime());
    
    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected date and time is not available' });
    }

    // Remove the booked date from available dates
    service.availableDates = service.availableDates.filter(d => d.getTime() !== bookingDateTime.getTime());
    await service.save();

    res.json({ 
      message: 'Service booked successfully', 
      bookingDateTime,
      covidRestrictions: service.covidRestrictions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking service', error: error.message });
  }
};

exports.getCovidRestrictions = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ covidRestrictions: service.covidRestrictions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Covid-19 restrictions', error: error.message });
  }
};

exports.getServicePackages = async (req, res) => {
  try {
    console.log('Fetching service packages...');
    const packages = await ServicePackage.find().populate('services.service');
    console.log('Found packages:', packages);
    res.json(packages);
  } catch (error) {
    console.error('Error in getServicePackages:', error);
    res.status(500).json({ message: 'Error fetching service packages', error: error.message });
  }
};

exports.bookPackage = async (req, res) => {
  try {
    const { packageId, date, time } = req.body;
    const servicePackage = await ServicePackage.findById(packageId);

    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    // Convert the input date and time to UTC
    const [hours, minutes] = time.split(':');
    const bookingDateTime = new Date(date);
    bookingDateTime.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if the date is available
    const isAvailable = servicePackage.availableDates.some(d => {
      const availableDate = new Date(d);
      return availableDate.getTime() === bookingDateTime.getTime();
    });
    
    if (!isAvailable) {
      return res.status(400).json({ 
        message: 'Selected date and time is not available',
        availableDates: servicePackage.availableDates 
      });
    }

    // Remove the booked date from available dates
    servicePackage.availableDates = servicePackage.availableDates.filter(d => 
      new Date(d).getTime() !== bookingDateTime.getTime()
    );
    await servicePackage.save();

    res.json({ 
      message: 'Service package booked successfully', 
      bookingDateTime,
      covidRestrictions: servicePackage.covidRestrictions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking service package', error: error.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

exports.getPackage = async (req, res) => {
  try {
    const servicePackage = await ServicePackage.findById(req.params.id)
      .populate('services.service');
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    // Group available dates by date and format times
    const availableSlots = servicePackage.availableDates.reduce((acc, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;

      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      if (!acc[dateStr].includes(timeStr)) {
        acc[dateStr].push(timeStr);
      }
      return acc;
    }, {});

    // Format the package data with available slots
    const formattedPackage = {
      ...servicePackage.toObject(),
      availableSlots
    };

    res.json(formattedPackage);
  } catch (error) {
    console.error('Error in getPackage:', error);
    res.status(500).json({ message: 'Error fetching service package', error: error.message });
  }
};
