import { useState, useMemo } from 'react'
import MapView from './components/MapView'
import Filters from './components/Filters'
import DetailPanel from './components/DetailPanel'
import EtablissementList from './components/EtablissementList'
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
    niveau: '',
    type: '',
  })
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return etablissements.filter(e => {
      if (filters.region && e.region !== filters.region) return false
      if (filters.type && e.type !== filters.type) return false
if (filters.filiere && !e.filieres?.includes(filters.filiere)) return false
      if (filters.niveau === 'SHN' && !e.criteres?.toUpperCase().includes('SHN')) return false
      if (filters.niveau === 'SBN' && !e.criteres?.toUpperCase().includes('SBN')) return false
      return true
    })
  }, [filters])

  return (
    <div className="app">
      <div className="page-card">
        <header className="hero">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-description">
                Outil mis à disposition par la Fédération Française de Tennis pour accompagner
                ses meilleurs sportifs dans leur double projet sportif et académique.
              </p>
              <h1>Trouver des formations pour Sportif de Haut Niveau (SHN) et pour Sportif de Bon Niveau (SBN)</h1>
            </div>
            <img src="/logo-fft.png" className="hero-logo" alt="FFT" />
          </div>
        </header>

        <div className="card-body">
          <section className="filters-section">
            <Filters filters={filters} setFilters={setFilters} regions={REGIONS} />
          </section>

          <section className="map-section">
            <div className="map-container">
              <MapView
                etablissements={filtered}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
            <p className="map-hint">
              <span className="dot blue" /> Université &nbsp;·&nbsp; <span className="dot red" /> École de commerce &nbsp;·&nbsp; Cliquez sur un marqueur pour voir le détail
            </p>
          </section>

          <section className="list-section">
            <div className="list-header">
              <h2>Liste des établissements</h2>
              <span className="count">{filtered.length} établissement{filtered.length > 1 ? 's' : ''}</span>
            </div>
            <EtablissementList etablissements={filtered} onSelect={setSelected} />
          </section>
        </div>
      </div>

      {selected && (
        <DetailPanel etablissement={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
