const mongoose = require("mongoose");
const { Types } = mongoose;

// Definir el esquema para el producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: 'Sin imagen' },
    code: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
});

// Definir el campo _id como una cadena de texto en lugar de ObjectId
productSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toHexString();
        //delete ret._id;
        delete ret.__v;
    }
});

// Crear el modelo Product basado en el esquema
const collectionName = 'Products';
const productsModel = mongoose.model(collectionName, productSchema);

async function getAllProducts() {
    try {
        const products = await productsModel.find();
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}

module.exports = {
    getAllProducts
};