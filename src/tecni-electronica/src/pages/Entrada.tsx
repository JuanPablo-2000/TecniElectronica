import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Entrada.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Imagenes */
import CreateInventario from "../assets/plus-sign.png";
import LogOut from "../assets/iniciar-sesion.png";
import Inventario from "../assets/budget.png";
import Salidas from "../assets/sell.png";
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

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import EntradaServices from "../services/EntradaServices";
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
  { id: "creado", label: "Dia entrada", minWidth: 170 },
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

const service = new EntradaServices();
const serviceInventario = new InventarioServices();

export const Entrada = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [permission, setPermission] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [entrada, setEntrada] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);

  const [skip, setSkip] = useState(0);
  const [totalRegister, setTotalRegister] = useState<number>(0);

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: infoRow?.code || "",
        Producto: infoRow?.product || "",
        Cantidad: infoRow?.quantity || "",
        Fecha: infoRow?.creado || ""
      },
    });

  const navigate = useNavigate();

  const handleChangePage = (event: any, newPage: number) => {
    // validar cuando se hace el Search para retonarlo con paginacion
    getEntradasForPageable(newPage * rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenModal = (modo?: any, info?: any) => {
    if (modo === "actualzacion") {
      setModalUpdate(true);
      setModalCreacion(false);
      setModal(true);

      
      setValue("Producto", info.product);
      setValue("Cantidad", info.quantity);
      setValue("Fecha", moment(info.creado).format('yyyy-MM-DD'));
      setValue("Code", info.code);
      
      setInfoRow(info);
    } else {
      setModalCreacion(true);
      setModalUpdate(false);
      setModal(true);

      setValue("Producto", "");
      setValue("Cantidad", "");
      setValue("Fecha", "");
      setValue("Code", "");
    }
  };

  const createEntrada = async (data: any) => {
    try {
      const body: any = {
        code: data.Code.toUpperCase(),
        product: data.Producto.toUpperCase(),
        quantity: Number(data.Cantidad),
        creado: data.Fecha,
      };

      const response = await service.createEntrada(body);
      toast.success("Se creo correctamente la entrada", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEntrada([...entrada, response]);
      setModal(false);
    } catch (error) {
      toast.error(JSON.stringify(error), {
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

  const updateEntrada = async (data: any) => {
    try {
      const id = infoRow._id;

      const body = {
        code: data.Code.toUpperCase(),
        producto: data.Producto.toUpperCase(),
        quantity: Number(data.Cantidad),
        creado: data.Fecha
      };

      const response = await service.updateEntrada(body, id);
      setEntrada([...entrada, response]);
      const entradaInfo: any = await getEntradasForPageable();
      setEntrada(entradaInfo);
      setModal(false);

      toast.success("se actualizo correctamente la entrada!", {
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
      toast.error("No se creo actualizo la entrada!", {
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

  const deleteEntrada = async (data: any) => {
    try {
      const id = infoRow._id;

      const response = await service.deleteEntrada(id);
      const entradaInfo: any = await getEntradasForPageable();
      setEntrada(entradaInfo);
      setModal(false);

      toast.success("Se elimino correctamente la entrada!", {
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
      toast.error("No se elimino correctamente la entrada!", {
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

  const SearchForEntrada = async () => {
    console.log("entre");

    if (busqueda.message === "") {
      const response: any = await getEntradasForPageable();
      setEntrada(response);
    } else {
      const response: any = await service.getSearchForEntrada(busqueda.message);
      console.log(response);

      setEntrada(response.content);
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

  const handleOnChange = (e: any) => {
    setBusqueda({ message: e.target.value });
  };

  const handleOpenBusqueda = () => {
    setModalBusqueda(true);
  };

  const handleCloseModalBusqueda = () => {
    setModalBusqueda(false);
  };

  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const getEntradasForPageable = async (offset?: number) => {
    const data: any = await service.getEntradaPaginations(
      offset ? offset : 0,
      skip
    );

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const configInitial = async () => {
    const entradasInfo: any = await getEntradasForPageable();
    setEntrada(entradasInfo);

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

  const onDirectSalidas = () => {
    navigate("/salida");
  };

  const onDirectInventario = () => {
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
            onClick={SearchForEntrada}
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

        <div className="salida-button" onClick={onDirectSalidas}>
          <img src={Salidas} alt="" />
          <h2>Ventas</h2>
        </div>

        <div className="salida-button" onClick={() => handleOpenBusqueda()}>
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
        Registros de Entradas
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
          <Box className="modal">
            <p className="titulo-modal">Crear Entrada</p>
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
                  style={{
                    width: 200,
                    height: 10,
                    alignSelf: "center",
                    margin: "0 auto",
                    position: "relative",
                    top: "1.4em",
                  }}
                  size="small"
                  id="outlined-basic"
                  label="Producto"
                  variant="outlined"
                />
              )}
            ></Controller>

            <Controller
              name={`Fecha`}
              rules={{ required: true }}
              control={control}
              render={({ field }) => {
                return (
                  <TextField 
                    {...register('Fecha')}
                    {...field}
                    {...((`Fecha` in labelForInput &&
                          labelForInput[`Fecha`]) ||
                          {})}
                    className="date--picker-salida"
                    type="date"
                    label="Fecha Entrada"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )
              }}
            ></Controller>

            {modalCreacion && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  onClick={handleSubmit(createEntrada)}
                >
                  Crear
                </Button>
              </div>
            )}

            {modalUpdate && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  onClick={handleSubmit(updateEntrada)}
                >
                  Actualizacion
                </Button>
                <Button
                  style={{ margin: 12, background: "#22184c" }}
                  variant="contained"
                  onClick={handleSubmit(deleteEntrada)}
                >
                  Eliminar
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

      <Paper
        sx={{
          width: "80%",
          margin: "0 auto",
          position: "relative",
          top: 20,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((e) => {
                return (
                  <TableCell
                    key={e.id}
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
                    {e.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {entrada
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    onClick={() => {
                      handleOpenModal("actualzacion", row);
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
      {/* <Modal
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
            <p className="titulo-modal">Modificar Entrada</p>
            <div style={{ margin: '0 auto'}}>
            <TextField
              style={{
                width: 100,
                height: 10,
                alignSelf: "center",
                margin: "0px 10px 0px 0px",
              }}
              size="small"
              id="outlined-basic"
              label="Codigo"
              variant="outlined"
            />
            <TextField
              style={{
                width: 100,
                height: 10,
                alignSelf: "center",
                
              }}
              size="small"
              id="outlined-basic"
              label="Cantidad"
              variant="outlined"
            />
            </div>
            <TextField
              style={{
                width: 200,
                height: 10,
                alignSelf: "center",
                margin: "0 auto",
                position: 'relative',
                top: '1.4em',
              }}
              size="small"
              id="outlined-basic"
              label="Producto"
              variant="outlined"
            />
          <div className="botones">
            <Button style={{ margin: 12, background: '#22184c' }} variant="contained">Actualizar</Button>
            <Button style={{ background: '#22184c' }} variant="contained">Eliminar</Button>
          </div>
          </Box>
        </Fade>
      </Modal> */}
      {/* <div className="formulario">
        <p className="entradas-style">Entradas</p>
        <TextField
          style={{
            width: 200,
            height: 10,
            alignSelf: "center",
            margin: "15px 0 30px 0",
          }}
          size="small"
          id="outlined-basic"
          label="Codigo"
          variant="outlined"
        />
        <TextField
          style={{
            width: 200,
            height: 10,
            alignSelf: "center",
            margin: "6px 0 30px 0",
          }}
          size="small"
          id="outlined-basic"
          label="Producto"
          variant="outlined"
        />
        <TextField
          style={{
            width: 200,
            height: 10,
            alignSelf: "center",
            margin: "6px 0 30px 0",
          }}
          size="small"
          id="outlined-basic"
          label="Cantidad"
          variant="outlined"
        />
        <TextField
          style={{
            width: 200,
            height: 10,
            alignSelf: "center",
            margin: "6px 0 60px 0",
          }}
          size="small"
          id="outlined-basic"
          label="Precio"
          variant="outlined"
        />
        <Button
          size="small"
          style={{
            width: 200,
            margin: "0 auto",
            position: "relative",
            top: 30,
            backgroundColor: "#22184c",
            textTransform: "capitalize",
            fontFamily: "cursive",
            fontSize: "16px",
          }}
          variant="contained"
        >
          Ingresar
        </Button>
      </div> */}
    </>
  );
};
