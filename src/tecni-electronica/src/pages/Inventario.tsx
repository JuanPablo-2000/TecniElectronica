import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import "../styles/Inventario.css";

/** Imagenes */
import CreateInventario from "../assets/plus-sign.png";
import LogOut from "../assets/iniciar-sesion.png";
import Salidas from "../assets/shopping-cart.png";
import Entradas from "../assets/sell.png";
import Consulta from "../assets/exam.png";

/** Material React UI */
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import InventarioServices from "../services/InventarioServices";
import moment from "moment";

interface Column {
  id: "code" | "product" | "precio" | "fecha" | "salida" | "stock";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 100 },
  { id: "precio", label: "Precio", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
  { id: "salida", label: "S. Tienda Audio", minWidth: 170 },
  { id: "fecha", label: "Creado En", minWidth: 170 },
];

interface ColumnBusqueda {
  id: "code" | "product" | "precio" | "stock";
  label: string;
  minWidth?: number;
}

const columnsBusqueda: ColumnBusqueda[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 170 },
  { id: "precio", label: "Precio", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
];

const service = new InventarioServices();

export const Inventario = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [data, setData] = useState(null);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalModificar, setModalModificar] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [skip, setSkip] = useState(0);
  const [inventario, setInventario] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);

  const { register, control, handleSubmit, formState, getValues, setValue } =
    
  useForm({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: infoRow?.code || "",
        Producto: infoRow?.product || "",
        Stock: infoRow?.stock || "",
        Precio: infoRow?.precio || "",
        Fecha: infoRow?.fecha || "",
        Salida: infoRow?.salida || "",
      },
    });

  const navigate = useNavigate();

  const handleChangePage = (event: unknown, newPage: number) => {
    getInventarioForPageable(newPage * rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (modo?: string, info?: any) => {
    if (modo === "actualizacion") {
      setModalModificar(true);
      setModalCreacion(false);
      setModal(true);

      setValue("Producto", info.product);
      setValue("Code", info.code);
      setValue("Stock", info.stock);
      setValue("Precio", info.precio);
      setValue("Fecha", moment(info.fecha).format('yyyy-MM-DD'));
      setValue("Salida", info.salida);

      setInfoRow(info);      
    } else {
      setInfoRow(null);
      setModalModificar(false);
      setModalCreacion(true);
      setModal(true);

      setValue("Producto", "");
      setValue("Code", "");
      setValue("Stock", "");
      setValue("Precio", "");
      setValue("Fecha", "");
      setValue("Salida", "");
    }
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleCloseModalBusqueda = () => {
    setModalBusqueda(false);
  };

  const createInventario = async (data: any) => {
    try {
      const body: any = {
        code: data.Code.toUpperCase(),
        product: data.Producto.toUpperCase(),
        stock: data.Stock,
        precio: data.Precio,
        fecha: data.Fecha,
        salida: data.Salida,
      };

      const response = await service.createInventario(body);
      setInventario([...inventario, response]);
      setModal(false);

      toast.success("Se creo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se creo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    // console.log(data);
  };

  const updateInventario = async (data: any) => {
    try {
      const id = infoRow._id;

      const body = {
        code: data.Code.toUpperCase(),
        product: data.Producto.toUpperCase(),
        precio: data.Precio,
        stock: data.Stock,
        fecha: data.Fecha,
        salida: data.Salida,
      };

      const response = await service.updateInventario(body, id);
      setInventario([...inventario, response]);
      const inventarioInfo: any = await getInventarioForPageable();
      setInventario(inventarioInfo);
      setModal(false);

      toast.success("Se actualizo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se actualizo correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const deleteInventario = async () => {
    try {
      const id = infoRow._id;

      const response = await service.deleteInventario(id);
      const inventarioInfo: any = await getInventarioForPageable();
      setInventario(inventarioInfo);
      setModal(false);

      toast.success("Se elimino correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("No se elimino correctamente el inventario!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const SearchForInventario = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setInventario(response);
    } else {
      const response: any = await service.getSearchForInventario(
        busqueda.message
      );
      setInventario(response.content);
    }
    setBusqueda({ message: "" });
  };

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setInventarioBusqueda([]);
    } else {
      const response: any = await service.getSearchForInventario(
        consulta.message
      );
      setInventarioBusqueda(response.content);
      setConsulta({ message: "" });
    }
  };

  const handelOpenBusqueda = () => {
    setModalBusqueda(true);
  };

  const handleOnChange = (e: any) => {
    setBusqueda({
      message: e.target.value,
    });
  };

  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const configInitial = async () => {
    const inventarioInfo: any = await getInventarioForPageable();
    setInventario(inventarioInfo);

    let info: any = {};

    Object.keys(getValues())?.map((field) => {
      info[field] = {
        id: "outlined-basic",
        error: false,
        variant: "outlined",
        size: "small",
      };
    });
    setLabelForInput(info);
  };

  const getInventarioForPageable = async (offset?: number) => {
    const data: any = await service.getInventarioPagination(
      offset ? offset : 0,
      skip
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const onDirectEntrada: any = () => {
    navigate("/entrada");
  };

  const onDirectSalida: any = () => {
    navigate("/salida");
  };

  useEffect(() => {
    configInitial();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="nav-bar">
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            position: "relative",
            width: 200,
            height: 40,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscador"
            onChange={handleOnChange}
            value={busqueda.message}
          />
          <IconButton
            type="button"
            sx={{ p: "20px", left: 10 }}
            aria-label="search"
            onClick={SearchForInventario}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <div className="create-button" onClick={() => handleOpenModal()}>
          <img src={CreateInventario} alt="" />
          <h2>Agregar</h2>
        </div>

        {Permissions && (
          <div className="entrada-button" onClick={onDirectEntrada}>
            <img src={Salidas} alt="" />
            <h2>Entradas</h2>
          </div>
        )}

        <div className="salida-button" onClick={onDirectSalida}>
          <img src={Entradas} alt="" />
          <h2>Ventas</h2>
        </div>

        <div className="entrada-button" onClick={() => handelOpenBusqueda()}>
          <img src={Consulta} alt="" />
          <h2>Consultar</h2>
        </div>

        <div className="log-out" onClick={logOut}>
          <h2>Log Out</h2>
          <img src={LogOut} alt="Log Out" />
        </div>
      </nav>

      <h3
        style={{
          fontSize: 40,
          display: "flex",
          justifyContent: "center",
          color: "#22184c",
          margin: "1em 0em 0em 0em",
        }}
      >
        Registros de Inventario
      </h3>

      <Modal
        open={modal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={modal}>
          <form className="modal-inventario">
            <p className="titulo-inventario">Crear Inventario</p>

            <Controller
              name={`Producto`}
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("Producto")}
                  {...field}
                  {...((`Producto` in labelForInput &&
                    labelForInput[`Producto`]) ||
                    {})}
                  size="small"
                  id="outlined-basic"
                  label="Producto"
                  variant="outlined"
                  style={{
                    width: 200,
                    height: 10,
                    margin: "0 auto",
                    position: "relative",
                    bottom: ".5em",
                  }}
                />
              )}
            ></Controller>

            <Controller
              name={`Precio`}
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("Precio")}
                  {...field}
                  {...((`Precio` in labelForInput && labelForInput[`Precio`]) ||
                    {})}
                  type="number"
                  size="small"
                  id="outlined-basic"
                  label="Precio"
                  variant="outlined"
                  style={{
                    width: 200,
                    height: 10,
                    margin: "1.8em .5em 3.4em 5.6em",
                  }}
                />
              )}
            ></Controller>

            <div className="doble-textfield">
              <Controller
                name={`Code`}
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...register("Code")}
                    {...field}
                    {...((`Code` in labelForInput && labelForInput[`Code`]) ||
                      {})}
                    size="small"
                    id="outlined-basic"
                    label="Code"
                    variant="outlined"
                    style={{
                      width: 80,
                      height: 10,
                      margin: "-1em .5em 0em 0em",
                    }}
                  />
                )}
              ></Controller>

              <Controller
                name={`Stock`}
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...register("Stock")}
                    {...field}
                    {...((`Stock` in labelForInput && labelForInput[`Stock`]) ||
                      {})}
                    type="number"
                    size="small"
                    id="outlined-basic"
                    label="Stock"
                    variant="outlined"
                    style={{
                      width: 80,
                      height: 10,
                      margin: "-1em .5em 0em 0em",
                    }}
                  />
                )}
              ></Controller>

              <Controller
                name={`Salida`}
                rules={{ required: false }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...register("Salida")}
                    {...field}
                    {...((`Salida` in labelForInput &&
                      labelForInput[`Salida`]) ||
                      {})}
                    type="number"
                    size="small"
                    id="outlined-basic"
                    label="S.T.Audio"
                    variant="outlined"
                    style={{
                      width: 80,
                      height: 10,
                      margin: "-1em .5em 0em 0em",
                    }}
                  />
                )}
              ></Controller>
            </div>
            <Controller
              name={`Fecha`}
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField 
                  {...register('Fecha')}
                  {...field}
                  {...((`Fecha` in labelForInput && 
                  labelForInput[`Fecha`]) || {})}
                  className="date--picker"
                  type="date"
                  label="Fecha Inventario"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            ></Controller>

            <div className="botones">
              {modalModificar && (
                <>
                  <Button
                    style={{ margin: 12, background: "#22184c" }}
                    variant="contained"
                    onClick={handleSubmit(updateInventario)}
                  >
                    Actualizar
                  </Button>
                  <Button
                    style={{ background: "#22184c" }}
                    variant="contained"
                    onClick={handleSubmit(deleteInventario)}
                  >
                    Eliminar
                  </Button>
                </>
              )}
            </div>

            {modalCreacion && (
              <Button
                style={{
                  margin: "0 auto",
                  background: "#22184c",
                  position: "relative",
                  color: "#ffffff",
                  top: "4em",
                }}
                type="submit"
                onClick={handleSubmit(createInventario)}
              >
                Crear
              </Button>
            )}
          </form>
        </Fade>
      </Modal>

      <Modal
        open={modalBusqueda}
        onClose={handleCloseModalBusqueda}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },  
        }}
      >
        <Fade in={modalBusqueda}>
          <form className="modal-busqueda">
            {/* <p className="titulo-busqueda">Busqueda Inventario</p> */}
            <InputBase
              className="position-search-field"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscador"
              onChange={handleonChangeBusqueda}
              value={consulta.message}
            />
            <IconButton
              type="button"
              sx={{ p: "20px", left: 10 }}
              aria-label="search"
              className="position-search-icon"
              onClick={SearchConsultaInventario}
            >
              <SearchIcon />
            </IconButton>

            <Paper
              sx={{
                width: "80%",
                margin: "0 auto",
                position: "relative",
                bottom: "2em",
              }}
            >
              {inventarioBusqueda.length != 0 && (
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnsBusqueda.map((column) => (
                        <TableCell
                          key={column.id}
                          align={"center"}
                          style={{
                            minWidth: 100,
                            background: "#22184c",
                            color: "#fff",
                            margin: "0 auto",
                            fontSize: 20,
                            fontWeight: "600",
                            fontFamily: "cursive",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventarioBusqueda
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row._id}
                            onClick={() =>
                              handleOpenModal("actualizacion", row)
                            }
                          >
                            {columnsBusqueda.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={"center"}>
                                  {typeof value === "number" ? value : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </form>
        </Fade>
      </Modal>

      <Paper
        sx={{
          width: "80%",
          margin: "0 auto",
          position: "relative",
          top: 20,
        }}
      >
        {/* <TableContainer sx={{ maxHeight: 440 }}> */}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={"center"}
                  style={{
                    minWidth: 100,
                    background: "#22184c",
                    color: "#fff",
                    margin: "0 auto",
                    fontSize: 20,
                    fontWeight: "600",
                    fontFamily: "cursive",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {inventario
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    onClick={() => handleOpenModal("actualizacion", row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      
                      if (column.id == "fecha") {
                        return (
                          <TableCell key={column.id} align={"center"}>
                            {moment(value).format("DD-MM-YYYY")}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.id} align={"center"}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {/* </TableContainer> */}
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          defaultValue=""
          component="div"
          count={totalRegister}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ToastContainer />
    </>
  );
};
