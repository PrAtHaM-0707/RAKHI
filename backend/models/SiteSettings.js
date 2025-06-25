const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  delivery_charges: { type: String, default: '50' },
  free_delivery_minimum: { type: String, default: '200' },
  contact_phone: { type: String, default: '' },
  contact_email: { type: String, default: '' },
  site_title: { type: String, default: 'RakhiMart - Premium Rakhi Collection' },
  site_description: { type: String, default: 'Celebrate Raksha Bandhan with our beautiful collection of traditional and designer rakhis' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);