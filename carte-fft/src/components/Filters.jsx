import { useState } from 'react'

const ALL_FILIERES = [
  'Arts, Lettres et Langues',
  'Droit',
  'Éco-Gestion',
  'Histoire-Géographie',
  'Ingénieur',
  'Maths-Informatique',
  'Médecine',
  'Sciences',
  'Sciences Humaines',
  'Sciences Politiques',
  'STAPS',
  'BUT',
]

export const ALL_AMENAGEMENTS = [
  "Aménagement d\u2019horaires/Dispense d\u2019assiduité",
  "Aménagement des examens",
  "Choix des groupes de TD/TP",
  "Étalement du cursus",
  "Tutorat individualisé",
  "Accès aux installations sportives universitaires",
  "Collaboration avec un club de proximité",
]

export default function Filters({ filters, setFilters, regions }) {
  const [amenOpen, setAmenOpen] = useState(false)
  const update = (key, value) => setFilters(f => ({ ...f, [key]: value }))

  const toggleAmenagement = (tag) => {
    const current = filters.amenagements || []
    const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
    update('amenagements', next)
  }

  const activeCount = [
    filters.region,
    filters.filiere,
    filters.niveau,
    filters.type,
    ...(filters.amenagements || []),
  ].filter(Boolean).length

  return (
    <div className="filters">
      <div className="filters-inner">
        <div className="filter-group">
          <label>Type d'établissement</label>
          <select value={filters.type} onChange={e => update('type', e.target.value)}>
            <option value="">Tous</option>
            <option value="universite">Université</option>
            <option value="ecole_commerce">École de commerce</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Région</label>
          <select value={filters.region} onChange={e => update('region', e.target.value)}>
            <option value="">Toutes les régions</option>
            {Object.entries(regions).sort((a, b) => a[1].localeCompare(b[1])).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filière</label>
          <select value={filters.filiere} onChange={e => update('filiere', e.target.value)}>
            <option value="">Toutes les filières</option>
            {ALL_FILIERES.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Niveau sportif accepté</label>
          <select value={filters.niveau} onChange={e => update('niveau', e.target.value)}>
            <option value="">SHN et SBN</option>
            <option value="SHN">SHN uniquement</option>
            <option value="SBN">Inclut SBN</option>
          </select>
        </div>

        {activeCount > 0 && (
          <button
            className="reset-btn"
            onClick={() => setFilters({ region: '', filiere: '', niveau: '', type: '', amenagements: [] })}
          >
            Réinitialiser ({activeCount})
          </button>
        )}
      </div>

      <div className="amenagements-filter">
        <button className="amenagements-toggle" onClick={() => setAmenOpen(o => !o)}>
          Types d'aménagement proposés
          {filters.amenagements?.length > 0 && <span className="amen-count">{filters.amenagements.length}</span>}
          <span className="toggle-arrow">{amenOpen ? '▲' : '▼'}</span>
        </button>
        {amenOpen && (
          <div className="amenagements-list">
            {ALL_AMENAGEMENTS.map(tag => (
              <label key={tag} className="amen-option">
                <input
                  type="checkbox"
                  checked={(filters.amenagements || []).includes(tag)}
                  onChange={() => toggleAmenagement(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
