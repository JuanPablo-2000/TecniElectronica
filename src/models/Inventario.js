import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const inventarioSchema = new mongoose.Schema(
    {
        code: { type: String },
        product: { type: String },
        stock: { type: Number },
        precio: { type: Number },
        fecha: { type: String },
        salida: { type: Number }
    },
    {
        timestamps: {
            createdAt: false,
            updatedAt: false
        },
        versionKey: false
    }
);

inventarioSchema.plugin(mongoosePaginate);

export default mongoose.model('inventario', inventarioSchema);