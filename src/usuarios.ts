import { UserRole } from './types';

export interface SimulatedUser {
  ruc: string;
  usuarioSol: string;
  contrasenaSol: string;
  role: UserRole;
  fullName: string;
}

export const SIMULATED_USERS: SimulatedUser[] = [
  {
    ruc: '20601234567',
    usuarioSol: 'GERENTE_MYPE',
    contrasenaSol: 'ClaveSolGerente2026',
    role: 'GERENTE',
    fullName: 'Carlos Mendoza (Gerente General)'
  },
  {
    ruc: '20601234567',
    usuarioSol: 'ADMIN_MYPE',
    contrasenaSol: 'ClaveSolAdmin2026',
    role: 'ADMINISTRADOR',
    fullName: 'Ana Torres (Administradora)'
  },
  {
    ruc: '20601234567',
    usuarioSol: 'EMPLEADO_MYPE',
    contrasenaSol: 'ClaveSolEmpleado2026',
    role: 'EMPLEADO',
    fullName: 'Juan Quispe (Asistente de Ventas)'
  },
  {
    ruc: '10467812349',
    usuarioSol: 'ESTEBAN_CONTADOR',
    contrasenaSol: 'ClaveSolContador2026',
    role: 'CONTADOR',
    fullName: 'Esteban Delgado (Contador Externo)'
  }
];
