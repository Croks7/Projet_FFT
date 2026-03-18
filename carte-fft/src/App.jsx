import { useState, useMemo } from 'react'
import MapView from './components/MapView'
import Filters from './components/Filters'
import DetailPanel from './components/DetailPanel'
import etablissements from './data/etablissements.json'
import './App.css'

export const REGIONS = {
  ARA: 'Auvergne-Rhône-Alpes',
  BFC: 'Bourgogne-Franche-Comté',
  BRE: 'Bretagne',
  COR: 'Corse',
  CVL: 'Centre-Val de Loire',
  GDE: 'Grand Est',
  HDF: 'Hauts-de-France',
  IDF: 'Île-de-France',
  NOR: 'Normandie',
  NVA: 'Nouvelle-Aquitaine',
  OCC: 'Occitanie',
  PACA: "Provence-Alpes-Côte d'Azur",
  PDL: 'Pays de la Loire',
  REU: 'La Réunion',
  NCA: 'Nouvelle-Calédonie',
}

export default function App() {
  const [filters, setFilters] = useState({
    region: '',
    filiere: '',
    distanciel: false,
    niveau: '',
    type: '',
  })
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return etablissements.filter(e => {
      if (filters.region && e.region !== filters.region) return false
      if (filters.type && e.type !== filters.type) return false
      if (filters.distanciel && !e.distanciel) return false
      if (filters.filiere && !e.filieres?.includes(filters.filiere)) return false
      if (filters.niveau === 'SHN' && !e.criteres?.toUpperCase().includes('SHN')) return false
      if (filters.niveau === 'SBN' && !e.criteres?.toUpperCase().includes('SBN')) return false
      return true
    })
  }, [filters])

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <h1>Formations SHN / SBN</h1>
          <p>Trouvez une formation adaptée à votre double projet sportif et scolaire</p>
        </div>
        <span className="count">{filtered.length} établissement{filtered.length > 1 ? 's' : ''}</span>
      </header>

      <div className="main">
        <Filters filters={filters} setFilters={setFilters} regions={REGIONS} />
        <div className="map-area">
          <MapView
            etablissements={filtered}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        {selected && (
          <DetailPanel etablissement={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  )
}
