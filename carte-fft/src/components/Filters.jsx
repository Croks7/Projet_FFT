import etablissements from '../data/etablissements.json'

const ALL_FILIERES = [
  'Droit / Sciences politiques',
  'Économie / Gestion / AES',
  'Médecine / Santé / Pharmacie / Maïeutique',
  'Sciences / Ingénierie / Technologie',
  'Lettres / Langues / Arts / Histoire',
  'STAPS',
  'Sciences sociales / Psychologie / Sociologie',
  'Commerce / Management',
  'IUT / BUT',
]

export default function Filters({ filters, setFilters, regions }) {
  const update = (key, value) => setFilters(f => ({ ...f, [key]: value }))

  const activeCount = [
    filters.region,
    filters.filiere,
    filters.distanciel,
    filters.niveau,
    filters.type,
  ].filter(Boolean).length

  return (
    <aside className="filters">
      <div className="filters-header">
        <h2>Filtres</h2>
        {activeCount > 0 && (
          <button
            className="reset-btn"
            onClick={() => setFilters({ region: '', filiere: '', distanciel: false, niveau: '', type: '' })}
          >
            Réinitialiser ({activeCount})
          </button>
        )}
      </div>

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

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={filters.distanciel}
            onChange={e => update('distanciel', e.target.checked)}
          />
          Formations avec distanciel disponible
        </label>
      </div>

      <div className="legend">
        <h3>Légende</h3>
        <div className="legend-item">
          <span className="dot blue" /> Université
        </div>
        <div className="legend-item">
          <span className="dot red" /> École de commerce
        </div>
      </div>
    </aside>
  )
}
