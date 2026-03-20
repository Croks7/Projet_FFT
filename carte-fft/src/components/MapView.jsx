import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const universiteIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const ecoleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function FitBounds({ etablissements }) {
  const map = useMap()
  useEffect(() => {
    const valid = etablissements.filter(e => e.lat && e.lng)
    if (valid.length === 0) return
    const metro = valid.filter(e => e.lat > 40 && e.lat < 52 && e.lng > -6 && e.lng < 10)
    if (metro.length > 0) {
      const bounds = L.latLngBounds(metro.map(e => [e.lat, e.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [etablissements, map])
  return null
}

function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 9, { duration: 1.5 })
    }
  }, [target, map])
  return null
}

function SearchBar({ onResult }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=fr`
      const res = await fetch(url, { headers: { 'Accept-Language': 'fr' } })
      const data = await res.json()
      if (data.length > 0) {
        onResult({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
      } else {
        setError('Lieu introuvable')
      }
    } catch {
      setError('Erreur de recherche')
    }
    setLoading(false)
  }

  return (
    <div className="map-search-wrapper">
      <form className="map-search" onSubmit={search}>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setError('') }}
          placeholder="Rechercher une ville ou un lieu..."
        />
        {error && <span className="map-search-error-inline">{error}</span>}
        <button type="submit" disabled={loading}>
          {loading ? '...' : '🔍'}
        </button>
      </form>
    </div>
  )
}

export default function MapView({ etablissements, selected, onSelect }) {
  const [flyTarget, setFlyTarget] = useState(null)
  const mapRef = useRef(null)

  const handleResult = (result) => {
    setFlyTarget(result)
    setTimeout(() => {
      mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <div ref={mapRef} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SearchBar onResult={handleResult} />
      <MapContainer
        center={[46.5, 2.5]}
        zoom={6}
        style={{ flex: 1, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds etablissements={etablissements} />
        <FlyTo target={flyTarget} />
        {etablissements.filter(e => e.lat && e.lng).map(e => (
          <Marker
            key={e.id}
            position={[e.lat, e.lng]}
            icon={e.type === 'ecole_commerce' ? ecoleIcon : universiteIcon}
          >
            <Popup>
              <strong>{e.nom}</strong>
              <br />
              <button
                onClick={() => onSelect(e)}
                style={{ marginTop: 6, cursor: 'pointer', background: '#003f8a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4 }}
              >
                Voir le détail
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
