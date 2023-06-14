import moment from "moment";

import Salida from "../models/Salida";
import Inventario from "../models/Inventario";

export const createSalida = async (req, res) => {
  const { code, product, quantity, creado } = req.body;

  // console.log(code, product, quantity);
  
  
  try {
    const foundInventary = await Inventario.find({ code: code.toUpperCase() });
    console.log(foundInventary[0].stock - quantity);

    const inventary = {
      code: foundInventary[0].code.toUpperCase(),
      product: foundInventary[0].product.toUpperCase(),
      stock: foundInventary[0].stock - quantity,
      precio: foundInventary[0].precio,
      fecha: foundInventary[0].fecha,
      salida: foundInventary[0].salida
    };

    const newSalida = new Salida({
      code,
      product,
      quantity,
      creado,
    });

    const updateFoundInventary = await Inventario.updateOne(
      { _id: foundInventary[0]._id },
      { $set: inventary }
    );

    console.log(updateFoundInventary);

    const salidaSaved = await newSalida.save();

    res.status(201).json(salidaSaved);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const updateSalidaById = async (req, res) => {
  try {
    
    const salida = await Salida.findOne({ _id: req.params.salidaId });
    
    
    const compareSalida = {
      _id: salida._id,
      code: salida.code,
      product: salida.product,
      quantity: salida.quantity
    }
    
    const compareRequest = {
      _id: req.params.salidaId,
      code: req.body.code,
      product: req.body.product,
      quantity: req.body.quantity
    }
    
    if (JSON.stringify(compareSalida) != JSON.stringify(compareRequest)) {
      const foundInventary = await Inventario.findOne({ 
        code: { $regex: req.body.code, $options: 'i' } 
      });

      const cuadreSalida = foundInventary.stock + salida.quantity;
      
      const inventary = {
        code: foundInventary.code,
        product: foundInventary.product,
        stock: cuadreSalida - req.body.quantity,
        precio: foundInventary.precio,
        fecha: foundInventary.fecha,
        salida: foundInventary.salida
      };
      
      const updateSalida = await Salida.findByIdAndUpdate(
        req.params.salidaId,
        req.body,
        {
          new: true,
        }
      );

      const updateFoundInventary = await Inventario.updateOne(
          { _id: foundInventary._id},
          { $set: inventary }
      );
        return res.status(200).json(updateSalida);
    } else {
      return res.status(500).json('Las salidas son iguales')
    }

  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteSalidaById = async (req, res) => {
  try {
    const { salidaId } = req.params;

    const validacion = await Salida.findById(salidaId);
    if (!validacion) {
      return res.status(500).json("No se ha encontrado el producto a eliminar");
    } else {
      const response = await Salida.findByIdAndRemove({ _id: salidaId });
      console.log(response);
      return res.status(200).json("Salida borrada correctamente");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSalidas = async (req, res) => {
  try {
    const salidas = await Salida.find();

    return res.status(200).json(salidas);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getSalidasPaginations = async (req, res) => {
    try {
        const queryLimit = Number(req.query.limit) || 20,
        querySkip = Number(req.query.skip) || 0;

        const salidas = await Salida.find().skip(querySkip).limit(queryLimit);
        const count = await Salida.count();

        return res.status(200).json({
          content: salidas,
          total: count
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export const getSearchDateCurrentSalidas = async (req, res) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const salidasHoy = await Salida.find({
      createdAt: formattedDate
    });


    return res.status(200).json('dsalkfjaflj');
  } catch (error) {
    return res.status(500).send(error);
  }
}

export const getSearchSalida = async (req, res) => {
  try {
    const queryLimit = Number(req.query.limit) || 20,
    querySkip = Number(req.query.skip) || 0;
    const { search } = req.params;

    const salidaSearch = await Salida.find({
      $or: [
        { code: { $regex: '.*' + search + '.*', $options: 'i'} },
        { product: {$regex: '.*' + search + '.*', $options: 'i'} },
        { creado: {$regex: search, $options: 'i' }}
      ]
    }).skip(querySkip).limit(queryLimit);

    let count = await Salida.count();

    return res.status(200).json({
      cotent: salidaSearch,
      total: count
    });
  } catch (error) {
    return res.status(500).send(error);
  }
}