export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: PokemonType[]
}

export interface PokeApi {
  count: number
  next: string
  previous: string
  results: Result[]
}

interface Result {
  name: string
  url: string
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}
