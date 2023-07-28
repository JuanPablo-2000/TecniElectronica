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

import moment from "moment";

import Autocomplete from "@mui/material/Autocomplete";

import { useForm, Controller, SubmitHandler } from "react-hook-form";

import EntradaServices from "../services/EntradaServices";
import InventarioServices from "../services/InventarioServices";
import { ConfirmModal } from "./ConfirmModal";
import { Codigo, Producto } from "../interfaces/Selects";
import { Typography } from "@mui/material";

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
  const [pageSearch, setPageSearch] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageSearch, setRowsPerPageSearch] = useState(5);
  const [infoRow, setInfoRow] = useState<any>();
  const [modal, setModal] = useState(false);
  const [permission, setPermission] = useState(false);
  const [ShowConfirm, setShowConfirm] = useState(false);

  const [modalCreacion, setModalCreacion] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [consulta, setConsulta] = useState({ message: "" });
  const [busqueda, setBusqueda] = useState({ message: "" });
  const [labelForInput, setLabelForInput] = useState<any>({});
  const [titulo, setTitulo] = useState<any>();

  const [entrada, setEntrada] = useState<any[]>([]);
  const [inventarioBusqueda, setInventarioBusqueda] = useState<any[]>([]);

  const [skip, setSkip] = useState(0);
  const [skipSearch, setSkipSearch] = useState(0);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalRegisterSearch, setTotalRegisterSearch] = useState<number>(0);
  const [productSelect, setProductSelect] = useState<any[]>([]);
  const [codeSelect, setCodeSelect] = useState<any[]>([]);
  const [saveCodigo, setSaveCodigo] = useState<any>();
  const [valorCodigo, setValorCodigo] = useState<any>();
  const [valorCantidad, setValorCantidad] = useState<any>();
  const [valorFecha, setValorFecha] = useState<any>();
  const [saveProducto, setSaveProducto] = useState<any>();
  const [valor, setValor] = useState<any>();

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

  const handleChangePage = async (event: any, newPage: number) => {
    // validar cuando se hace el Search para retonarlo con paginacion
    const entradas = await getEntradasForPageable(newPage * rowsPerPage);
    setEntrada(entradas);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageSearch = async (event: any, newPage: number) => {
    setSkipSearch(newPage * rowsPerPageSearch);
    const data: any = await service.getSearchConsultaInventario(
      consulta.message,
      newPage * rowsPerPageSearch,
      rowsPerPageSearch
    );
    setInventarioBusqueda(data?.content);
    setPageSearch(newPage);
  };

  const handleChangeRowsPerPageSearch = async (
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

      // setValue("Producto", info.product);
      // setValue("Code", info.code);
      setValor({ name: info.product });
      setValorCodigo({ name: info.code });
      setValorCantidad(info.quantity);
      setValorFecha(moment(info.creado).format("yyyy-MM-DD"));

      setInfoRow(info);
      setTitulo("Actualizar Entrada");
    } else {
      setModalCreacion(true);
      setModalUpdate(false);
      setModal(true);

      setValor("");
      setValorCodigo("");
      setValorCantidad("");
      setValorFecha("");

      setTitulo("Crear Entrada");
    }
  };

  const handleOpenModalBusqueda = (modo?: any, info?: any) => {
    if (modo === "actualizacion") {
      setModalUpdate(true);
      setModalCreacion(false);
      setModal(true);

      // setValue("Producto", info.product);
      // setValue("Cantidad", info.stock);
      // setValue("Fecha", moment(info.creado).format("yyyy-MM-DD"));
      // setValue("Code", info.code);

      setValor({ name: info.product });
      setValorCodigo({ name: info.code });

      setInfoRow(info);
      setTitulo("Actualizar Entrada");
    }
  };

  const createEntrada = async (data: any) => {
    try {
      const body: any = {
        code: valorCodigo.name.toUpperCase(),
        product: valor.name.toUpperCase(),
        quantity: valorCantidad,
        creado: valorFecha,
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

      console.log(id);
      

      const body = {
        code: valorCodigo.name.toUpperCase(),
        product: valor.name.toUpperCase(),
        quantity: valorCantidad,
        creado: valorFecha,
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

  const deleteEntrada = async () => {
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
    setShowConfirm(false);
  };

  const SearchForEntrada = async () => {
    if (busqueda.message === "") {
      const response: any = await getEntradasForPageable();
      setEntrada(response);
    } else {
      const response: any = await service.getSearchForEntrada(busqueda.message);
      setEntrada(response.content);
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
        5
      );
      setInventarioBusqueda(response.content);
      setTotalRegisterSearch(response.total);
    }
  };

  const handleOnKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      if (busqueda.message === "") {
        const response: any = await getEntradasForPageable();
        setEntrada(response);
        setBusqueda({ message: "" });
      } else {
        const response: any = await service.getSearchForEntrada(
          busqueda.message
        );
        setEntrada(response.content);
        setBusqueda({ message: "" });
      }
    }
  };

  const handleOnKeyPressBusqueda = async (e: any) => {
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
        setInventarioBusqueda(response.content);
        setTotalRegisterSearch(response.total);
      }
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
    setShowConfirm(false);
    setValor("");
    setValorCodigo("");
  };

  const getEntradasForPageable = async (offset?: number) => {
    const data: any = await service.getEntradaPaginations(
      0,
      offset ? offset : 0
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

  const onDirectSalidas = () => {
    navigate("/salida");
  };

  const onDirectInventario = () => {
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
            placeholder="Entradas..."
            onKeyDown={handleOnKeyPress}
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
                  value={valor || ""}
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
                    fontFamily: "cursive",
                  }}
                  size="small"
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
                    {...register("Fecha")}
                    {...field}
                    {...((`Fecha` in labelForInput && labelForInput[`Fecha`]) ||
                      {})}
                    className="date--picker-salida"
                    type="date"
                    label="Fecha Entrada"
                    value={valorFecha}
                    onChange={(event: any) => {
                      setValorFecha(event.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                );
              }}
            ></Controller>

            {modalCreacion && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  onClick={createEntrada}
                >
                  Crear
                </Button>
              </div>
            )}

            {modalUpdate && (
              <div className="botones">
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  onClick={updateEntrada}
                >
                  Actualizacion
                </Button>
                <Button
                  style={{ margin: 12, background: "#0036FF" }}
                  variant="contained"
                  onClick={deleteEntrada}
                >
                  Eliminar
                </Button>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>

      {ShowConfirm && (
        <ConfirmModal
          show={true}
          message="Desea eliminar la entrada seleccionada?"
          onConfirm={deleteEntrada}
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
              onKeyUp={handleOnKeyPressBusqueda}
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
                        onClick={() =>
                          handleOpenModalBusqueda("actualizacion", row)
                        }
                      >
                        {columnsBusqueda.map((column) => {
                          const value = row[column.id];
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
                      background: "#0036FF",
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
            {entrada.map((row, index) => {
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
