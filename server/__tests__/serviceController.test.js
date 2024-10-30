const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const serviceController = require('../controllers/serviceController');
const Service = require('../models/Service');

const app = express();
app.use(express.json());
app.get('/api/services/search', serviceController.searchServices);
app.post('/api/services/book', serviceController.bookService);
app.get('/api/services/:serviceId/covid-restrictions', serviceController.getCovidRestrictions);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Service Controller', () => {
  beforeEach(async () => {
    await Service.deleteMany({});
  });

  test('GET /api/services/search', async () => {
    await Service.create({
      name: 'House Cleaning',
      description: 'Professional house cleaning service',
      category: 'cleaning',
      price: 100,
      duration: 120,
      covidRestrictions: 'Wear mask'
    });

    const response = await request(app)
      .get('/api/services/search?query=cleaning&category=cleaning');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('House Cleaning');
  });

  test('POST /api/services/book', async () => {
    const bookingDate = new Date('2023-05-01T10:00:00Z');
    const service = await Service.create({
      name: 'House Cleaning',
      description: 'Professional house cleaning service',
      category: 'cleaning',
      price: 100,
      duration: 120,
      availableDates: [bookingDate],
      covidRestrictions: 'Wear mask'
    });

    const response = await request(app)
      .post('/api/services/book')
      .send({
        serviceId: service._id,
        date: '2023-05-01',
        time: '10:00'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Service booked successfully');

    // Verify that the date has been removed from availableDates
    const updatedService = await Service.findById(service._id);
    expect(updatedService.availableDates.map(d => d.toISOString())).not.toContain(bookingDate.toISOString());
  });

  test('GET /api/services/:serviceId/covid-restrictions', async () => {
    const service = await Service.create({
      name: 'House Cleaning',
      description: 'Professional house cleaning service',
      category: 'cleaning',
      price: 100,
      duration: 120,
      covidRestrictions: 'Wear mask'
    });

    const response = await request(app)
      .get(`/api/services/${service._id}/covid-restrictions`);

    expect(response.status).toBe(200);
    expect(response.body.covidRestrictions).toBe('Wear mask');
  });
});
