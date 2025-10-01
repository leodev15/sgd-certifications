"use client";

import type React from "react";

import { useState } from "react";
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
import { Search, FileCheck, AlertCircle } from "lucide-react";
import type { Certificate, User } from "@/lib/mock-data";

interface CertificateSearchProps {
  onCertificateFound: (certificate: Certificate, user: User) => void;
}

export function CertificateSearch({
  onCertificateFound,
}: CertificateSearchProps) {
  const [searchType, setSearchType] = useState<"codigo" | "dni">("dni");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSearching(true);

    try {
      let certificate: Certificate | null = null;
      let user: User | null = null;

      // 🔹 Consulta al backend según el tipo de búsqueda
      const response = await fetch(
        `/api/verificar?${searchType}=${encodeURIComponent(searchValue.trim())}`
      );

      console.log("Respuesta", response);

      if (!response.ok) {
        setError(
          searchType === "codigo"
            ? "No se encontró ningún certificado con ese código"
            : "No se encontró ningún certificado para ese DNI"
        );
        return;
      }

      certificate = await response.json();

      if (certificate) {
        // 🔹 Luego puedes pedir el usuario según certificate.userId
        /*const users = await getUsers(); // <- si esto también viene del backend, conviértelo en fetch
        user = users.find((u) => u.id === certificate.userId) || null;*/

        //const usersResponse = await fetch("/api/users");
        const usersResponse = await fetch("/api/users");

        console.log("Respuesta", usersResponse);
        if (!usersResponse.ok) {
          setError("Error al obtener usuarios");
          return;
        }

        const users: User[] = await usersResponse.json();
        console.log("👥 Usuarios obtenidos:", users);
        console.log("👥 Certificados obtenidos:", certificate);

        // 🔹 Buscar el usuario que corresponde al certificado
        user = users.find((u) => u.id === certificate.user_id) || null;

        if (user) {
          console.log(onCertificateFound(certificate, user));
          onCertificateFound(certificate, user);
        } else {
          setError("Certificado encontrado pero usuario no disponible");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar el certificado. Intente nuevamente.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto gov-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <FileCheck className="h-5 w-5 text-red-600" />
          <span>Verificar Certificado</span>
        </CardTitle>
        <CardDescription>
          Ingrese el código del certificado o DNI del titular
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Type Selection */}
          <div className="space-y-3">
            <Label>Tipo de búsqueda</Label>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="dni"
                  checked={searchType === "dni"}
                  onChange={(e) =>
                    setSearchType(e.target.value as "codigo" | "dni")
                  }
                  className="text-red-600"
                />
                <span className="text-sm">Por DNI</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="codigo"
                  checked={searchType === "codigo"}
                  onChange={(e) =>
                    setSearchType(e.target.value as "codigo" | "dni")
                  }
                  className="text-red-600"
                />
                <span className="text-sm">Por Código</span>
              </label>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="searchValue">
              {searchType === "codigo"
                ? "Código del Certificado"
                : "DNI del Titular"}
            </Label>
            <Input
              id="searchValue"
              type="text"
              placeholder={
                searchType === "codigo" ? "Ej: SGD-2024-001" : "Ej: 12345678"
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              maxLength={searchType === "codigo" ? 20 : 8}
              pattern={searchType === "codigo" ? undefined : "[0-9]{8}"}
              required
              className="text-center font-mono"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Verificando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verificar Certificado
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <p className="font-medium mb-1">Ejemplos de búsqueda:</p>
          <p>• Código: SGD-2024-001</p>
          <p>• DNI: 87654321</p>
        </div>
      </CardContent>
    </Card>
  );
}
