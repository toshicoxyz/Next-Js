export interface User {
  readonly id: string
  correo: string
  rol: string
}

export interface Note {
  readonly id?: string
  title: string
  description: string
}

export interface FormSign {
  email: string
  password: string
}
