import { UserRole } from './types';

export interface SimulatedUser {
  ruc: string;
  usuarioSol: string;
  contrasenaSol: string;
  role: UserRole;
  fullName: string;
}

export const INITIAL_SIMULATED_USERS: SimulatedUser[] = [
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

export function getRegisteredUsers(): SimulatedUser[] {
  try {
    const stored = localStorage.getItem('mype_users_db');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading user DB from storage', e);
  }
  // Initialize with initial users
  saveUsersToStorage(INITIAL_SIMULATED_USERS);
  return INITIAL_SIMULATED_USERS;
}

export function saveUsersToStorage(users: SimulatedUser[]): void {
  try {
    localStorage.setItem('mype_users_db', JSON.stringify(users));
  } catch (e) {
    console.error('Error saving user DB to storage', e);
  }
}

export function registerUser(user: SimulatedUser): boolean {
  const users = getRegisteredUsers();
  // Check if a user with same RUC + SOL User already exists
  const exists = users.some(
    u => u.ruc === user.ruc && u.usuarioSol.toUpperCase() === user.usuarioSol.toUpperCase()
  );
  if (exists) {
    return false; // Already exists
  }
  users.push(user);
  saveUsersToStorage(users);
  return true;
}

export function deleteUser(ruc: string, usuarioSol: string): boolean {
  const users = getRegisteredUsers();
  const filtered = users.filter(
    u => !(u.ruc === ruc && u.usuarioSol.toUpperCase() === usuarioSol.toUpperCase())
  );
  if (filtered.length === users.length) {
    return false;
  }
  saveUsersToStorage(filtered);
  return true;
}

export function getUsersByRuc(ruc: string): SimulatedUser[] {
  return getRegisteredUsers().filter(u => u.ruc === ruc);
}
