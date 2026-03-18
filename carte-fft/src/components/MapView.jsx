import { useEffect } from 'react'
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
    // Don't auto-fit if only overseas
    const metro = valid.filter(e => e.lat > 40 && e.lat < 52 && e.lng > -6 && e.lng < 10)
    if (metro.length > 0) {
      const bounds = L.latLngBounds(metro.map(e => [e.lat, e.lng]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [etablissements, map])
  return null
}

export default function MapView({ etablissements, selected, onSelect }) {
  return (
    <MapContainer
      center={[46.5, 2.5]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds etablissements={etablissements} />
      {etablissements.filter(e => e.lat && e.lng).map(e => (
        <Marker
          key={e.id}
          position={[e.lat, e.lng]}
          icon={e.type === 'ecole_commerce' ? ecoleIcon : universiteIcon}
          eventHandlers={{ click: () => onSelect(e) }}
        >
          <Popup>
            <strong>{e.nom}</strong>
            <br />
            {e.distanciel && <span className="badge distanciel">Distanciel</span>}
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
  )
}
