export interface User {
  readonly id: string
  correo: string
  rol: string
}

export interface Note {
  readonly id?: string
  title: string
  description: string
  invitations?: Invitation[];
}

export interface Invitation {
  userId: string;
  userEmail: string;
}

export interface FormSign {
  email: string
  password: string
}
