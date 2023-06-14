import Entrada from "../models/Entrada";
import Inventario from "../models/Inventario";

export const createEntrada = async (req, res) => {
  const { code, product, quantity, creado } = req.body;

  try {
    const foundInventary = await Inventario.findOne({ code: { $regex: code, $options: 'i' } });

    const newEntrada = new Entrada({
      code,
      product,
      quantity,
      creado,
    });

    if (foundInventary) {
      const inventary = {
        code: foundInventary.code,
        product: foundInventary.product,
        stock: Number(foundInventary.stock) + Number(quantity),
        precio: foundInventary.precio
      };

      const updateFoundEntrada = await Inventario.updateOne(
        { _id: foundInventary._id },
        { $set: inventary }
      );

      const entradaSaved = await newEntrada.save();
      res.status(201).json(entradaSaved);
    } else {
        res.status(404).json('El producto no se encontro porfavor verifique el inventario');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateEntradaById = async (req, res) => {
  try {
    
    const entrada = await Entrada.findOne({ code: { $regex: req.body.code, $options: 'i' } });

    const updateEntrada = await Entrada.findByIdAndUpdate(
      req.params.entradaId,
      req.body,
      {
        new: true,
      }
    );

    if (req.body.entrada != entrada) {
      const foundInventary = await Inventario.findOne({ code: req.body.code });
    
      const inventary = {
        code: foundInventary.code,
        product: foundInventary.product,
        entrada: foundInventary.entrada,
        salida: foundInventary.salida,
        stock: foundInventary.stock + entrada.quantity,
        precio: foundInventary.precio
      };

      const updateFoundEntrada = await Inventario.updateOne(
        { _id: foundInventary._id },
        { $set: inventary }
      );
    }

    res.status(200).json(updateEntrada);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteEntradaById = async (req, res) => {
  try {
    const { entradaId } = req.params;

    const validacion = await Entrada.findById(entradaId);
    if (!validacion) {
      res.json("No se ha encontrado el producto a eliminar");
    } else {
      await Entrada.findByIdAndDelete(entradaId);
      res.status(200).json("Entrada borrada correctamente!");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getEntradas = async (req, res) => {
  try {
    const entradas = await Entrada.find();

    res.status(200).json(entradas);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getEntradaPaginations = async (req, res) => {
  try {
    const queryLimit = Number(req.query.limit) || 20,
      querySkip = Number(req.query.skip) || 0;

    const entradas = await Entrada.find().skip(querySkip).limit(queryLimit);

    let count = await Entrada.count();

    return res.status(200).json({
      content: entradas,
      total: count,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getSearchEntrada = async (req, res) => {
    try {
        const queryLimit = Number(req.query.limit) || 20,
        querySkip = Number(req.query.skip) || 0;
        const { search } = req.params;

        const entradaSearch = await Entrada.find({
            $or: [
                { code: { $regex: '.*' + search + '.*', $options: 'i' } },
                { product: { $regex: '.*' + search + '.*', $options: 'i' } },
                { creado: { $regex: search, $options: 'i'}}
            ]
        }).skip(querySkip).limit(queryLimit);

        let count = await Entrada.count();

        return res.status(200).json({
            content: entradaSearch,
            total: count
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}
