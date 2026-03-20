import { REGIONS } from '../App'

function Section({ title, children }) {
  if (!children || (typeof children === 'string' && !children.trim())) return null
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  )
}

function MultilineText({ text }) {
  if (!text) return null
  return (
    <>
      {text.split('\n').map((line, i) =>
        line.trim() ? <p key={i}>{line.trim()}</p> : null
      )}
    </>
  )
}

export default function DetailPanel({ etablissement: e, onClose }) {
  const regionName = REGIONS[e.region] || e.region

  const emails = e.email?.split('\n').filter(Boolean) || []
  const phones = e.telephone?.split('\n').filter(Boolean) || []
  const referents = e.referent?.split('\n').filter(Boolean) || []

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={ev => ev.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Fermer">×</button>

        <div className="detail-header">
          <span className={`type-badge ${e.type}`}>
            {e.type === 'ecole_commerce' ? 'École de commerce' : 'Université'}
          </span>
          {regionName && <span className="region-badge">{regionName}</span>}
        </div>

        <h2>{e.nom}</h2>

        {e.formation && (
          <Section title="Formation(s) proposée(s)">
            <MultilineText text={e.formation} />
          </Section>
        )}

        {e.filieres?.length > 0 && (
          <Section title="Filières disponibles">
            <div className="filieres-list">
              {e.filieres.map(f => <span key={f} className="filiere-tag">{f}</span>)}
            </div>
          </Section>
        )}

        <Section title="Critères SHN / SBN">
          <MultilineText text={e.criteres} />
        </Section>

        <Section title="Aménagements proposés">
          <MultilineText text={e.amenagements} />
        </Section>

        <Section title="Relation avec un club de proximité">
          <MultilineText text={e.club_proximite} />
        </Section>

        <Section title="Contact du référent SHN">
          {referents.map((r, i) => (
            <div key={i} className="contact-block">
              <strong>{r}</strong>
              {emails[i] && (
                <a href={`mailto:${emails[i]}`} className="contact-link">
                  {emails[i]}
                </a>
              )}
              {phones[i] && phones[i] !== '/' && (
                <span className="contact-phone">{phones[i]}</span>
              )}
            </div>
          ))}
        </Section>

        {e.lien && (
          <a href={e.lien} target="_blank" rel="noopener noreferrer" className="cta-btn">
            Voir la page SHN officielle →
          </a>
        )}
      </div>
    </div>
  )
}
