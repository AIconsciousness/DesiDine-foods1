const Offer = require('../models/Offer');

exports.addOffer = async (req, res) => {
  try {
    const { code, type, value, expiry } = req.body;
    const offer = new Offer({ code, type, value, expiry });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateOffer = async (req, res) => {
  try {
    const { code } = req.body;
    const offer = await Offer.findOne({ code });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (new Date() > offer.expiry) return res.status(400).json({ message: 'Offer expired' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 