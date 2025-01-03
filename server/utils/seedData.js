const mongoose = require('mongoose');
const Service = require('../models/Service');
const ServicePackage = require('../models/ServicePackage');

// Helper function to generate available dates and times
const generateAvailableDates = () => {
  const dates = [];
  const startDate = new Date();
  // Generate dates for the next 365 days (make it a full year)
  for (let i = 1; i <= 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    // Add time slots from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute of [0, 30]) { // Add 30-minute intervals
        const dateWithTime = new Date(date);
        dateWithTime.setHours(hour, minute, 0, 0);
        dates.push(dateWithTime);
      }
    }
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
  },
  // Add new repair & maintenance services
  {
    name: "General Home Maintenance",
    description: "Regular home maintenance including minor repairs, door/window fixes, and general upkeep",
    category: "repair",
    price: 85,
    duration: 120,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Masks required for indoor services"
  },
  {
    name: "HVAC Service & Repair",
    description: "Professional heating, ventilation, and air conditioning maintenance and repair",
    category: "repair",
    price: 120,
    duration: 90,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Indoor service with proper ventilation required"
  },
  {
    name: "Appliance Repair",
    description: "Expert repair service for household appliances including washers, dryers, dishwashers, and refrigerators",
    category: "repair",
    price: 95,
    duration: 60,
    availableDates: generateAvailableDates(),
    covidRestrictions: "Social distancing and masks required"
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
      },
      // Add new package with repair services
      {
        name: "Home Repair Package",
        description: "Comprehensive home repair and maintenance package",
        services: [
          { service: createdServices[7]._id, quantity: 1 }, // General Home Maintenance
          { service: createdServices[8]._id, quantity: 1 }, // HVAC Service
          { service: createdServices[9]._id, quantity: 1 }  // Appliance Repair
        ],
        price: 250,
        discount: 15,
        duration: 270,
        availableDates: generateAvailableDates(),
        covidRestrictions: "Masks and social distancing required for all services"
      }
    ];

    await ServicePackage.insertMany(packages);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase; 