const express = require('express');
const cities = require('./cities');
const path = require('path');
const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '60af62dbe772f01a4f633397',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus officiis nulla ratione omnis architecto corporis! Dolorem cupiditate accusantium neque minus, totam quae assumenda adipisci aperiam magnam quos, a molestiae laudantium?',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/do9xvtyeg/image/upload/v1622470942/YelpCamp/z1y5cmocmd1qmujp8if0.jpg',
          filename: 'YelpCamp/z1y5cmocmd1qmujp8if0',
        },
        {
          url: 'https://res.cloudinary.com/do9xvtyeg/image/upload/v1622470942/YelpCamp/b9hnzgodkyzbeofbiuiz.jpg',
          filename: 'YelpCamp/b9hnzgodkyzbeofbiuiz',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
