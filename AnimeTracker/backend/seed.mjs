import fetch from 'node:http';
import https from 'node:https';

const BASE = 'http://localhost:3000/api';

async function api(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const req = fetch.request(options, res => {
      let raw = '';
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch { resolve(raw); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function register(email, pseudo, password) {
  const r = await api('POST', '/auth/register', { email, pseudo, password });
  if (!r.success) { console.log(`  [SKIP] ${pseudo}: ${r.message}`); return null; }
  console.log(`  [OK] Créé: ${pseudo}`);
  return r.data;
}

async function login(email, password) {
  const r = await api('POST', '/auth/login', { email, password });
  if (!r.success) { console.error(`  [ERR] Login ${email}: ${r.message}`); return null; }
  return r.data;
}

async function searchAnime(q, token) {
  const r = await api('GET', `/animes/search?q=${encodeURIComponent(q)}&limit=1`, null, token);
  return r.data?.data?.[0] ?? null;
}

async function addReview(animeId, rating, comment, visibility, token) {
  return api('POST', `/animes/${animeId}/reviews`, { rating, comment, visibility }, token);
}

async function addToLibrary(animeId, status, token) {
  return api('POST', `/users/me/animes`, { animeId, status, episodesWatched: 0 }, token);
}

async function createConversation(recipientId, token) {
  const r = await api('POST', `/conversations/with/${recipientId}`, {}, token);
  return r.data?.id ?? r.data?.id_conversation ?? null;
}

async function sendMessage(convId, content, token) {
  return api('POST', `/conversations/${convId}/messages`, { content }, token);
}

async function joinGroup(animeId, token) {
  const r = await api('GET', `/groups/anime/${animeId}`, null, token);
  const groupId = r.data?.id ?? r.data?.id_group;
  if (!groupId) return null;
  await api('POST', `/groups/${groupId}/join`, {}, token);
  return groupId;
}

async function sendGroupMessage(groupId, content, token) {
  return api('POST', `/groups/${groupId}/messages`, { content }, token);
}

async function follow(userId, token) {
  return api('POST', `/users/${userId}/follow`, {}, token);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

console.log('\n=== Seed AnimeTracker ===\n');

// 1. Créer les utilisateurs
console.log('1. Création des comptes...');
const pwd = 'Test1234';
await register('alice@anime.com', 'AliceOtaku', pwd);
await register('bob@anime.com', 'BobSenpai', pwd);
await register('charlie@anime.com', 'CharlieWeeb', pwd);
await register('sakura@anime.com', 'SakuraChan', pwd);

// 2. Login de tous
console.log('\n2. Login...');
const sessions = {};
for (const [k, email] of Object.entries({
  alice: 'alice@anime.com',
  bob: 'bob@anime.com',
  charlie: 'charlie@anime.com',
  sakura: 'sakura@anime.com',
})) {
  const s = await login(email, pwd);
  if (s) { sessions[k] = s; console.log(`  [OK] ${k} (${s.userId})`); }
}

// 3. Récupérer les IDs
const ids = {};
for (const [k, s] of Object.entries(sessions)) ids[k] = s.userId;

// 4. IDs animés déjà en cache dans la BDD
console.log('\n3. Animés (IDs MAL connus)...');
const animes = {
  'Naruto':          20,
  'One Piece':       21,
  'Attack on Titan': 16498,
  'Death Note':      1535,
  'Demon Slayer':    38000,
};
for (const [title, id] of Object.entries(animes)) {
  console.log(`  [OK] ${title} (id: ${id})`);
}

// 5. Ajouter des animés à la bibliothèque
console.log('\n4. Bibliothèques...');
const aliceToken = sessions.alice?.token;
const bobToken = sessions.bob?.token;
const charlieToken = sessions.charlie?.token;
const sakuraToken = sessions.sakura?.token;

if (animes['Naruto']) {
  await addToLibrary(animes['Naruto'], 'TERMINE', aliceToken);
  await addToLibrary(animes['Naruto'], 'EN_COURS', bobToken);
  await addToLibrary(animes['Naruto'], 'TERMINE', charlieToken);
}
if (animes['Attack on Titan']) {
  await addToLibrary(animes['Attack on Titan'], 'TERMINE', aliceToken);
  await addToLibrary(animes['Attack on Titan'], 'A_VOIR', sakuraToken);
  await addToLibrary(animes['Attack on Titan'], 'EN_COURS', charlieToken);
}
if (animes['Death Note']) {
  await addToLibrary(animes['Death Note'], 'TERMINE', bobToken);
  await addToLibrary(animes['Death Note'], 'TERMINE', sakuraToken);
}
if (animes['One Piece']) {
  await addToLibrary(animes['One Piece'], 'EN_COURS', aliceToken);
  await addToLibrary(animes['One Piece'], 'A_VOIR', charlieToken);
}
console.log('  [OK] Bibliothèques ajoutées');

// 6. Créer des avis
console.log('\n5. Avis...');
const reviewData = [
  { animeId: animes['Naruto'], rating: 8, comment: 'Un classique incontournable du shonen ! L\'évolution de Naruto est vraiment inspirante.', visibility: 'PUBLIC', token: aliceToken },
  { animeId: animes['Naruto'], rating: 7, comment: 'Beaucoup de remplissage mais les arcs principaux sont excellents.', visibility: 'PUBLIC', token: bobToken },
  { animeId: animes['Naruto'], rating: 9, comment: 'Mon animé d\'enfance, impossible de ne pas l\'aimer !', visibility: 'PUBLIC', token: charlieToken },
  { animeId: animes['Attack on Titan'], rating: 10, comment: 'Chef-d\'œuvre absolu. Le scénario est brillant et les retournements de situation sont incroyables.', visibility: 'PUBLIC', token: aliceToken },
  { animeId: animes['Attack on Titan'], rating: 9.5, comment: 'La meilleure animation que j\'ai vue. Le lore est profond et la fin est courageuse.', visibility: 'PUBLIC', token: charlieToken },
  { animeId: animes['Death Note'], rating: 9, comment: 'Le duel psychologique entre Light et L est captivant du début à la fin.', visibility: 'PUBLIC', token: bobToken },
  { animeId: animes['Death Note'], rating: 8.5, comment: 'Brillant mais la fin m\'a déçue. Les 20 premiers épisodes sont parfaits.', visibility: 'PUBLIC', token: sakuraToken },
  { animeId: animes['One Piece'], rating: 9, comment: 'Un voyage épique ! La construction du monde est inégalée dans le manga.', visibility: 'PUBLIC', token: aliceToken },
  { animeId: animes['Naruto'], rating: 7.5, comment: 'Sympa mais je préfère Shippuden.', visibility: 'PRIVE', token: sakuraToken },
];

for (const r of reviewData) {
  if (!r.animeId || !r.token) continue;
  const res = await addReview(r.animeId, r.rating, r.comment, r.visibility, r.token);
  if (res.success) process.stdout.write('.');
}
console.log('\n  [OK] Avis créés');

// 7. Follows
console.log('\n6. Follows...');
if (ids.alice && ids.bob) await follow(ids.bob, aliceToken);
if (ids.alice && ids.charlie) await follow(ids.charlie, aliceToken);
if (ids.bob && ids.alice) await follow(ids.alice, bobToken);
if (ids.sakura && ids.alice) await follow(ids.alice, sakuraToken);
if (ids.charlie && ids.sakura) await follow(ids.sakura, charlieToken);
console.log('  [OK] Follows créés');

// 8. Messages privés
console.log('\n7. Conversations privées...');
if (ids.bob && aliceToken) {
  const convId = await createConversation(ids.bob, aliceToken);
  if (convId) {
    await sendMessage(convId, 'Salut Bob ! Tu as regardé le dernier épisode d\'AoT ?', aliceToken);
    await sendMessage(convId, 'Oui ! C\'était dingue non ?! La scène finale m\'a coupé le souffle.', bobToken);
    await sendMessage(convId, 'Complètement d\'accord. J\'attends la suite avec impatience !', aliceToken);
    await sendMessage(convId, 'Dis-moi quand tu auras regardé la saison 4, on pourra en parler sans spoilers 😄', bobToken);
    console.log('  [OK] Conv Alice ↔ Bob');
  }
}

if (ids.charlie && sakuraToken) {
  const convId = await createConversation(ids.charlie, sakuraToken);
  if (convId) {
    await sendMessage(convId, 'Hé Charlie, tu me recommanderais quoi comme animé à regarder ?', sakuraToken);
    await sendMessage(convId, 'Commence par Attack on Titan, c\'est un incontournable !', charlieToken);
    await sendMessage(convId, 'J\'ai vu que tu lui avais mis 9.5/10, c\'est vraiment bien ?', sakuraToken);
    await sendMessage(convId, 'C\'est au-delà du bien, c\'est une expérience. Regarde juste les 3 premiers épisodes et tu seras accrochée.', charlieToken);
    await sendMessage(convId, 'Ok je me lance ce soir alors !', sakuraToken);
    console.log('  [OK] Conv Sakura ↔ Charlie');
  }
}

if (ids.sakura && charlieToken) {
  const convId = await createConversation(ids.sakura, charlieToken);
  if (convId) {
    await sendMessage(convId, 'Alors, tu as commencé AoT ?', charlieToken);
    await sendMessage(convId, 'Oui ! Je suis à l\'épisode 5, c\'est incroyable !', sakuraToken);
    await sendMessage(convId, 'Tu vas adorer la suite, accroche-toi !', charlieToken);
    console.log('  [OK] Conv Charlie ↔ Sakura (2)');
  }
}

// 9. Messages de groupe
console.log('\n8. Messages de groupe...');
if (animes['Attack on Titan']) {
  const groupId = await joinGroup(animes['Attack on Titan'], aliceToken);
  if (groupId) {
    await joinGroup(animes['Attack on Titan'], charlieToken);
    await joinGroup(animes['Attack on Titan'], bobToken);
    await sendGroupMessage(groupId, 'Bienvenue dans le groupe AoT ! On peut discuter librement ici.', aliceToken);
    await sendGroupMessage(groupId, 'Est-ce que quelqu\'un pense que la fin était justifiée ?', charlieToken);
    await sendGroupMessage(groupId, 'Honnêtement oui, même si c\'était controversé. Isayama voulait quelque chose d\'inattendu.', aliceToken);
    await sendGroupMessage(groupId, 'Le dessin dans la saison finale était pas au niveau des saisons précédentes malheureusement.', bobToken);
    await sendGroupMessage(groupId, 'C\'est vrai mais le scénario compensait largement !', charlieToken);
    console.log('  [OK] Groupe AoT');
  }
}

if (animes['Death Note']) {
  const groupId = await joinGroup(animes['Death Note'], bobToken);
  if (groupId) {
    await joinGroup(animes['Death Note'], sakuraToken);
    await sendGroupMessage(groupId, 'Team Light ou Team L ? 🔥', bobToken);
    await sendGroupMessage(groupId, 'Team L sans hésiter ! Light est fascinant mais L est iconique.', sakuraToken);
    await sendGroupMessage(groupId, 'Les deux sont géniaux, c\'est ce qui rend le show si bon.', bobToken);
    console.log('  [OK] Groupe Death Note');
  }
}

if (animes['Naruto']) {
  const groupId = await joinGroup(animes['Naruto'], charlieToken);
  if (groupId) {
    await joinGroup(animes['Naruto'], aliceToken);
    await sendGroupMessage(groupId, 'Quel est votre arc préféré de Naruto ?', charlieToken);
    await sendGroupMessage(groupId, 'L\'arc Chunin Exams pour moi, c\'est là où tout prend son envol.', aliceToken);
    await sendGroupMessage(groupId, 'Pour moi c\'est Pain, le meilleur antagoniste du show.', charlieToken);
    console.log('  [OK] Groupe Naruto');
  }
}

console.log('\n=== Seed terminé ! ===');
console.log('\nComptes créés (mot de passe: Test1234):');
console.log('  alice@anime.com → AliceOtaku');
console.log('  bob@anime.com   → BobSenpai');
console.log('  charlie@anime.com → CharlieWeeb');
console.log('  sakura@anime.com  → SakuraChan');
