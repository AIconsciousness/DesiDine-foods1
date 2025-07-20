const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

async function addChocolate() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let restaurant = await Restaurant.findOne();
  if (!restaurant) {
    // Create a new restaurant if none exists
    restaurant = await Restaurant.create({
      name: 'Kandra Mess',
      location: {
        type: 'Point',
        coordinates: [85.9806, 23.7252], // Example coordinates
        address: 'Kandra, Jharkhand, India'
      },
      cuisines: ['Snacks', 'Sweets'],
      ratings: 4.5,
      deliveryFee: 5,
      image: ''
    });
    console.log('Demo restaurant "Kandra Mess" created!');
  }
  // Add chocolate item
  await MenuItem.create({
    restaurant: restaurant._id,
    name: 'Mini Chocolate',
    description: 'Small chocolate for kids',
    price: 5,
    image: '',
    section: 'Snacks',
  });
  // Set delivery fee to 5
  restaurant.deliveryFee = 5;
  await restaurant.save();
  console.log('Mini Chocolate added and delivery fee set to 5!');
  process.exit(0);
}
addChocolate(); 