import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categories: [{ type: String }],
    images: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.model('Product', ProductSchema);

export const getAllProducts = () => ProductModel.find();
export const getProductById = (id: string) => ProductModel.findById(id);
export const getProductsByCategory = (category: string) => ProductModel.find({ categories: category })
export const createProduct = (values: Record<string, any>) => new ProductModel(values).save();
export const deleteProductById = (id: string) => ProductModel.findOneAndDelete({ _id: id });
export const updateProductById = (id: string, values: Record<string, any>) => ProductModel.findByIdAndUpdate(id, values, { new: true });
export const searchProducts = (keyword: string) => ProductModel.find({ $text: { $search: keyword } });
export const productExistsByName = async (name: string) => {
    const product = await ProductModel.findOne({ name: name.trim() });
    return !!product;
};