import { useState } from 'react'
import Silk from './components/Silk.jsx'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchPokemon = async () => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    setError('')
    setPokemon(null)

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`)
      if (!response.ok) {
        throw new Error('Pokemon not found!')
      }
      const data = await response.json()
      setPokemon(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchPokemon()
    }
  }

  return (
    <div className='fixed inset-0 overflow-hidden'>
      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-4">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
            Pokemon Search
          </h1>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Pokemon name or ID..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={searchPokemon}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {pokemon && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-48 h-48 object-contain"
                />
                <h2 className="text-3xl font-bold capitalize mt-3 text-gray-800">
                  {pokemon.name}
                </h2>
                <p className="text-lg text-gray-600">#{pokemon.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Types</h3>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.slot}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium capitalize"
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Physical</h3>
                  <p className="text-xs text-gray-600">Height: {pokemon.height / 10} m</p>
                  <p className="text-xs text-gray-600">Weight: {pokemon.weight / 10} kg</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Stats</h3>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="capitalize text-gray-700">{stat.stat.name.replace('-', ' ')}</span>
                        <span className="font-semibold text-gray-800">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability.slot}
                      className="px-3 py-1 bg-yellow-400 text-gray-800 rounded-lg text-xs capitalize"
                    >
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!pokemon && !error && !loading && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg">Search for a Pokemon to get started!</p>
              <p className="text-sm mt-2">Try "pikachu", "charizard", or any Pokemon name/ID</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App