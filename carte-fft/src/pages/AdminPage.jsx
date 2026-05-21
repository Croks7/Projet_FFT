import { useState } from 'react'
import initialData from '../data/etablissements.json'
import { REGIONS } from '../App'
import { ALL_AMENAGEMENTS } from '../components/Filters'
import '../admin.css'

const ALL_FILIERES = [
  'Arts, Lettres et Langues', 'Droit', 'Éco-Gestion', 'Histoire-Géographie',
  'Ingénieur', 'Maths-Informatique', 'Médecine', 'Sciences',
  'Sciences Humaines', 'Sciences Politiques', 'STAPS', 'BUT',
]

const EMPTY = {
  type: 'universite',
  nom: '',
  region: 'ARA',
  referent: '',
  email: '',
  telephone: '',
  criteres_shn: '',
  criteres_sbn: '',
  classement_sbn: '',
  criteres: '',
  amenagements: '',
  amenagement_tags: [],
  filieres: [],
  formation: '',
  club_proximite: '',
  lien: '',
  lien_doc: [],
  distanciel: false,
  lat: '',
  lng: '',
}

// ── Form ────────────────────────────────────────────────────────────────────

function EtabForm({ etab, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...etab,
    lat: etab?.lat ?? '',
    lng: etab?.lng ?? '',
    lien_doc: etab?.lien_doc ?? [],
    amenagement_tags: etab?.amenagement_tags ?? [],
    filieres: etab?.filieres ?? [],
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleArr = (key, val) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    }))

  const isUniv = form.type === 'universite'

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = {
      ...form,
      nom_complet: form.nom,
      lat: form.lat !== '' ? parseFloat(form.lat) : null,
      lng: form.lng !== '' ? parseFloat(form.lng) : null,
      lien_doc: form.lien_doc.filter(Boolean),
    }
    // Remove fields not relevant to the type
    if (isUniv) {
      delete cleaned.criteres
      delete cleaned.formation
    } else {
      delete cleaned.criteres_shn
      delete cleaned.criteres_sbn
      delete cleaned.classement_sbn
      delete cleaned.filieres
    }
    onSave(cleaned)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-header">
        <button type="button" className="admin-btn-back" onClick={onCancel}>← Retour</button>
        <h2>{etab?.id !== undefined ? `Modifier : ${etab.nom}` : 'Ajouter un établissement'}</h2>
      </div>

      <div className="admin-form-body">

        {/* ── Informations générales ── */}
        <fieldset>
          <legend>Informations générales</legend>
          <label>
            Nom *
            <input required value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ex : Université de Lyon" />
          </label>
          <div className="admin-grid-2">
            <label>
              Type
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="universite">Université</option>
                <option value="ecole_commerce">École de commerce</option>
              </select>
            </label>
            <label>
              Région
              <select value={form.region} onChange={e => set('region', e.target.value)}>
                {Object.entries(REGIONS).sort((a, b) => a[1].localeCompare(b[1])).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-grid-2">
            <label>
              Latitude (entre -90 et 90)
              <input type="number" step="any" min="-90" max="90" value={form.lat} onChange={e => set('lat', e.target.value)} placeholder="ex : 45.7640" />
            </label>
            <label>
              Longitude (entre -180 et 180)
              <input type="number" step="any" min="-180" max="180" value={form.lng} onChange={e => set('lng', e.target.value)} placeholder="ex : 4.8357" />
            </label>
          </div>
        </fieldset>

        {/* ── Référent ── */}
        <fieldset>
          <legend>Référent SHN</legend>
          <label>
            Nom du référent
            <input value={form.referent} onChange={e => set('referent', e.target.value)} placeholder="Prénom NOM" />
          </label>
          <label>
            Email
            <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="prenom.nom@universite.fr" />
          </label>
          <label>
            Téléphone
            <input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="06 XX XX XX XX" />
          </label>
        </fieldset>

        {/* ── Critères ── */}
        <fieldset>
          <legend>Critères d'admission</legend>
          {isUniv ? (
            <>
              <label>
                Critères statut SHN
                <textarea rows={3} value={form.criteres_shn} onChange={e => set('criteres_shn', e.target.value)} placeholder="Description des critères pour le statut SHN..." />
              </label>
              <label>
                Critères statut SBN
                <textarea rows={3} value={form.criteres_sbn} onChange={e => set('criteres_sbn', e.target.value)} placeholder="Description des critères pour le statut SBN..." />
              </label>
              <label>
                Classement minimum SBN
                <input value={form.classement_sbn} onChange={e => set('classement_sbn', e.target.value)} placeholder="ex : 2/6 ou Non déterminé" />
              </label>
            </>
          ) : (
            <label>
              Critères SHN/SBN
              <textarea rows={4} value={form.criteres} onChange={e => set('criteres', e.target.value)} placeholder="Description des critères d'admission..." />
            </label>
          )}
        </fieldset>

        {/* ── Aménagements ── */}
        <fieldset>
          <legend>Aménagements</legend>
          <p className="admin-field-hint">Types d'aménagements proposés</p>
          <div className="admin-checkboxes">
            {ALL_AMENAGEMENTS.map(tag => (
              <label key={tag} className="admin-check-label">
                <input
                  type="checkbox"
                  checked={form.amenagement_tags.includes(tag)}
                  onChange={() => toggleArr('amenagement_tags', tag)}
                />
                {tag}
              </label>
            ))}
          </div>
          <label style={{ marginTop: 12 }}>
            Description détaillée des aménagements
            <textarea rows={4} value={form.amenagements} onChange={e => set('amenagements', e.target.value)} placeholder="Décrire les aménagements en détail..." />
          </label>
        </fieldset>

        {/* ── Filières (universités uniquement) ── */}
        {isUniv && (
          <fieldset>
            <legend>Filières disponibles</legend>
            <div className="admin-checkboxes">
              {ALL_FILIERES.map(f => (
                <label key={f} className="admin-check-label">
                  <input
                    type="checkbox"
                    checked={form.filieres.includes(f)}
                    onChange={() => toggleArr('filieres', f)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* ── Formation (écoles de commerce uniquement) ── */}
        {!isUniv && (
          <fieldset>
            <legend>Formation(s) proposée(s)</legend>
            <label>
              <textarea rows={3} value={form.formation} onChange={e => set('formation', e.target.value)} placeholder="Ex : Bachelor / Master Management..." />
            </label>
          </fieldset>
        )}

        {/* ── Autres ── */}
        <fieldset>
          <legend>Autres informations</legend>
          <label>
            Relation avec un club de proximité
            <textarea rows={3} value={form.club_proximite} onChange={e => set('club_proximite', e.target.value)} />
          </label>
          <label>
            Lien site officiel SHN/SBN
            <input value={form.lien} onChange={e => set('lien', e.target.value)} placeholder="https://..." />
          </label>
          <div>
            <p className="admin-field-hint">Documents complémentaires</p>
            {form.lien_doc.map((url, i) => (
              <div key={i} className="admin-url-row">
                <input
                  value={url}
                  onChange={e => {
                    const docs = [...form.lien_doc]
                    docs[i] = e.target.value
                    set('lien_doc', docs)
                  }}
                  placeholder="https://drive.google.com/..."
                />
                <button
                  type="button"
                  className="admin-url-remove"
                  onClick={() => set('lien_doc', form.lien_doc.filter((_, j) => j !== i))}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn-add-url"
              onClick={() => set('lien_doc', [...form.lien_doc, ''])}
            >
              + Ajouter un document
            </button>
          </div>
          <label className="admin-check-label" style={{ marginTop: 16, display: 'inline-flex' }}>
            <input type="checkbox" checked={form.distanciel} onChange={e => set('distanciel', e.target.checked)} />
            Formation disponible en distanciel
          </label>
        </fieldset>

      </div>

      <div className="admin-form-footer">
        <button type="button" className="admin-btn-secondary" onClick={onCancel}>Annuler</button>
        <button type="submit" className="admin-btn-primary">Enregistrer</button>
      </div>
    </form>
  )
}

// ── Main admin page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [data, setData] = useState([...initialData])
  const [hasChanges, setHasChanges] = useState(false)
  const [editing, setEditing] = useState(null) // null = list, 'new' = new, object = edit

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // ── Login ──
  const handleLogin = (e) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Mot de passe incorrect')
    }
  }

  // ── Publish to GitHub ──
  const publishChanges = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setSaveMsg('✓ Publié ! Le site se met à jour automatiquement (1-2 min).')
      setHasChanges(false)
    } catch (err) {
      setSaveMsg('✗ Erreur : ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Save an establishment (add or edit) ──
  const handleSaveEtab = (etab) => {
    setData(prev => {
      if (etab.id !== undefined) {
        return prev.map(e => e.id === etab.id ? etab : e)
      }
      const newId = Math.max(...prev.map(e => e.id ?? -1)) + 1
      return [...prev, { ...etab, id: newId }]
    })
    setHasChanges(true)
    setEditing(null)
  }

  // ── Delete ──
  const handleDelete = (id, nom) => {
    if (!window.confirm(`Supprimer "${nom}" ?`)) return
    setData(prev => prev.filter(e => e.id !== id))
    setHasChanges(true)
  }

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-box">
          <h1>Administration FFT</h1>
          <p>Accès réservé</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit">Se connecter</button>
          </form>
        </div>
      </div>
    )
  }

  // ── Edit/Add form ──
  if (editing !== null) {
    return (
      <div className="admin-page">
        <div className="admin-page-inner">
          <EtabForm
            etab={editing === 'new' ? null : editing}
            onSave={handleSaveEtab}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    )
  }

  // ── List view ──
  const displayed = data.filter(e => {
    if (typeFilter && e.type !== typeFilter) return false
    if (search && !e.nom.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="admin-page">
      <div className="admin-page-inner">

        <div className="admin-header">
          <h1>Administration FFT</h1>
          <div className="admin-header-actions">
            {hasChanges && <span className="admin-unsaved">● Modifications non publiées</span>}
            {saveMsg && (
              <span className={saveMsg.startsWith('✓') ? 'admin-success' : 'admin-error'}>
                {saveMsg}
              </span>
            )}
            <button
              className={`admin-btn-primary${hasChanges ? ' admin-btn-pulse' : ''}`}
              onClick={publishChanges}
              disabled={!hasChanges || saving}
            >
              {saving ? 'Publication...' : 'Publier les modifications'}
            </button>
            <button className="admin-btn-secondary" onClick={() => { setAuthed(false); setPassword('') }}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Rechercher un établissement..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">Tous les types</option>
            <option value="universite">Universités</option>
            <option value="ecole_commerce">Écoles de commerce</option>
          </select>
          <button className="admin-btn-primary" onClick={() => setEditing('new')}>+ Ajouter</button>
        </div>

        <p className="admin-count">
          {displayed.length} établissement{displayed.length > 1 ? 's' : ''}
        </p>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Région</th>
              <th>Référent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(e => (
              <tr key={e.id}>
                <td><strong>{e.nom}</strong></td>
                <td>{e.type === 'ecole_commerce' ? 'École de commerce' : 'Université'}</td>
                <td>{REGIONS[e.region] || e.region}</td>
                <td>{e.referent || '—'}</td>
                <td>
                  <button className="admin-btn-edit" onClick={() => setEditing(e)}>Modifier</button>
                  <button className="admin-btn-delete" onClick={() => handleDelete(e.id, e.nom)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}
