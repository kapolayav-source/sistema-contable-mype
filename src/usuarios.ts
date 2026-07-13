import { UserRole } from './types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface SimulatedUser {
  ruc: string;
  usuarioSol: string;
  contrasenaSol: string;
  role: UserRole;
  fullName: string;
  estado?: 'PENDIENTE' | 'ACTIVO';
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

// --- Sync Helpers for Local Storage Fallback ---
export function getRegisteredUsers(): SimulatedUser[] {
  try {
    const stored = localStorage.getItem('mype_users_db');
    if (stored) {
      const parsed = JSON.parse(stored) as SimulatedUser[];
      let modified = false;

      INITIAL_SIMULATED_USERS.forEach(initial => {
        const index = parsed.findIndex(
          u => u.usuarioSol.toUpperCase() === initial.usuarioSol.toUpperCase()
        );
        if (index === -1) {
          parsed.push(initial);
          modified = true;
        } else {
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
  const exists = users.some(
    u => u.ruc === user.ruc && u.usuarioSol.toUpperCase() === user.usuarioSol.toUpperCase()
  );
  if (exists) {
    return false;
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


// --- Asynchronous Cloud Database Operations (Supabase) ---

/**
 * Validates a user using Supabase if configured, otherwise falls back to local storage
 */
export async function validateUserCloud(
  usuario: string,
  contrasena: string,
  ruc?: string
): Promise<SimulatedUser | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario.toUpperCase())
        .eq('contrasena', contrasena);

      if (ruc) {
        query = query.eq('ruc', ruc);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const dbUser = data[0];
        return {
          ruc: dbUser.ruc,
          usuarioSol: dbUser.usuario,
          contrasenaSol: dbUser.contrasena,
          role: dbUser.rol as UserRole,
          fullName: dbUser.nombre_completo,
          estado: dbUser.estado || 'ACTIVO'
        };
      }
      return null;
    } catch (err) {
      console.error('Error authenticating with Supabase:', err);
      // Fallback to local storage if network or table error
    }
  }

  // Fallback to LocalStorage
  const localUsers = getRegisteredUsers();
  const matched = localUsers.find(
    u => u.usuarioSol.toUpperCase() === usuario.toUpperCase() &&
         u.contrasenaSol === contrasena &&
         (!ruc || u.ruc === ruc)
  );
  if (matched) {
    return {
      ...matched,
      estado: matched.estado || 'ACTIVO'
    };
  }
  return null;
}

/**
 * Registers a user in Supabase, with LocalStorage fallback
 */
export async function registerUserCloud(user: SimulatedUser): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Check if user already exists
      const { data: existing, error: checkError } = await supabase
        .from('usuarios')
        .select('usuario')
        .eq('ruc', user.ruc)
        .eq('usuario', user.usuarioSol.toUpperCase());

      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        return false; // Already exists
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          ruc: user.ruc,
          usuario: user.usuarioSol.toUpperCase(),
          contrasena: user.contrasenaSol,
          rol: 'GERENTE',
          nombre_completo: user.fullName,
          estado: 'PENDIENTE'
        });

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      console.error('Error inserting user to Supabase:', err);
    }
  }

  // Fallback to LocalStorage
  return registerUser(user);
}

/**
 * Revokes access / Deletes a user
 */
export async function deleteUserCloud(ruc: string, usuarioSol: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('ruc', ruc)
        .eq('usuario', usuarioSol.toUpperCase());

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting user from Supabase:', err);
    }
  }

  return deleteUser(ruc, usuarioSol);
}

/**
 * Retrieves sub-users by RUC from Supabase or local storage
 */
export async function getUsersByRucCloud(ruc: string): Promise<SimulatedUser[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('ruc', ruc);

      if (error) throw error;

      if (data) {
        return data.map(dbUser => ({
          ruc: dbUser.ruc,
          usuarioSol: dbUser.usuario,
          contrasenaSol: dbUser.contrasena,
          role: dbUser.rol as UserRole,
          fullName: dbUser.nombre_completo
        }));
      }
    } catch (err) {
      console.error('Error fetching users from Supabase:', err);
    }
  }

  return getUsersByRuc(ruc);
}
