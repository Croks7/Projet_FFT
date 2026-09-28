async function commitFile(headers, repo, filePath, content, message) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`
  const getRes = await fetch(apiUrl, { headers })
  if (!getRes.ok) throw new Error(`Impossible de lire ${filePath} sur GitHub`)
  const { sha } = await getRes.json()
  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      sha,
      committer: { name: 'Admin FFT', email: 'admin@fft.fr' },
    }),
  })
  if (!putRes.ok) {
    const err = await putRes.json()
    throw new Error(err.message || `Erreur commit ${filePath}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { password, data, config } = req.body

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Données invalides' })
  }

  const TOKEN = process.env.GITHUB_TOKEN
  const REPO = 'Croks7/Projet_FFT'
  const headers = {
    Authorization: `token ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }

  try {
    await commitFile(
      headers, REPO,
      'carte-fft/src/data/etablissements.json',
      JSON.stringify(data, null, 2),
      'Mise à jour via interface admin FFT'
    )

    if (config && typeof config === 'object') {
      await commitFile(
        headers, REPO,
        'carte-fft/src/data/config.json',
        JSON.stringify(config, null, 2),
        'Mise à jour bandeau via interface admin FFT'
      )
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  return res.status(200).json({ success: true })
}
