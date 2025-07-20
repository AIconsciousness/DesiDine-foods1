const Address = require('../models/Address');

exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { type, name, phone, address, landmark, city, state, pincode, isDefault } = req.body;
    
    // If this is the first address or user wants to set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const newAddress = new Address({
      user: req.user.id,
      type,
      name,
      phone,
      address,
      landmark,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, phone, address, landmark, city, state, pincode, isDefault } = req.body;
    
    const addressDoc = await Address.findOne({ _id: id, user: req.user.id });
    if (!addressDoc) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { type, name, phone, address, landmark, city, state, pincode, isDefault },
      { new: true }
    );

    res.json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOne({ _id: id, user: req.user.id });
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    await Address.findByIdAndDelete(id);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Unset all other addresses as default
    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    // Set the selected address as default
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 