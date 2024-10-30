const mongoose = require('mongoose');
const Service = require('../models/Service');
const ServicePackage = require('../models/ServicePackage');

// Helper function to generate available dates and times
const generateAvailableDates = () => {
  const dates = [];
  const startDate = new Date();
  // Generate dates for the next 30 days
  for (let i = 1; i <= 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    // Add multiple time slots for each date
    ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].forEach(time => {
      const [hours, minutes] = time.split(':');
      const dateWithTime = new Date(date);
      dateWithTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      dates.push(dateWithTime);
    });
  }
  return dates;
};

const services = [
  {
    name: "House Cleaning",
    description: "Professional house cleaning service with eco-friendly products",
    category: "cleaning",
    price: 80,
    duration: 180,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Masks required"
  },
  {
    name: "Basic Plumbing Service",
    description: "Professional plumbing repair and maintenance",
    category: "plumbing",
    price: 100,
    duration: 120,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Social distancing required"
  },
  {
    name: "Garden Maintenance",
    description: "Professional garden maintenance and landscaping",
    category: "gardening",
    price: 60,
    duration: 120,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Outdoor service"
  },
  // Add new electrical services
  {
    name: "Electrical Inspection",
    description: "Comprehensive electrical system inspection and safety check",
    category: "electrical",
    price: 90,
    duration: 60,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Masks required"
  },
  {
    name: "Emergency Electrical Repair",
    description: "24/7 emergency electrical repair service",
    category: "electrical",
    price: 150,
    duration: 120,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Social distancing required"
  },
  // Add more plumbing services
  {
    name: "Emergency Plumbing",
    description: "24/7 emergency plumbing repair service",
    category: "plumbing",
    price: 180,
    duration: 120,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Social distancing required"
  },
  {
    name: "Drain Cleaning",
    description: "Professional drain cleaning and maintenance",
    category: "plumbing",
    price: 120,
    duration: 90,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Social distancing required"
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await ServicePackage.deleteMany({});

    // Insert services
    const createdServices = await Service.insertMany(services);

    // Create packages using the created services
    const packages = [
      {
        name: "Home Starter Package",
        description: "Basic home maintenance package including cleaning and garden care",
        services: [
          { service: createdServices[0]._id, quantity: 1 }, // House Cleaning
          { service: createdServices[2]._id, quantity: 1 }  // Garden Maintenance
        ],
        price: 130,
        discount: 10,
        duration: 300,
        availableDates: generateAvailableDates(),
        covidRestrictions: "Masks required for indoor services"
      },
      {
        name: "Complete Home Care",
        description: "Comprehensive home maintenance package",
        services: [
          { service: createdServices[0]._id, quantity: 1 }, // House Cleaning
          { service: createdServices[1]._id, quantity: 1 }, // Basic Plumbing
          { service: createdServices[2]._id, quantity: 1 }  // Garden Maintenance
        ],
        price: 220,
        discount: 15,
        duration: 420,
        availableDates: generateAvailableDates(),
        covidRestrictions: "Masks required for indoor services"
      },
      {
        name: "Home Safety Package",
        description: "Complete home safety inspection and maintenance",
        services: [
          { service: createdServices[3]._id, quantity: 1 }, // Electrical Inspection
          { service: createdServices[1]._id, quantity: 1 }  // Basic Plumbing
        ],
        price: 170,
        discount: 12,
        duration: 180,
        availableDates: generateAvailableDates(),
        covidRestrictions: "Masks required for all services"
      }
    ];

    await ServicePackage.insertMany(packages);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase; 