"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { TextField, Button, Paper, Box, Typography, Card, Fade } from "@mui/material";

// Esquema de validación con Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(5, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isClient) return null;

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setLoading(true);
        setMessage("");
        if (values.email === "uriel@gmail.com" && values.password === "pumas") {
          setMessage("Inicio de sesión exitoso ✅");
          router.push("./carros");
        } else {
          setMessage("Credenciales incorrectas ❌");
        }
        setLoading(false);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: "flex", height: "100vh" }}>
            <Paper
              elevation={6}
              sx={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 4, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Iniciar Sesión
              </Typography>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <TextField {...field} label="Email" fullWidth margin="normal" size="small" sx={{ borderRadius: 2 }} error={touched.email && !!errors.email} helperText={touched.email && errors.email} />
                )}
              </Field>
              <Field name="password">
                {({ field }: FieldProps) => (
                  <TextField {...field} label="Contraseña" type="password" fullWidth margin="normal" size="small" sx={{ borderRadius: 2 }} error={touched.password && !!errors.password} helperText={touched.password && errors.password} />
                )}
              </Field>
              <Button type="submit" variant="contained" fullWidth color="primary" disabled={loading} sx={{ marginTop: 2, borderRadius: 2, padding: "6px 16px", fontSize: "0.875rem" }}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </Paper>
            <Box sx={{ flex: 1, backgroundImage: "url(https://s0.smartresize.com/wallpaper/678/394/HD-wallpaper-cars-pursuit-road-forest.jpg)", backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
              <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
            </Box>
            <Fade in={!!message} timeout={500}>
              <Card sx={{ position: "fixed", bottom: 20, left: 20, padding: 2, backgroundColor: "rgba(50, 50, 50, 0.9)", color: "white" }}>
                <Typography>{message}</Typography>
              </Card>
            </Fade>
          </Box>
        </Form>
      )}
    </Formik>
  );
}