const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const category = new Category({ name, description: description || '' });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description: description || '' },
      { new: true }
    ).lean();
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};