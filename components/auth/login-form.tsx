"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn } from "lucide-react";

export function LoginForm() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // Aquí ya tienes al usuario autenticado
      const user = data.user;
      console.log(user);

      // Redirige según rol
      /*switch (user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "verificador":
          router.push("/verificador/dashboard");
          break;
        case "postulante":
          router.push("/postulante/dashboard");
          break;
        default:
          router.push("/dashboard");
      }*/

      // 🔹 GUARDAR en sessionStorage para persistir la sesión
      sessionStorage.setItem("user", JSON.stringify(user));

      // 🔹 Usar window.location.href para forzar recarga completa
      switch (user.role) {
        case "admin":
          window.location.href = "/admin/dashboard";
          break;
        case "verificador":
          window.location.href = "/verificador/dashboard";
          break;
        case "postulante":
          window.location.href = "/postulante/dashboard";
          break;
        default:
          window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto gov-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingrese sus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ingrese su DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              maxLength={8}
              pattern="[0-9]{8}"
              required
              className="text-center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            ¿No tiene cuenta?{" "}
            <a
              href="/registro"
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Regístrese aquí
            </a>
          </p>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <p className="font-medium mb-1">Usuarios de prueba:</p>
          <p>Admin: DNI 12345678, Contraseña: admin123</p>
          <p>Postulante: DNI 87654321, Contraseña: test123</p>
          <p>Verificador: DNI 11223344, Contraseña: test123</p>
        </div>
      </CardContent>
    </Card>
  );
}
