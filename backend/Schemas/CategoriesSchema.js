const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const CategoriesModel = mongoose.model('Categories', CategoriesSchema);
const initialCategories = [
    'World',
    'Politics',
    'Business',
    'Technology',
    'Sports',
    'Entertainment',
    'Health',
    'Science',
    'Other'
];

async function insertCategories() {
    for (const categoryName of initialCategories) {
        const categoryExists = await CategoriesModel.findOne({ name: categoryName });
        if (!categoryExists) {
            const newCategory = new CategoriesModel({ name: categoryName });
            await newCategory.save();
        }
    }
}
insertCategories().catch(err => console.error('Error while inserting initial categories:', err));

module.exports = CategoriesModel;