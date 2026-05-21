export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, data } = req.body

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Données invalides' })
  }

  const TOKEN = process.env.GITHUB_TOKEN
  const REPO = 'Croks7/Projet_FFT'
  const FILE_PATH = 'carte-fft/src/data/etablissements.json'
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

  const headers = {
    Authorization: `token ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }

  // Get current file SHA
  const getRes = await fetch(API_URL, { headers })
  if (!getRes.ok) {
    return res.status(500).json({ error: 'Impossible de lire le fichier sur GitHub' })
  }
  const { sha } = await getRes.json()

  // Encode new content in base64
  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64')

  // Commit to GitHub
  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Mise à jour via interface admin FFT',
      content,
      sha,
      committer: { name: 'Admin FFT', email: 'admin@fft.fr' },
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.json()
    return res.status(500).json({ error: err.message || 'Erreur lors du commit GitHub' })
  }

  return res.status(200).json({ success: true })
}
