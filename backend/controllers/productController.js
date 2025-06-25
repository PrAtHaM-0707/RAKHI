const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category } = req.query;
    const query = category && category !== 'All' ? { category_id: category } : {};
    const products = await Product.find(query)
      .populate('category_id', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const count = await Product.countDocuments(query);
    res.json({
      products: products.map(p => ({
        ...p,
        categories: { name: p.category_id?.name || '' },
        category_id: p.category_id?._id.toString(),
      })),
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category_id, stock, is_out_of_stock, specifications, materials, occasion } = req.body;
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
        images.push(result.secure_url);
      }
    }
    if (images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }
    const product = new Product({
      name,
      price,
      images,
      description: description || '',
      category_id,
      stock: stock || 0,
      is_out_of_stock: is_out_of_stock === 'true',
      specifications: specifications ? JSON.parse(specifications) : [],
      materials: materials || '',
      occasion: occasion || '',
      rating: 0,
    });
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate('category_id', 'name').lean();
    res.status(201).json({
      ...populatedProduct,
      categories: { name: populatedProduct.category_id?.name || '' },
      category_id: populatedProduct.category_id?._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category_id, stock, is_out_of_stock, specifications, materials, occasion } = req.body;
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let images = product.images;
    if (req.files && req.files.length > 0) {
      images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
        images.push(result.secure_url);
      }
    }
    product.name = name;
    product.price = price;
    product.images = images;
    product.description = description || '';
    product.category_id = category_id;
    product.stock = stock || 0;
    product.is_out_of_stock = is_out_of_stock === 'true';
    product.specifications = specifications ? JSON.parse(specifications) : [];
    product.materials = materials || '';
    product.occasion = occasion || '';
    await product.save();
    const populatedProduct = await Product.findById(id).populate('category_id', 'name').lean();
    res.json({
      ...populatedProduct,
      categories: { name: populatedProduct.category_id?.name || '' },
      category_id: populatedProduct.category_id?._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleStock = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.is_out_of_stock = !product.is_out_of_stock;
    await product.save();
    const populatedProduct = await Product.findById(id).populate('category_id', 'name').lean();
    res.json({
      ...populatedProduct,
      categories: { name: populatedProduct.category_id?.name || '' },
      category_id: populatedProduct.category_id?._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};