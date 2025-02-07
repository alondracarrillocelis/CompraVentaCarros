"use client";
import { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/carros"); // Ajusta la URL según tu backend
        setCars(response.data.cars);
      } catch (error) {
        console.error("Error al obtener los carros:", error);
        setError("No se pudieron cargar los datos.");
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

  const handleDelete = () => {
    console.log("Eliminar elementos:", selected);
  };

  const handleUpdate = () => {
    console.log("Actualizar elemento:", selected[0]);
  };

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

          {selected.length > 0 && (
            <>
              <IconButton color="secondary" onClick={handleDelete} sx={{ ml: 2 }}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleUpdate}
                sx={{ ml: 2 }}
                disabled={selected.length !== 1}
              >
                <EditIcon />
              </IconButton>
            </>
          )}
        </Toolbar>

        {error ? (
          <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
            {error}
          </Typography>
        ) : (
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
        )}

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
    </div>
  );
}
