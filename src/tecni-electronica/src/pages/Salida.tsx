import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/Inventario.css";

/** Imagenes */
import CreateInventario from "../assets/plus-sign.png";
import Entradas from "../assets/shopping-cart.png";
import LogOut from "../assets/iniciar-sesion.png";
import Inventario from "../assets/budget.png";
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
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import moment from 'moment';

import SalidaServices from "../services/SalidaServices";
import { useForm, Controller } from "react-hook-form";
import InventarioServices from "../services/InventarioServices";

interface Column {
  id: "code" | "product" | "quantity" | "creado";
  label: string;
  minWidth?: number;
}

const columns: Column[] = [
  { id: "code", label: "Codigo", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 170 },
  { id: "quantity", label: "Cantidad", minWidth: 170 },
  { id: "creado", label: "Dia venta", minWidth: 170 },
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

const service = new SalidaServices();
const serviceInventario = new InventarioServices();

export const Salida = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [permission, setPermission] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [skip, setSkip] = useState(0);
  const [salida, setSalida] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: infoRow?.code || "",
        Producto: infoRow?.product || "",
        Cantidad: infoRow?.quantity || "",
        Fecha: infoRow?.creado || "",
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

  const handleOpenModal = (modo?: any, info?: any) => {
    if (modo === "actualizacion") {
      setModalUpdate(true);
      setModalCreacion(false);
      setModal(true);

      setValue("Code", info.code);
      setValue("Producto", info.product);
      setValue("Cantidad", info.quantity);
      setValue("Fecha", moment(info.creado).format('yyyy-MM-DD'));

      setInfoRow(info);
    } else {
      setModalCreacion(true);
      setModalUpdate(false);
      setModal(true);

      setValue("Code", "");
      setValue("Producto", "");
      setValue("Cantidad", "");
      setValue("Fecha", "");
    }
  };

  const createSalida = async (data: any) => {
    try {
      const body: any = {
        code: data.Code.toUpperCase(),
        product: data.Producto.toUpperCase(),
        quantity: data.Cantidad,
        creado: data.Fecha,
      };

      const response = await service.createSalida(body);
      console.log(response);

      setSalida([...salida, response]);
      setModal(false);

      toast.success("Se creo correctamente la venta!", {
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
      toast.error("No se creo correctamente la venta!", {
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

  const updateSalida = async (data: any) => {
    try {
      const id = infoRow._id;

      const body = {
        code: data.Code.toUpperCase(),
        product: data.Producto.toUpperCase(),
        quantity: Number(data.Cantidad),
        creado: data.Fecha,
      };

      const response = await service.updateSalida(body, id);
      setSalida([...salida, response]);
      const salidaInfo: any = await getInventarioForPageable();
      setSalida(salidaInfo);
      setModal(false);

      toast.success("Se actualizo correctamente la venta!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error: any) {
      toast.error(error, {
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

  const deleteSalida = async (data: any) => {
    try {
      const id = infoRow._id;

      const response = await service.deleteSalida(id);
      const salidaInfo: any = await getInventarioForPageable();
      setSalida(salidaInfo);
      setModal(false);

      toast.success("Se elimino correctamente la salida!", {
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
      toast.error("No se actualizo correctamente la salida!", {
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

  const SearchForSalidas = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setSalida(response);
    } else {
      const response: any = await service.getSearchForSalida(busqueda.message);
      console.log(response);

      setSalida(response.cotent);
    }
    setBusqueda({ message: "" });
  };

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setInventarioBusqueda([]);
    } else {
      const response: any = await serviceInventario.getSearchForInventario(
        consulta.message
      );
      setInventarioBusqueda(response.content);
      setConsulta({ message: "" });
    }
  };

  const handleOpenBusqueda = () => {
    setModalBusqueda(true);
  };

  const handleOnChange = (e: any) => {
    setBusqueda({
      message: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleCloseModalBusqueda = () => {
    setModalBusqueda(false);
  };

  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const configInitial = async () => {
    const inventarioInfo: any = await getInventarioForPageable();
    setSalida(inventarioInfo);

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

    let userPermission: any = localStorage.getItem("user");

    if (userPermission === "admin") {
      setPermission(true);
    } else {
      setPermission(false);
    }
  };

  const getInventarioForPageable = async (offset?: number) => {
    const data: any = await service.getSalidaPaginations(
      offset ? offset : 0,
      skip
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const onDirectEntrada = () => {
    navigate("/entrada");
  };

  const onDirectInventario = () => {
    const rol: any = localStorage.getItem("user");
    console.log(rol === "admin");
    navigate("/inventario");
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
            onClick={SearchForSalidas}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <div className="create-button" onClick={handleOpenModal}>
          <img src={CreateInventario} alt="" />
          <h2>Agregar</h2>
        </div>

        {permission && (
          <div className="inventario-button" onClick={onDirectInventario}>
            <img src={Inventario} alt="" />
            <h2>Inventario</h2>
          </div>
        )}

        {permission && (
          <div className="entrada-button" onClick={onDirectEntrada}>
            <img src={Entradas} alt="" />
            <h2>Entradas</h2>
          </div>
        )}

        <div className="entrada-button" onClick={() => handleOpenBusqueda()}>
          <img src={Consulta} alt="" />
          <h2 style={{ color: "white" }}>Consultar</h2>
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
        Registros de Ventas
      </h3>

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
            {salida
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    onClick={() => {
                      handleOpenModal("actualizacion", row);
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      
                      if (column.id == "creado") {
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
          rowsPerPageOptions={[10, 100]}
          defaultValue=""
          component="div"
          count={totalRegister}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

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
          <Box className="modal">
            <p className="titulo-modal">Crear Venta</p>
            <div style={{ margin: "0 auto" }}>
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
                    label="Codigo"
                    variant="outlined"
                    style={{
                      width: 100,
                      height: 10,
                      alignSelf: "center",
                      margin: "0px 10px 0px 0px",
                    }}
                  />
                )}
              ></Controller>

              <Controller
                name={`Cantidad`}
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...register("Cantidad")}
                    {...field}
                    {...((`Cantidad` in labelForInput &&
                      labelForInput[`Cantidad`]) ||
                      {})}
                    type="number"
                    size="small"
                    id="outlined-basic"
                    label="Cantidad"
                    variant="outlined"
                    style={{
                      width: 100,
                      height: 10,
                      alignSelf: "center",
                    }}
                  />
                )}
              ></Controller>
            </div>

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
                    alignSelf: "center",
                    margin: "0 auto",
                    position: "relative",
                    top: "1.4em",
                  }}
                />
              )}
            ></Controller>

            <Controller
              name={`Fecha`}
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField 
                    {...register('Fecha')}
                    {...field}
                    {...((`Fecha` in labelForInput &&
                          labelForInput[`Fecha`]) ||
                          {})}
                    className="date--picker-salida"
                    type="date"
                    label="Fecha Salida"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
              )}
            ></Controller>

            {modalUpdate && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(updateSalida)}
                >
                  Actualizar
                </Button>
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(deleteSalida)}
                >
                  Eliminar
                </Button>
              </div>
            )}

            {modalCreacion && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(createSalida)}
                >
                  Crear
                </Button>
              </div>
            )}
          </Box>
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
                bottom: "5em",
              }}
            >
              {/* <TableContainer sx={{ maxHeight: 440 }}> */}
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                          onClick={() => handleOpenModal("actualizacion", row)}
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
              {/* </TableContainer> */}
              {/* <TablePagination
          rowsPerPageOptions={[4, 25]}
          defaultValue=""
          component="div"
          count={totalRegister}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
            </Paper>
          </form>
        </Fade>
      </Modal>
      <ToastContainer />
    </>
  );
};
