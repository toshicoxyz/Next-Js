/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ForceGraph3D } from 'react-force-graph'
import { CircularProgress } from '@mui/material'
import { TextureLoader, SpriteMaterial, Sprite } from 'three'
import { PokeApi, Pokemon } from '@/models/PokeApi'

interface Data {
  nodes: Node[]
  links: Link[]
}

interface Node {
  id: number
  name: string
  sprites: {
    front_default: string
  }
}

interface Link {
  source: string
  target: string
}

const Home = () => {
  const [pokeApi, setPokeApi] = useState<PokeApi>({} as PokeApi)
  const [pokemones, setPokemones] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const pokeApiBaseUrl = 'https://pokeapi.co/api/v2'
        const response = await axios.get(
          `${pokeApiBaseUrl}/pokemon?offset=0&limit=20`
        )
        setPokeApi(response.data)
        let nextUrl = response.data.next
        setLoading(false)

        while (nextUrl) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Agregar un retraso de 1 segundo (1000 ms)

          const nextResponse = await axios.get(nextUrl)
          const nextData = nextResponse.data
          const pokemonsWithDetails: Pokemon[] = await Promise.all(
            nextData.results.map(async (pokemon: any) => {
              const detailsResponse = await axios.get(
                `${pokeApiBaseUrl}/pokemon/${pokemon.name}`
              )
              const { id, name, sprites, types } = detailsResponse.data
              return {
                id,
                name,
                sprites: {
                  front_default: sprites.front_default,
                },
                types,
              }
            })
          )

          nextUrl = nextData.next
          setPokeApi(prevData => ({
            ...prevData,
            results: [...nextData.results],
            next: nextData.next,
          }))
          setPokemones(prevPokemons => [
            ...prevPokemons,
            ...pokemonsWithDetails,
          ])
        }
      } catch (error) {
        console.error('Error al obtener los Pokémon:', error)
      }
    }

    fetchPokemons()
  }, [])

  useEffect(() => {
    console.log(pokeApi)
  }, [pokeApi])

  const nodeThreeObject = useMemo(
    () =>
      ({ sprites }: Pokemon): Sprite => {
        const imgTexture = new TextureLoader().load(sprites.front_default)
        const material = new SpriteMaterial({ map: imgTexture })
        const sprite = new Sprite(material)
        sprite.scale.set(12, 12, 1)

        return sprite
      },
    [] // No hay dependencias, solo se calculará una vez
  )

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <ForceGraph3D
        enableNodeDrag={false}
        nodeThreeObject={nodeThreeObject}
        graphData={{ nodes: pokemones, links: [] }}
      />
    </>
  )
}

export default Home

// const links: Link[] = []
// const typesMap: { [type: string]: string[] } = {}

// Crear mapa de tipos y Pokémon correspondientes
// for (const pokemon of pokemons.nodes) {
//   for (const type of pokemon.types) {
//     const typeName = type.type.name
//     if (!typesMap[typeName]) {
//       typesMap[typeName] = []
//     }
//     typesMap[typeName].push(pokemon.name)
//   }
// }

// Crear enlaces en función de los tipos de elemento y los Pokémon correspondientes
// for (const [source, targets] of Object.entries(typesMap)) {
//   for (const target of targets) {
//     links.push({ source, target })
//   }
// }
// console.log(links)
