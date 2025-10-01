import React from "react";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { Settings } from "lucide-react";

export const Header = () => {
  return (
    <header className="gov-header text-red-500 p-6 border-gray-300 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <img
              src="../logo.png"
              alt="Logo del Gobierno Regional"
              className="h-16"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sistema de Evaluación SGD</h1>
            <Link href={"/"} className="text-gray-600">
              Gobierno Regional de Ayacucho
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link
            href={"/login"}
            className="text-white border-red-600 bg-red-500 hover:bg-red-700 dark:hover:bg-red-950 px-4 py-2 rounded-lg flex items-center ml-4"
          >
            <Settings className="mr-2"/> Panel admin
          </Link>
        </div>
      </div>
    </header>
  );
};
