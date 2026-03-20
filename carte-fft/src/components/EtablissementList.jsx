import { REGIONS } from '../App'

export default function EtablissementList({ etablissements, onSelect }) {
  if (etablissements.length === 0) {
    return <p className="empty-list">Aucun établissement ne correspond à vos filtres.</p>
  }

  return (
    <div className="etab-grid">
      {etablissements.map(e => (
        <div key={e.id} className="etab-card" onClick={() => onSelect(e)}>
          <div className="etab-card-header">
            <span className={`type-badge ${e.type}`}>
              {e.type === 'ecole_commerce' ? 'École de commerce' : 'Université'}
            </span>
          </div>
          <h3>{e.nom}</h3>
          {REGIONS[e.region] && <p className="etab-region">{REGIONS[e.region]}</p>}
          {e.filieres?.length > 0 && (
            <div className="filieres-list">
              {e.filieres.slice(0, 3).map(f => (
                <span key={f} className="filiere-tag">{f}</span>
              ))}
              {e.filieres.length > 3 && (
                <span className="filiere-tag more">+{e.filieres.length - 3}</span>
              )}
            </div>
          )}
          <span className="voir-plus">Voir le détail →</span>
        </div>
      ))}
    </div>
  )
}
