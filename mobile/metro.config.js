const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for image assets
config.resolver.assetExts.push('jpg', 'jpeg', 'png', 'gif', 'webp');

module.exports = config; 