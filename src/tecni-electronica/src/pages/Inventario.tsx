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

import Autocomplete from '@mui/material/Autocomplete';
import ReactSelect from "react-select";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import InventarioServices from "../services/InventarioServices";
import moment from "moment";
import { ConfirmModal } from "./ConfirmModal";

// interfaces 
import { Producto, Codigo } from "../interfaces/Selects";

interface Column {
  id: "code" | "product" | "precio" | "fecha" | "salida" | "stock" | "nota";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: Column[] = [
  { id: "code", label: "Code", minWidth: 170 },
  { id: "product", label: "Producto", minWidth: 100 },
  { id: "precio", label: "Precio", minWidth: 170 },
  { id: "stock", label: "Stock", minWidth: 170 },
  { id: "nota", label: "Nota", minWidth: 100 },
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
  const [pageSearch, setPageSearch] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageSearch, setRowsPerPageSearch] = useState(5);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalModificar, setModalModificar] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [skip, setSkip] = useState(0);
  const [skipSearch, setSkipSearch] = useState(0);
  const [inventario, setInventario] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalRegisterSearch, setTotalRegisterSearch] = useState<number>(0);
  const [productSelect, setProductSelect] = useState<Producto[]>([]);
  const [codeSelect, setCodeSelect] = useState<any[]>([]);
  const [saveProducto, setSaveProducto] = useState<any>();
  const [valor, setValor] = useState<any>();
  const [titulo, setTitulo] = useState<any>();

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
        Nota: infoRow?.nota || "",
      },
    });

  const navigate = useNavigate();

  const handleChangePage = async (event: unknown, newPage: number) => {
    if (busqueda.message === "") {
      setSkip(newPage * rowsPerPage);
      const infoInventario: any = await service.getInventarioPagination(
        0,
        newPage * rowsPerPage
      );
      setInventario(infoInventario?.content);
      setPage(newPage);

    } else {
      // setSkip(newPage * rowsPerPage);
      const infoInventario: any = await service.getSearchForInventario(
        busqueda.message,
        newPage * rowsPerPage,
        rowsPerPage
      );
      setInventario(infoInventario.content);
      setTotalRegister(infoInventario.total);
      setPage(newPage);
      
    }
  };

  const handleChangePageSearch = async (event: unknown, newPage: number) => {
    setSkipSearch(newPage * rowsPerPageSearch);
    const data: any = await service.getSearchForInventario(
      consulta.message,
      newPage * rowsPerPageSearch,
      rowsPerPageSearch
    );
    setInventarioBusqueda(data?.content);
    setPageSearch(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);    
  };

  const handleChangeRowsPerPageSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPageSearch(+event.target.value);
    setPageSearch(0);
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
      setValue("Fecha", moment(info.fecha).format("yyyy-MM-DD"));
      setValue("Salida", info.salida);
      setValue("Nota", info.nota);

      setInfoRow(info);
      setTitulo("Actualizar Inventario");
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
      setValue("Nota", "");

      setTitulo("Crear Inventario");
    }
  };

  const handleOpenModalBusqueda = (modo?: string, info?: any) => {
    if (modo === "actualizacion") {
      setModalModificar(true);
      setModalCreacion(false);
      setModal(true);

      setValue("Producto", info.product);
      setValue("Code", info.code);
      // setValue("Stock", info.stock);
      // setValue("Precio", info.precio);
      // setValue("Fecha", moment(info.fecha).format("yyyy-MM-DD"));
      // setValue("Salida", info.salida);
      // setValue("Nota", info.nota);

      setInfoRow(info);
      setTitulo("Actualizar Inventario")
    }
  }

  const handleCloseModal = () => {
    setModal(false);
    setShowConfirm(false);
    setValor("");
  };

  const handleCloseModalBusqueda = () => {
    setModalBusqueda(false);
  };

  const createInventario = async (data: any) => {    
    try {
      let body: any = {};
      if (data.Salida > data.Stock) {
        toast.error("No se pueden hacer salidas mayores al Stock", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (data.Salida == undefined) {
          body = {
            code: data.Code.toUpperCase(),
            product: data.Producto.toUpperCase(),
            precio: data.Precio,
            stock: Number(data.Stock),
            fecha: data.Fecha,
            salida: "0",
            nota: data.Nota,
          };
        } else {
          body = {
            code: data.Code.toUpperCase(),
            product: data.Producto.toUpperCase(),
            precio: data.Precio,
            stock: Number(data.Stock),
            fecha: data.Fecha,
            salida: Number(data.Salida),
            nota: data.Nota,
          };
        }
      }

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
  };

  const updateInventario = async (data: any) => {
    try {
      const id = infoRow._id;

      let body: any = {};

      if (Number(data.Salida) > Number(data.Stock)) {
        toast.error("No se pueden hacer salidas mayores al Stock", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (data.Salida == undefined) {
          body = {
            code: data.Code.toUpperCase(),
            product: data.Producto.toUpperCase(),
            precio: data.Precio,
            stock: Number(data.Stock),
            fecha: data.Fecha,
            salida: "0",
            nota: data.Nota,
          };
        } else {
          body = {
            code: data.Code.toUpperCase(),
            product: data.Producto.toUpperCase(),
            precio: data.Precio,
            stock: Number(data.Stock),
            fecha: data.Fecha,
            salida: Number(data.Salida),
            nota: data.Nota,
          };
        }
      }

      body.especial = true;

      const response = await service.updateInventario(body, id);
      setInventario([...inventario, response]);
      const inventarioInfo: any = await getInventarioForPageable(skip);
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

  const handleConfirmModal = () => {
    setShowConfirm(true);
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
    setShowConfirm(false);
  };

  const SearchForInventario = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setInventario(response);
      setPage(0)
    } else {
      const response: any = await service.getSearchForInventario(
        busqueda.message
      );
      setInventario(response.content);
      setTotalRegister(response.total);
    }
  };
  
  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getInventarioForPageable();
        setInventario(response);
        setPage(0);
      } else {
        const response: any = await service.getSearchForInventario(
          busqueda.message
        );
        setInventario(response.content);
        setTotalRegister(response.total);
        setPage(0)
      }
    }
  };

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setInventarioBusqueda([]);
    } else {
      const response: any = await service.getSearchForInventario(
        consulta.message,
        skipSearch,
        5
      );
      setTotalRegisterSearch(response.total);
      setInventarioBusqueda(response.content);
      // setConsulta({ message: "" });
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

  const handleOnKeyPressBusqueda = async (e: any) => {
    if (e.key === "Enter") {
      if (consulta.message === "") {
        setInventarioBusqueda([]);
        setTotalRegisterSearch(0);
      } else {
        const response: any = await service.getSearchForInventario(
          consulta.message,
          skipSearch,
          5
        );
        setTotalRegisterSearch(response.total);
        setInventarioBusqueda(response.content);
      }
    }
  };


  const handleonChangeBusqueda = (e: any) => {
    setConsulta({
      message: e.target.value,
    });
  };

  const fillDataSelect = async () => {
    const infoInventario: any = await service.getAllInventario();

    const dataProduct: Producto[] = [];
    const dataCode: Codigo[] = [];

    infoInventario.map((info: any) => {
      dataProduct.push({ name: info.product });
      dataCode.push({ name: info.code });
    });

    setProductSelect(dataProduct);
    setCodeSelect(dataCode);
  }

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
      0,
      offset ? offset : 0
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
    fillDataSelect();
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="nav-bar">
        
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

      <div className="flex-title">
      <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            position: "relative",
            width: 400,
            height: 40,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Inventarios..."
            onChange={handleOnChange}
            onKeyDown={handleOnKeyPress}
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
      </div>

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
            <p className="titulo-inventario">{ titulo }</p>

            <Controller
              name={`Producto`}
              rules={{ required: false }}
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
                    bottom: ".5em"
                  }}
                  size="small"
                  id="outlined-basic"
                  label="Producto"
                  variant="outlined"
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
                      width: 100,
                      height: 10,
                      margin: "-1em 0.5em 0em 0em",
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
                      width: 90,
                      height: 10,
                      margin: "-1em 0em 0em 0em",
                    }}
                  />
                )}
              ></Controller>
            </div>

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
                  type="string"
                  size="small"
                  id="outlined-basic"
                  label="Precio"
                  variant="outlined"
                  style={{
                    width: 200,
                    height: 10,
                    margin: "1.8em 0em 2.4em 7.7em",
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
                  {...((`Salida` in labelForInput && labelForInput[`Salida`]) ||
                    {})}
                  type="number"
                  size="small"
                  id="outlined-basic"
                  label="S.T.Audio"
                  variant="outlined"
                  style={{
                    width: 200,
                    height: 10,
                    margin: "0em 0em 0em 7.7em",
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
                  {...register("Fecha")}
                  {...field}
                  {...((`Fecha` in labelForInput && labelForInput[`Fecha`]) ||
                    {})}
                  className="date--picker"
                  type="date"
                  label="Fecha Inventario"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            ></Controller>

            <Controller
              name={`Nota`}
              rules={{ required: false }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("Nota")}
                  {...field}
                  {...((`Nota` in labelForInput && labelForInput[`Nota`]) ||
                    {})}
                  label="Nota"
                  size="small"
                  variant="outlined"
                  style={{
                    width: 200,
                    height: 10,
                    margin: "3em 0em 0em 7.7em",
                  }}
                />
              )}
            />

            <div className="botones-inventario">
              {modalModificar && (
                <>
                  <Button
                    style={{ margin: 12, background: "#0036FF" }}
                    variant="contained"
                    onClick={handleSubmit(updateInventario)}
                  >
                    Actualizar
                  </Button>
                  <Button
                    style={{ background: "#0036FF" }}
                    variant="contained"
                    onClick={handleConfirmModal}
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
                  background: "#0036FF",
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

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar el inventario seleccionado ?"
          onConfirm={deleteInventario}
          onCancel={handleCloseModal}
        />
      )}

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
          <div className="modal-busqueda form-modal">
            {/* <p className="titulo-busqueda">Busqueda Inventario</p> */}
            <InputBase
              className="position-search-field"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscador"
              onChange={handleonChangeBusqueda}
              onKeyDown={handleOnKeyPressBusqueda}
              value={consulta.message}
            />
            <IconButton
              type="button"
              sx={{ p: "20px", left: 10 }}
              aria-label="search"
              className="position-search-icon"
              onClick={SearchConsultaInventario}
              onKeyDown={handleOnKeyPressBusqueda}
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
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columnsBusqueda.map((column) => (
                      <TableCell
                        key={column.id}
                        align={"center"}
                        style={{
                          minWidth: 100,
                          background: "#0036FF",
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
                  {inventarioBusqueda.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        onClick={() => handleOpenModalBusqueda("actualizacion", row)}
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
              <TablePagination
                rowsPerPageOptions={[5]}
                defaultValue=""
                component="div"
                count={totalRegisterSearch}
                rowsPerPage={rowsPerPageSearch}
                page={pageSearch}
                onPageChange={handleChangePageSearch}
                onRowsPerPageChange={handleChangeRowsPerPageSearch}
              />
            </Paper>
          </div>
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
                    background: "#0036FF",
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
            {inventario.map((row, index) => {
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
                        <TableCell key={column.id} align={"center"}
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            fontFamily: "cursive",
                          }}
                        >
                          {value}
                        </TableCell>
                      );
                    }
                    
                    if (column.id == "nota") {
                      return (
                        <TableCell
                          key={column.id}
                          align={"center"}
                          style={{
                            overflow: "auto",
                            maxHeight: "100px",
                            wordBreak: "break-all",
                            height: "80px",
                            display: "block",
                            maxWidth: "160px",
                            fontSize: 16,
                            fontWeight: "bold",
                            fontFamily: "cursive",
                          }}
                        >
                          {value}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={column.id} align={"center"}
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          fontFamily: "cursive",
                        }}
                      >
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
          rowsPerPageOptions={[10]}
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
