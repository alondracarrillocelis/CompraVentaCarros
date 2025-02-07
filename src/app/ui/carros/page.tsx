"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  Toolbar,
  Typography,
  TablePagination,
  IconButton,
  Button,
  Modal,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

// Define the Car type
type Car = {
  id: number;
  modelo: string;
  marca: string;
  color: string;
  precio_venta: number;
  caracteristicas: string | null;
};

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Car>("marca");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newCar, setNewCar] = useState<Omit<Car, "id">>({
    modelo: "",
    marca: "",
    color: "",
    precio_venta: 0,
    caracteristicas: "",
  });
  const [editCar, setEditCar] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5555/api/carros");
        if (!response.ok) {
          throw new Error("Error al obtener los carros");
        }
        const data: Car[] = await response.json();
        setCars(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchCars();
  }, []);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(cars.map((car) => car.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((carId) => carId !== id);
    }

    setSelected(newSelected);
  };

  const handleRequestSort = (property: keyof Car) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async () => {
    try {
      for (const id of selected) {
        const response = await fetch(`http://localhost:5555/api/carros/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Error al eliminar el carro");
        }
      }
      setCars(cars.filter((car) => !selected.includes(car.id)));
      setSelected([]);
      setOpenDeleteModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (editCar) {
      try {
        const response = await fetch(`http://localhost:3000/api/carros/${editCar.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editCar),
        });
        if (!response.ok) {
          throw new Error("Error al actualizar el carro");
        }
        const updatedCar = await response.json();
        setCars(cars.map((car) => (car.id === updatedCar.id ? updatedCar : car)));
        setOpenEditModal(false);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/carros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      });
      if (!response.ok) {
        throw new Error("Error al agregar el carro");
      }
      const addedCar = await response.json();
      setCars([...cars, addedCar]);
      setOpenAddModal(false);
      setNewCar({
        modelo: "",
        marca: "",
        color: "",
        precio_venta: 0,
        caracteristicas: "",
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewCar({
      modelo: "",
      marca: "",
      color: "",
      precio_venta: 0,
      caracteristicas: "",
    });
  };
  const handleOpenEditModal = () => {
    if (selected.length === 1) {
      const carToEdit = cars.find((car) => car.id === selected[0]);
      if (carToEdit) {
        setEditCar(carToEdit);
        setOpenEditModal(true);
      }
    }
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditCar(null);
  };
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const sortedCars = [...cars].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  return (
    <div style={{ backgroundColor: "#e7e7e7", minHeight: "100vh", padding: "20px" }}>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "90%", mx: "auto", mt: 5, p: 2, borderRadius: "16px" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flex: "1 1 100%" }}>
            Lista de Carros
          </Typography>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {selected.length} seleccionados
          </Typography>

          {selected.length > 0 ? (
            <>
              <IconButton color="secondary" onClick={handleOpenDeleteModal} sx={{ ml: 2 }}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleOpenEditModal}
                sx={{ ml: 2 }}
                disabled={selected.length !== 1}
              >
                <EditIcon />
              </IconButton>
            </>
          ) : (
            <IconButton color="primary" onClick={handleOpenAddModal} sx={{ ml: 2 }}>
              <AddIcon />
            </IconButton>
          )}
        </Toolbar>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < cars.length}
                  checked={cars.length > 0 && selected.length === cars.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "marca"}
                  direction={orderBy === "marca" ? order : "asc"}
                  onClick={() => handleRequestSort("marca")}
                >
                  Marca y Modelo
                </TableSortLabel>
              </TableCell>
              <TableCell>Color</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "precio_venta"}
                  direction={orderBy === "precio_venta" ? order : "asc"}
                  onClick={() => handleRequestSort("precio_venta")}
                >
                  Precio de Venta
                </TableSortLabel>
              </TableCell>
              <TableCell>Características</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((car) => {
              const isItemSelected = isSelected(car.id);

              return (
                <TableRow
                  key={car.id}
                  selected={isItemSelected}
                  onClick={() => handleClick(car.id)}
                  hover
                  sx={{
                    backgroundColor: isItemSelected ? "#d3e3fc" : "inherit",
                    borderRadius: "8px",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{car.marca} {car.modelo}</TableCell>
                  <TableCell>{car.color}</TableCell>
                  <TableCell>${car.precio_venta.toLocaleString()}</TableCell>
                  <TableCell>{car.caracteristicas || "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={cars.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Car Modal */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Agregar Carro
          </Typography>
          <TextField
            label="Marca"
            fullWidth
            margin="normal"
            value={newCar.marca}
            onChange={(e) => setNewCar({ ...newCar, marca: e.target.value })}
          />
          <TextField
            label="Modelo"
            fullWidth
            margin="normal"
            value={newCar.modelo}
            onChange={(e) => setNewCar({ ...newCar, modelo: e.target.value })}
          />
          <TextField
            label="Color"
            fullWidth
            margin="normal"
            value={newCar.color}
            onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
          />
          <TextField
            label="Precio de Venta"
            fullWidth
            margin="normal"
            type="number"
            value={newCar.precio_venta}
            onChange={(e) => setNewCar({ ...newCar, precio_venta: Number(e.target.value) })}
          />
          <TextField
            label="Características"
            fullWidth
            margin="normal"
            value={newCar.caracteristicas}
            onChange={(e) => setNewCar({ ...newCar, caracteristicas: e.target.value })}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseAddModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleAdd}>
              Agregar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Car Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Editar Carro
          </Typography>
          <TextField
            label="Marca"
            fullWidth
            margin="normal"
            value={editCar?.marca || ""}
            onChange={(e) => setEditCar({ ...editCar!, marca: e.target.value })}
          />
          <TextField
            label="Modelo"
            fullWidth
            margin="normal"
            value={editCar?.modelo || ""}
            onChange={(e) => setEditCar({ ...editCar!, modelo: e.target.value })}
          />
          <TextField
            label="Color"
            fullWidth
            margin="normal"
            value={editCar?.color || ""}
            onChange={(e) => setEditCar({ ...editCar!, color: e.target.value })}
          />
          <TextField
            label="Precio de Venta"
            fullWidth
            margin="normal"
            type="number"
            value={editCar?.precio_venta || 0}
            onChange={(e) => setEditCar({ ...editCar!, precio_venta: Number(e.target.value) })}
          />
          <TextField
            label="Características"
            fullWidth
            margin="normal"
            value={editCar?.caracteristicas || ""}
            onChange={(e) => setEditCar({ ...editCar!, caracteristicas: e.target.value })}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseEditModal} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleUpdate}>
              Actualizar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar los carros seleccionados?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal}>Cancelar</Button>
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}