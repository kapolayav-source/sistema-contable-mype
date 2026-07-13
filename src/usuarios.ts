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
      const parsed = JSON.parse(stored) as SimulatedUser[];
      let modified = false;

      // Ensure all INITIAL_SIMULATED_USERS exist in the stored array and are up to date
      INITIAL_SIMULATED_USERS.forEach(initial => {
        const index = parsed.findIndex(
          u => u.usuarioSol.toUpperCase() === initial.usuarioSol.toUpperCase()
        );
        if (index === -1) {
          parsed.push(initial);
          modified = true;
        } else {
          // Sync role and credentials if they differ from initial setup (to ensure correct testing)
          if (
            parsed[index].role !== initial.role ||
            parsed[index].contrasenaSol !== initial.contrasenaSol ||
            parsed[index].ruc !== initial.ruc
          ) {
            parsed[index].role = initial.role;
            parsed[index].contrasenaSol = initial.contrasenaSol;
            parsed[index].ruc = initial.ruc;
            parsed[index].fullName = initial.fullName;
            modified = true;
          }
        }
      });

      if (modified) {
        saveUsersToStorage(parsed);
      }
      return parsed;
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
