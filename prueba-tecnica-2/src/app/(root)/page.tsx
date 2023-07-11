/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import ForceGraph3D from 'react-force-graph-3d'
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d'
import { CircularProgress } from '@mui/material'
import { TextureLoader, SpriteMaterial, Sprite, Color } from 'three'
import SpriteText from 'three-spritetext'
import { PokeApi, Pokemon, PokemonType } from '@/models/PokeApi'

interface Node {
  id: string
  name: string
  sprites: {
    front_default: string
  }
  types: PokemonType[]
}

interface Link {
  source: string
  target: string
}

const Home = () => {
  const [pokeApi, setPokeApi] = useState<PokeApi>({} as PokeApi)
  const [pokemones, setPokemones] = useState<Pokemon[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [typesPokemons, setTypesPokemons] = useState<
    { id: string; name: string; val: number }[]
  >([])

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const pokeApiBaseUrl = 'https://pokeapi.co/api/v2'
        const response = await axios.get(
          `${pokeApiBaseUrl}/pokemon?offset=0&limit=151`
        )
        setPokeApi((prevData: PokeApi) => ({
          ...prevData,
          results: [...response.data.results],
          next: response.data.next,
        }))

        setLoading(false)

        const respon = await axios.get('https://pokeapi.co/api/v2/type')
        const types = respon.data.results?.map((type: any) => type.name)

        setTypesPokemons(
          types.map((type: any) => ({
            id: type,
            name: type,
            val: 100,
          }))
        )
        setPokemones(
          types.map((type: any) => ({
            id: type,
            name: type,
            val: 100,
          }))
        )

        const processResults = async (results: Pokemon[]) => {
          const pokemonsWithDetails: Pokemon[] = await Promise.all(
            results.map(async (pokemon: Pokemon) => {
              const detailsResponse = await axios.get(
                `${pokeApiBaseUrl}/pokemon/${pokemon.name}`
              )
              const { id, name, sprites, types } = detailsResponse.data
              return {
                id: id.toString(),
                name,
                sprites: {
                  front_default: sprites.front_default,
                },
                types: types,
              }
            })
          )

          setPokemones((prevPokemons: Pokemon[]) => [
            ...prevPokemons,
            ...pokemonsWithDetails,
          ])
        }

        await processResults(response.data.results)
      } catch (error) {
        console.error('Error al obtener los Pokémon:', error)
      }
    }

    fetchPokemons()
  }, [])

  useEffect(() => {
    console.log({
      nodes: [...pokemones],
      links: [...links],
    })

    // SACAR LOS TYPOS DE POKEMONES
    const XD = pokemones.slice(20).flatMap((pokemon: any) => {
      if (pokemon.id === pokemon.name) {
        return null
      }
      const id = pokemon.id
      return pokemon.types?.map((x: any) => {
        const index = typesPokemons.findIndex(
          (type: any) => type.name === x.type.name
        )
        return {
          source: id.toString(),
          target: index !== -1 ? typesPokemons[index].name : '',
        }
      })
    })
    setLinks(XD)
  }, [pokemones])

  const nodeThreeObject = useMemo(
    () =>
      ({ sprites, name }: Pokemon): Sprite => {
        if (sprites?.front_default) {
          const imgTexture = new TextureLoader().load(sprites.front_default)
          const material = new SpriteMaterial({ map: imgTexture })
          const sprite = new Sprite(material)
          sprite.scale.set(12, 12, 1)
          return sprite
        }
        const textSprite = new SpriteText(name)
        textSprite.textHeight = 8
        return textSprite
      },
    []
  )
  if (loading) {
    return <CircularProgress />
  }

  return (
    <main className="flex min-h-screen justify-between">
      {/* <div className="text-white absolute z-10">HOLA</div>
      <div className="text-white absolute z-10">HOLA</div>
      <div className="text-white absolute z-10">HOLA</div> */}
      {typeof window !== 'undefined' && (
        <ForceGraph3D
          nodeThreeObject={nodeThreeObject}
          linkDirectionalArrowLength={3.5}
          linkCurvature={0.25}
          graphData={{
            nodes: [...pokemones],
            links: [...links],
          }}
        />
        // <ForceGraph2D
        //   // nodeThreeObject={nodeThreeText}
        //   graphData={{ nodes: pokemones, links: links }}
        // />
      )}
      {/* <h1 className="text-gray-400 absolute z-10">© Copyright 2023 - T O S H I C O</h1> */}
    </main>
  )
}

export default Home
