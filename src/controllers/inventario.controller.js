import Inventario from "../models/Inventario";

export const createInventario = async (req, res) => {
    const { code, product, stock, precio, fecha, salida } = req.body;

    try {
        const newInventario = new Inventario({
            code,
            product,
            stock: stock - salida,
            precio,
            fecha,
            salida
        });

        const inventarioSaved = await newInventario.save();
        return res.status(200).json(inventarioSaved);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const updateInventarioById = async (req, res) => {
    try {
        const findOldInventario = await Inventario.findOne({ _id: req.params.inventarioId });

        const cuadreSalida = findOldInventario.salida + findOldInventario.stock

        const updatebody = {
            code: req.body.code,
            product: req.body.product,
            stock: cuadreSalida - req.body.salida,
            precio: req.body.precio,
            fecha: req.body.fecha,
            salida: req.body.salida
        }

        console.log(updatebody);

        const updateInventario = await Inventario.findByIdAndUpdate(
            req.params.inventarioId,
            updatebody,
            {
                new: true
            }
        );
        res.status(200).json(updateInventario);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const deleteInventarioById = async (req, res) => {
    try {
        const { inventarioId } = req.params;

        const validacion = await Inventario.findById(inventarioId);
        if (!validacion) {
            res.json('No se ha encontrado el producto del inventario');
        } else {
            await Inventario.findByIdAndDelete(inventarioId);
            res.status(200).json('El producto del inventario fue eliminando correctamente!')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getInventarios = async (req, res) => {
    try {
        const inventarios = await Inventario.find();

        res.status(200).json(inventarios);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getInventarioPaginations = async (req, res) => {
    try {
        const queryLimit = Number(req.query.limit) || 20,
        querySkip = Number(req.query.skip) || 0;

        const inventarios = await Inventario.find().skip(querySkip).limit(queryLimit);
        const count = await Inventario.count();

        return res.status(200).json({
            content: inventarios,
            total: count
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export const getSearchInventario = async (req, res) => {
    try {
        const queryLimit = Number(req.query.limit) || 20,
        querySkip = Number(req.query.skip) || 0;
        const { search } = req.params;

        const inventarioSearch = await Inventario.find({
            $or: [
                { code: { $regex: '.*' + search + '.*', $options: 'i' } },
                { product: { $regex: '.*' + search + '.*', $options: 'i' } },
                { fecha: { $regex: search, $options: 'i' }}
            ]
        }).skip(querySkip).limit(queryLimit);

        let count = await Inventario.count();

        return res.status(200).json({
            content: inventarioSearch,
            total: count
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}