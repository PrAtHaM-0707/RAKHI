const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  description: { type: String, default: '' },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  stock: { type: Number, default: 0 },
  is_out_of_stock: { type: Boolean, default: false },
  specifications: [{ type: String }],
  materials: { type: String, default: '' },
  occasion: { type: String, default: '' },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);