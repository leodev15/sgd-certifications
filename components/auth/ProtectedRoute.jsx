// components/auth/ProtectedRoute.jsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // No autenticado, redirigir al login
      router.push('/auth/login');
      return;
    }

    if (!loading && user && requiredRole && user.role !== requiredRole) {
      // No tiene el rol requerido, redirigir al dashboard según su rol
      switch (user.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'verificador':
          router.push('/verificador/dashboard');
          break;
        case 'postulante':
          router.push('/postulante/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
}