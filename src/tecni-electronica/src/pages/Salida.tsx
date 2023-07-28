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

import moment from "moment";

import Autocomplete from "@mui/material/Autocomplete";

import SalidaServices from "../services/SalidaServices";
import { useForm, Controller } from "react-hook-form";
import InventarioServices from "../services/InventarioServices";
import { ConfirmModal } from "./ConfirmModal";
import { Codigo, Producto } from "../interfaces/Selects";

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
  const [pageSearch, setPageSearch] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageSearch, setRowsPerPageSearch] = useState(5);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [permission, setPermission] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});

  const [skip, setSkip] = useState(0);
  const [skipSearch, setSkipSearch] = useState(0);
  const [salida, setSalida] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalRegisterSearch, setTotalRegisterSearch] = useState<number>(0);
  const [productSelect, setProductSelect] = useState<any[]>([]);
  const [codeSelect, setCodeSelect] = useState<any[]>([]);
  const [saveCodigo, setSaveCodigo] = useState<any>();
  const [valorCodigo, setValorCodigo] = useState<any>();
  const [saveProducto, setSaveProducto] = useState<any>();
  const [valor, setValor] = useState<any>();
  const [valorCantidad, setValorCantidad] = useState<any>();
  const [valorFecha, setValorFecha] = useState<any>();
  const [titulo, setTitulo] = useState<any>();

  const { register, control, handleSubmit, formState, getValues, setValue } =
    useForm({
      defaultValues: {
        Id: infoRow?._id || "",
        Code: valorCodigo?.name || "",
        Producto: valor?.name || "",
        Cantidad: valorCantidad?.name || "",
        Fecha: infoRow?.creado || "",
      },
    });

  const navigate = useNavigate();

  const handleChangePage = async (event: unknown, newPage: number) => {
    const salidas = await getInventarioForPageable(newPage * rowsPerPage);
    setSalida(salidas);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageSearch = async (event: unknown, newPage: number) => {
    setSkipSearch(newPage * rowsPerPageSearch);
    const data: any = await service.getSearchConsultaInventario(
      consulta.message,
      newPage * rowsPerPageSearch,
      rowsPerPageSearch
    );
    setInventarioBusqueda(data?.cotent);
    setPageSearch(newPage);
  };

  const handleChangeRowsPerPageSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPageSearch(+event.target.value);
    setPageSearch(0);
  };

  const handleOpenModal = (modo?: any, info?: any) => {
    if (modo === "actualizacion") {
      setModalUpdate(true);
      setModalCreacion(false);
      setModal(true);

      // setValue("Code", info.code);
      // setValue("Producto", info.product);
      setValor({ name: info.product });
      setValorCodigo({ name: info.code });
      setValorCantidad(info.quantity);
      setValorFecha(moment(info.creado).format("yyyy-MM-DD"));

      setInfoRow(info);
      setTitulo("Actualizar Venta");
    } else {
      if (modo === "creacionConsulta") {
        setInfoRow(null);
        setModalUpdate(false);
        setModalCreacion(true);
        setModal(true);

        // setValue("Producto", info.product);
        // setValue("Code", "");
        setValor({ name: info.product });
        setValorCodigo({ name: info.code });
        setValorCantidad("");
        setValorFecha("");
        setTitulo("Crear Venta");
      } else {
        setModalCreacion(true);
        setModalUpdate(false);
        setModal(true);

        setValor("");
        setValorCodigo("");
        setValorCantidad("");
        setValorFecha("");
        setTitulo("Crear Venta");
      }
    }
  };

  const createSalida = async (data: any) => {
    try {
      const body: any = {
        code: valorCodigo.name.toUpperCase(),
        product: valor.name.toUpperCase(),
        quantity: valorCantidad,
        creado: valorFecha,
      };

      const response = await service.createSalida(body);

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
        code: valorCodigo.name.toUpperCase(),
        product: valor.name.toUpperCase(),
        quantity: valorCantidad,
        creado: valorFecha,
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

  const deleteSalida = async () => {
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
    setShowConfirm(false);
  };

  const SearchForSalidas = async () => {
    if (busqueda.message === "") {
      const response: any = await getInventarioForPageable();
      setSalida(response);
    } else {
      const response: any = await service.getSearchForSalida(busqueda.message);

      setSalida(response.cotent);
    }
    setBusqueda({ message: "" });
  };

  const SearchConsultaInventario = async () => {
    if (consulta.message === "") {
      setInventarioBusqueda([]);
    } else {
      const response: any = await service.getSearchConsultaInventario(
        consulta.message,
        skipSearch,
        rowsPerPageSearch
      );
      setInventarioBusqueda(response.cotent);
      setTotalRegisterSearch(response.total);
    }
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getInventarioForPageable();
        setSalida(response);
        setBusqueda({ message: "" });
      } else {
        const response: any = await service.getSearchForSalida(
          busqueda.message
        );
        setSalida(response.cotent);
        setBusqueda({ message: "" });
      }
    }
  };

  const handleOnKeyPressSearch = async (e: any) => {
    if (e.key === "Enter") {
      if (consulta.message === "") {
        setInventarioBusqueda([]);
        setTotalRegisterSearch(0);
      } else {
        const response: any = await service.getSearchConsultaInventario(
          consulta.message,
          skipSearch,
          rowsPerPageSearch
        );
        setInventarioBusqueda(response.cotent);
        setTotalRegisterSearch(response.total);
      }
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
    setShowConfirm(false);
    setValor("");
    setValorCodigo("");
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
    const data: any = await service.getSalidaPaginations((offset = 0), skip);

    if (data?.total != undefined) {
      setTotalRegister(data?.total);
    }

    return data?.content || [];
  };

  const fillDataSelect = async () => {
    const infoInventario: any = await serviceInventario.getAllInventario();

    const dataProduct: Producto[] = [];
    const dataCode: Codigo[] = [];

    infoInventario.map((info: any) => {
      dataProduct.push({ name: info.product });
      dataCode.push({ name: info.code });
    });

    setProductSelect(dataProduct);
    setCodeSelect(dataCode);
  };

  const onDirectEntrada = () => {
    navigate("/entrada");
  };

  const onDirectInventario = () => {
    const rol: any = localStorage.getItem("user");
    navigate("/inventario");
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
            placeholder="Ventas..."
            onKeyDown={handleOnKeyPress}
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

        {/* <h6
          style={{
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            color: "#0036FF",
            margin: ".5em 0em 0em 0em",
          }}
        >
          Registros de Ventas
        </h6> */}
      </div>

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
            {salida.map((row, index) => {
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
                        <TableCell
                          key={column.id}
                          align={"center"}
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            fontFamily: "monospace",
                          }}
                        >
                          {moment(value).format("DD-MM-YYYY")}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={column.id}
                        align={"center"}
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          fontFamily: "monospace",
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

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar la Venta Seleccionada?"
          onConfirm={deleteSalida}
          onCancel={handleCloseModal}
        />
      )}

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
            <p className="titulo-modal">{titulo}</p>
            <div
              style={{
                margin: "0 auto",
                display: "flex",
                position: "relative",
                bottom: "1em",
              }}
            >
              <Controller
                name={`Code`}
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={codeSelect}
                    value={valorCodigo}
                    onChange={(event: any, newValue: string | "") => {
                      setValorCodigo(newValue);
                    }}
                    inputValue={saveCodigo}
                    onInputChange={(event, newInputValue) => {
                      setSaveCodigo(newInputValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option: any) =>
                      option ? option.name : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Codigos..." />
                    )}
                    style={{
                      width: 180,
                      marginRight: ".2em",
                      alignSelf: "center",
                      height: 10,
                    }}
                    size="small"
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
                    value={valorCantidad}
                    onChange={(event: any) => {
                      setValorCantidad(Number(event.target.value));
                    }}
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
                <Autocomplete
                  options={productSelect}
                  value={valor}
                  onChange={(event: any, newValue: string | "") => {
                    setValor(newValue);
                  }}
                  inputValue={saveProducto}
                  onInputChange={(event, newInputValue) => {
                    setSaveProducto(newInputValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option: any) => (option ? option.name : "")}
                  renderInput={(params) => (
                    <TextField {...params} label="Producto" />
                  )}
                  style={{
                    width: 280,
                    margin: "0 auto",
                    position: "relative",
                    top: "1.5em",
                  }}
                  size="small"
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
                  className="date--picker-salida"
                  type="date"
                  label="Fecha Salida"
                  value={valorFecha}
                  onChange={(event: any) => {
                    setValorFecha(event.target.value);
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            ></Controller>

            {modalUpdate && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  type="submit"
                  onClick={updateSalida}
                >
                  Actualizar
                </Button>
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  type="submit"
                  onClick={deleteSalida}
                >
                  Eliminar
                </Button>
              </div>
            )}

            {modalCreacion && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  type="submit"
                  onClick={createSalida}
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
          <div className="modal-busqueda form-modal">
            {/* <p className="titulo-busqueda">Busqueda Inventario</p> */}
            <InputBase
              className="position-search-field"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscador"
              onChange={handleonChangeBusqueda}
              onKeyUp={handleOnKeyPressSearch}
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
                bottom: "1em",
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
                        onClick={() => handleOpenModal("creacionConsulta", row)}
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
      <ToastContainer />
    </>
  );
};
