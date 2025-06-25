const SiteSettings = require('../models/SiteSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { delivery_charges, free_delivery_minimum, contact_phone, contact_email, site_title, site_description } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({});
    }
    settings.delivery_charges = delivery_charges || settings.delivery_charges;
    settings.free_delivery_minimum = free_delivery_minimum || settings.free_delivery_minimum;
    settings.contact_phone = contact_phone || settings.contact_phone;
    settings.contact_email = contact_email || settings.contact_email;
    settings.site_title = site_title || settings.site_title;
    settings.site_description = site_description || settings.site_description;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};