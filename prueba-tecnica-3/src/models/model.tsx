export interface User {
  readonly id?: string
  last: string
  born: number
  first: string
  image: string
  description: string
}

export interface FormSign {
  email: string
  password: string
}
