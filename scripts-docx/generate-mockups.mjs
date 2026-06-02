import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('./mockups', { recursive: true });

const V = '#8B5CF6';   // violet primary
const V2 = '#EDE9FE';  // violet light
const DARK = '#1E1B4B';
const BG = '#F3F4F6';
const CARD = '#FFFFFF';
const TEXT = '#111827';
const TEXT2 = '#6B7280';
const TEXT3 = '#9CA3AF';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const RED = '#EF4444';
const BORDER = '#E5E7EB';

const W = 390;
const H = 844;

// ── Helpers SVG ──────────────────────────────────────────────────────────────

const rect = (x, y, w, h, fill, r = 0, stroke = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="1"` : ''}/>`;

const text = (x, y, content, opts = {}) => {
  const { size = 14, fill = TEXT, weight = 'normal', anchor = 'start', family = 'SF Pro Display, -apple-system, sans-serif' } = opts;
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" font-family="${family}">${content}</text>`;
};

const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

const pill = (x, y, w, h, fill, label, labelColor = '#fff', size = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>
   <text x="${x + w / 2}" y="${y + h / 2 + 4}" font-size="${size}" fill="${labelColor}" text-anchor="middle" font-family="SF Pro Display, sans-serif" font-weight="600">${label}</text>`;

const icon = (x, y, type) => {
  const icons = {
    home:    `<path d="M${x},${y+8} L${x+8},${y} L${x+16},${y+8} V${y+16} H${x+11} V${y+11} H${x+5} V${y+16} H${x} Z" fill="currentColor"/>`,
    search:  `<circle cx="${x+7}" cy="${y+7}" r="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="${x+11}" y1="${y+11}" x2="${x+15}" y2="${y+15}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    lib:     `<rect x="${x+1}" y="${y}" width="14" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="${x+5}" y1="${y+5}" x2="${x+11}" y2="${y+5}" stroke="currentColor" stroke-width="1.5"/><line x1="${x+5}" y1="${y+8}" x2="${x+11}" y2="${y+8}" stroke="currentColor" stroke-width="1.5"/><line x1="${x+5}" y1="${y+11}" x2="${x+9}" y2="${y+11}" stroke="currentColor" stroke-width="1.5"/>`,
    msg:     `<path d="M${x+1},${y+2} Q${x+1},${y} ${x+3},${y} H${x+13} Q${x+15},${y} ${x+15},${y+2} V${y+9} Q${x+15},${y+11} ${x+13},${y+11} H${x+6} L${x+2},${y+15} V${y+11} H${x+3} Q${x+1},${y+11} ${x+1},${y+9} Z" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
    user:    `<circle cx="${x+8}" cy="${y+5}" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M${x+1},${y+16} Q${x+1},${y+11} ${x+8},${y+11} Q${x+15},${y+11} ${x+15},${y+16}" fill="none" stroke="currentColor" stroke-width="2"/>`,
    back:    `<path d="M${x+11},${y+2} L${x+4},${y+8} L${x+11},${y+14}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    star:    `<polygon points="${x+8},${y+1} ${x+10},${y+6} ${x+15},${y+6} ${x+11},${y+9} ${x+13},${y+14} ${x+8},${y+11} ${x+3},${y+14} ${x+5},${y+9} ${x+1},${y+6} ${x+6},${y+6}" fill="currentColor"/>`,
    heart:   `<path d="M${x+8},${y+14} C${x+2},${y+9} ${x},${y+6} ${x+2},${y+3} C${x+4},${y} ${x+7},${y} ${x+8},${y+3} C${x+9},${y} ${x+12},${y} ${x+14},${y+3} C${x+16},${y+6} ${x+14},${y+9} ${x+8},${y+14}Z" fill="currentColor"/>`,
    send:    `<path d="M${x+14},${y+8} L${x+2},${y+4} L${x+5},${y+8} L${x+2},${y+12} Z" fill="currentColor"/><line x1="${x+5}" y1="${y+8}" x2="${x+14}" y2="${y+8}" stroke="currentColor" stroke-width="1.5"/>`,
    plus:    `<line x1="${x+8}" y1="${y+2}" x2="${x+8}" y2="${y+14}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="${x+2}" y1="${y+8}" x2="${x+14}" y2="${y+8}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`,
  };
  return icons[type] || '';
};

// ── Composants communs ────────────────────────────────────────────────────────

const phoneFrame = (content, screenBg = BG) => `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond écran -->
  ${rect(0, 0, W, H, screenBg, 44)}
  <!-- Barre de statut -->
  ${rect(0, 0, W, 44, 'rgba(0,0,0,0.03)', 0)}
  ${text(20, 28, '9:41', { size: 13, weight: '600', fill: TEXT })}
  ${text(W - 20, 28, '●●● ☁ 🔋', { size: 11, fill: TEXT2, anchor: 'end' })}
  <!-- Contenu -->
  ${content}
  <!-- Barre de navigation -->
  ${rect(0, H - 80, W, 80, CARD)}
  ${rect(0, H - 80, W, 1, BORDER)}
  <!-- Indicateur home -->
  ${rect(W/2 - 60, H - 8, 120, 4, '#000', 2)}
</svg>`;

const bottomNav = (active = 0) => {
  const tabs = [
    { label: 'Accueil', icon: 'home' },
    { label: 'Recherche', icon: 'search' },
    { label: 'Biblio', icon: 'lib' },
    { label: 'Messages', icon: 'msg' },
    { label: 'Profil', icon: 'user' },
  ];
  const tw = W / 5;
  return tabs.map((t, i) => {
    const cx = tw * i + tw / 2;
    const color = i === active ? V : TEXT3;
    return `<g color="${color}">
      ${icon(cx - 8, H - 68, t.icon)}
      ${text(cx, H - 46, t.label, { size: 9, fill: color, anchor: 'middle', weight: i === active ? '600' : 'normal' })}
    </g>`;
  }).join('');
};

const inputField = (x, y, w, h, placeholder, value = '') =>
  `${rect(x, y, w, h, CARD, 10, BORDER)}
   ${text(x + 14, y + h / 2 + 5, value || placeholder, { size: 13, fill: value ? TEXT : TEXT3 })}`;

const animeCard = (x, y, title, score, color = V) =>
  `${rect(x, y, 100, 140, CARD, 12)}
   ${rect(x, y, 100, 100, color, 12)}
   ${rect(x, y + 88, 100, 12, color, 0)}
   ${text(x + 50, y + 55, '▶', { size: 22, fill: 'rgba(255,255,255,0.4)', anchor: 'middle' })}
   ${text(x + 8, y + 115, title, { size: 10, fill: TEXT, weight: '600' })}
   ${text(x + 8, y + 130, '★ ' + score, { size: 9, fill: TEXT2 })}`;

const msgBubble = (x, y, msg, isMe = false, w = 160) => {
  const bx = isMe ? W - 20 - w : 20;
  return `${rect(bx, y, w, 36, isMe ? V : CARD, isMe ? '14 14 4 14' : '14 14 14 4')}
   ${text(bx + 12, y + 22, msg, { size: 12, fill: isMe ? '#fff' : TEXT })}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN 1 — LOGIN
// ─────────────────────────────────────────────────────────────────────────────

const screen1 = phoneFrame(`
  ${rect(0, 44, W, H - 44, '#fff')}

  <!-- Logo -->
  ${circle(W/2, 160, 40, V2)}
  ${text(W/2, 154, '▶', { size: 28, fill: V, anchor: 'middle' })}
  ${text(W/2, 175, 'AT', { size: 12, fill: V, anchor: 'middle', weight: '700' })}
  ${text(W/2, 220, 'AnimeTracker', { size: 22, fill: DARK, anchor: 'middle', weight: '700' })}
  ${text(W/2, 245, 'Bienvenue !', { size: 14, fill: TEXT2, anchor: 'middle' })}

  <!-- Champs -->
  ${text(30, 290, 'Email', { size: 12, fill: TEXT2, weight: '600' })}
  ${inputField(20, 300, W - 40, 48, 'votre@email.com')}

  ${text(30, 375, 'Mot de passe', { size: 12, fill: TEXT2, weight: '600' })}
  ${inputField(20, 385, W - 40, 48, '••••••••')}
  ${text(W - 30, 415, '👁', { size: 16, anchor: 'end' })}

  ${text(W - 22, 455, 'Mot de passe oublié ?', { size: 12, fill: V, anchor: 'end' })}

  <!-- Bouton login -->
  ${rect(20, 475, W - 40, 50, V, 12)}
  ${text(W/2, 505, 'Se connecter', { size: 16, fill: '#fff', anchor: 'middle', weight: '600' })}

  <!-- Séparateur -->
  ${rect(20, 545, W/2 - 40, 1, BORDER)}
  ${text(W/2, 550, 'ou', { size: 12, fill: TEXT3, anchor: 'middle' })}
  ${rect(W/2 + 20, 545, W/2 - 40, 1, BORDER)}

  ${text(W/2, 590, 'Pas encore de compte ?', { size: 13, fill: TEXT2, anchor: 'middle' })}
  ${text(W/2, 615, "S'inscrire", { size: 14, fill: V, anchor: 'middle', weight: '700' })}
`, '#fff');

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN 2 — HOME
// ─────────────────────────────────────────────────────────────────────────────

const screen2 = phoneFrame(`
  <!-- Header -->
  ${rect(0, 44, W, 60, CARD)}
  ${text(20, 82, 'AnimeTracker', { size: 18, fill: DARK, weight: '700' })}
  ${rect(W - 60, 58, 32, 32, V2, 16)}
  ${text(W - 44, 79, '🔔', { size: 14, anchor: 'middle' })}
  ${rect(W - 24, 54, 8, 8, RED, 4)}

  <!-- Search bar -->
  ${rect(16, 116, W - 32, 40, BG, 20)}
  ${text(36, 141, '🔍', { size: 13, fill: TEXT3 })}
  ${text(56, 141, 'Rechercher un animé...', { size: 13, fill: TEXT3 })}

  <!-- Section nouveaux épisodes -->
  ${text(16, 178, 'Nouveaux épisodes', { size: 14, fill: TEXT, weight: '700' })}
  ${text(W - 16, 178, 'Voir tout →', { size: 12, fill: V, anchor: 'end' })}
  ${animeCard(16, 190, 'One Piece', '9.0', '#4F46E5')}
  ${animeCard(126, 190, 'Demon Slayer', '8.7', '#DC2626')}
  ${animeCard(236, 190, 'Jujutsu K.', '8.8', '#059669')}
  ${animeCard(346, 190, 'AoT', '9.1', '#D97706')}

  <!-- Section populaires -->
  ${text(16, 352, 'Populaires cette semaine', { size: 14, fill: TEXT, weight: '700' })}
  ${text(W - 16, 352, 'Voir tout →', { size: 12, fill: V, anchor: 'end' })}
  ${animeCard(16, 364, 'Naruto', '8.5', '#7C3AED')}
  ${animeCard(126, 364, 'HxH', '9.1', '#0891B2')}
  ${animeCard(236, 364, 'Bleach', '8.2', '#BE185D')}
  ${animeCard(346, 364, 'FMA:B', '9.4', '#92400E')}

  <!-- Section pour vous -->
  ${text(16, 525, 'Recommandations', { size: 14, fill: TEXT, weight: '700' })}
  ${animeCard(16, 537, 'Vinland Saga', '9.0', '#065F46')}
  ${animeCard(126, 537, 'Mob Psycho', '8.9', '#5B21B6')}

  ${bottomNav(0)}
`, BG);

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN 3 — ANIME DETAIL
// ─────────────────────────────────────────────────────────────────────────────

const screen3 = phoneFrame(`
  <!-- Cover image -->
  ${rect(0, 44, W, 220, '#4F46E5')}
  ${text(W/2, 154, 'One Piece', { size: 28, fill: 'rgba(255,255,255,0.15)', anchor: 'middle', weight: '700' })}
  ${text(W/2, 200, '▶', { size: 48, fill: 'rgba(255,255,255,0.3)', anchor: 'middle' })}
  <!-- Back button -->
  ${rect(12, 54, 36, 36, 'rgba(0,0,0,0.35)', 18)}
  <g color="white">${icon(20, 62, 'back')}</g>

  <!-- Info principale -->
  ${rect(0, 252, W, H - 252, CARD)}
  ${text(16, 290, 'One Piece', { size: 22, fill: DARK, weight: '700' })}
  ${text(16, 314, '★ 9.0 / 10', { size: 14, fill: ORANGE, weight: '600' })}
  ${text(100, 314, '(1 250 avis)', { size: 12, fill: TEXT3 })}

  <!-- Genres -->
  ${pill(16, 324, 72, 24, V2, 'Shōnen', V)}
  ${pill(96, 324, 80, 24, V2, 'Adventure', V)}
  ${pill(184, 324, 66, 24, V2, 'Fantasy', V)}

  ${text(16, 374, '1997  •  1100 épisodes  •  En cours', { size: 12, fill: TEXT2 })}

  <!-- Bouton ajouter -->
  ${rect(16, 390, W - 32, 46, V, 12)}
  ${text(W/2, 418, '+ Ajouter à ma bibliothèque', { size: 14, fill: '#fff', anchor: 'middle', weight: '600' })}

  <!-- Synopsis -->
  ${text(16, 460, 'Synopsis', { size: 14, fill: TEXT, weight: '700' })}
  ${text(16, 482, 'Monkey D. Luffy rêve de devenir le roi des pirates', { size: 12, fill: TEXT2 })}
  ${text(16, 500, 'en trouvant le trésor légendaire One Piece...', { size: 12, fill: TEXT2 })}
  ${text(16, 518, 'Lire la suite', { size: 12, fill: V })}

  <!-- Tabs -->
  ${rect(0, 538, W, 40, CARD)}
  ${rect(0, 578, W, 1, BORDER)}
  ${text(65, 563, 'Infos', { size: 14, fill: V, weight: '700', anchor: 'middle' })}
  ${rect(16, 576, 98, 2, V)}
  ${text(195, 563, 'Avis', { size: 14, fill: TEXT2, anchor: 'middle' })}
  ${text(325, 563, 'Groupes', { size: 14, fill: TEXT2, anchor: 'middle' })}

  <!-- Infos tab -->
  ${text(16, 612, 'Studio', { size: 12, fill: TEXT3, weight: '600' })}
  ${text(120, 612, 'Toei Animation', { size: 12, fill: TEXT })}
  ${text(16, 636, 'Diffusion', { size: 12, fill: TEXT3, weight: '600' })}
  ${text(120, 636, 'Oct. 1999 — En cours', { size: 12, fill: TEXT })}
  ${text(16, 660, 'Source', { size: 12, fill: TEXT3, weight: '600' })}
  ${text(120, 660, 'Manga', { size: 12, fill: TEXT })}
  ${text(16, 684, 'Épisodes', { size: 12, fill: TEXT3, weight: '600' })}
  ${text(120, 684, '1 100 (en cours)', { size: 12, fill: TEXT })}

  ${bottomNav(1)}
`, '#fff');

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN 4 — BIBLIOTHÈQUE
// ─────────────────────────────────────────────────────────────────────────────

const libCard = (y, title, ep, total, pct, statusColor, statusLabel) => {
  const pw = Math.round((W - 100) * pct);
  return `
  ${rect(16, y, W - 32, 100, CARD, 14)}
  ${rect(24, y + 10, 64, 80, BG, 8)}
  ${text(56, y + 56, '▶', { size: 22, fill: TEXT3, anchor: 'middle' })}
  ${text(100, y + 30, title, { size: 14, fill: TEXT, weight: '700' })}
  ${pill(100, y + 42, 72, 20, statusColor + '22', statusLabel, statusColor, 11)}
  ${text(100, y + 76, ep + ' / ' + total + ' épisodes', { size: 11, fill: TEXT2 })}
  ${rect(100, y + 88, W - 116, 6, BG, 3)}
  ${rect(100, y + 88, pw, 6, statusColor, 3)}
  ${text(W - 24, y + 36, '⋮', { size: 18, fill: TEXT3, anchor: 'end' })}`;
};

const screen4 = phoneFrame(`
  <!-- Header -->
  ${rect(0, 44, W, 56, CARD)}
  ${text(16, 80, 'Ma bibliothèque', { size: 18, fill: DARK, weight: '700' })}

  <!-- Tabs statut -->
  ${rect(0, 100, W, 44, CARD)}
  ${rect(0, 143, W, 1, BORDER)}
  ${pill(12, 108, 70, 28, V, 'En cours', '#fff')}
  ${text(96, 126, 'À voir', { size: 13, fill: TEXT2, anchor: 'middle' })}
  ${text(170, 126, 'Terminés', { size: 13, fill: TEXT2, anchor: 'middle' })}
  ${text(252, 126, 'Abandonnés', { size: 13, fill: TEXT2, anchor: 'middle' })}

  ${text(16, 172, 'En cours (4)', { size: 13, fill: TEXT2, weight: '600' })}

  ${libCard(185, 'Attack on Titan', 24, 25, 0.96, V, 'En cours')}
  ${libCard(298, 'Demon Slayer', 18, 26, 0.69, V, 'En cours')}
  ${libCard(411, 'Jujutsu Kaisen', 23, 24, 0.96, V, 'En cours')}
  ${libCard(524, 'One Punch Man', 8, 12, 0.67, V, 'En cours')}

  ${bottomNav(2)}
`, BG);

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRAN 5 — CHAT
// ─────────────────────────────────────────────────────────────────────────────

const screen5 = phoneFrame(`
  <!-- Header -->
  ${rect(0, 44, W, 60, CARD)}
  ${rect(0, 104, W, 1, BORDER)}
  <g color="${TEXT}">${icon(14, 60, 'back')}</g>
  ${circle(52, 74, 18, V2)}
  ${text(52, 79, 'K', { size: 14, fill: V, weight: '700', anchor: 'middle' })}
  ${text(78, 68, 'Kira_fan42', { size: 15, fill: TEXT, weight: '600' })}
  ${text(78, 88, 'Vu il y a 2h', { size: 11, fill: GREEN })}
  ${text(W - 16, 78, '⋮', { size: 20, fill: TEXT2, anchor: 'end' })}

  <!-- Séparateur date -->
  ${rect(80, 124, W - 160, 1, BORDER)}
  ${text(W/2, 120, 'Hier', { size: 11, fill: TEXT3, anchor: 'middle' })}
  ${rect(W - 80, 124, W - 160, 1, BORDER)}

  <!-- Messages -->
  ${msgBubble(20, 136, 'Salut ! T\'as vu le dernier épisode ?', false, 200)}
  ${text(228, 184, '10:32', { size: 10, fill: TEXT3 })}

  ${msgBubble(20, 205, 'Oui ! Incroyable ce twist 🔥', true, 175)}
  ${text(W - 203, 253, '10:35  ✓✓', { size: 10, fill: TEXT3 })}

  ${msgBubble(20, 276, 'Le combat était dingue aussi', false, 190)}
  ${text(218, 324, '10:37', { size: 10, fill: TEXT3 })}

  <!-- Séparateur date aujourd'hui -->
  ${rect(80, 345, 80, 1, BORDER)}
  ${text(W/2, 342, "Aujourd'hui", { size: 11, fill: TEXT3, anchor: 'middle' })}
  ${rect(W - 160, 345, 80, 1, BORDER)}

  ${msgBubble(20, 360, 'Tu recommandes quoi ensuite ?', true, 205)}
  ${text(W - 233, 408, '15:20  ✓', { size: 10, fill: TEXT3 })}

  ${msgBubble(20, 428, 'Vinland Saga absolument !', false, 185)}
  ${text(213, 476, '15:22', { size: 10, fill: TEXT3 })}

  ${msgBubble(20, 495, "C'est dans ma liste depuis longtemp", true, 220)}
  ${text(W - 248, 543, '15:23  ✓✓', { size: 10, fill: TEXT3 })}

  <!-- Indicateur frappe -->
  ${rect(20, 565, 70, 30, CARD, 15)}
  ${circle(34, 580, 4, TEXT3)}
  ${circle(45, 580, 4, TEXT3)}
  ${circle(56, 580, 4, TEXT3)}

  <!-- Input -->
  ${rect(0, 700, W, 64, CARD)}
  ${rect(0, 700, W, 1, BORDER)}
  ${rect(16, 712, W - 80, 40, BG, 20)}
  ${text(30, 736, 'Écrire un message...', { size: 13, fill: TEXT3 })}
  ${rect(W - 56, 712, 40, 40, V, 20)}
  <g color="white">${icon(W - 48, 720, 'send')}</g>

  ${bottomNav(3)}
`, BG);

// ─────────────────────────────────────────────────────────────────────────────
// ÉCRITURE DES FICHIERS
// ─────────────────────────────────────────────────────────────────────────────

const screens = [
  { name: 'mockup-01-login',     svg: screen1, label: 'Écran de connexion' },
  { name: 'mockup-02-home',      svg: screen2, label: 'Accueil' },
  { name: 'mockup-03-detail',    svg: screen3, label: 'Fiche animé' },
  { name: 'mockup-04-library',   svg: screen4, label: 'Bibliothèque' },
  { name: 'mockup-05-chat',      svg: screen5, label: 'Chat privé' },
];

screens.forEach(s => {
  writeFileSync(`./mockups/${s.name}.svg`, s.svg);
  console.log(`✅ ${s.name}.svg`);
});

// HTML de prévisualisation
const preview = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Maquettes AnimeTracker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f1f5f9; font-family: -apple-system, sans-serif; padding: 40px 20px; }
    h1 { text-align: center; color: #1E1B4B; margin-bottom: 8px; font-size: 28px; }
    p  { text-align: center; color: #6B7280; margin-bottom: 40px; }
    .grid { display: flex; flex-wrap: wrap; gap: 32px; justify-content: center; }
    .card { background: white; border-radius: 20px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; }
    .card h3 { color: #1E1B4B; margin-top: 16px; font-size: 15px; }
    .card img { border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); width: 260px; }
  </style>
</head>
<body>
  <h1>Maquettes AnimeTracker</h1>
  <p>Aperçu des 5 écrans principaux — cliquer pour agrandir</p>
  <div class="grid">
    ${screens.map(s => `
    <div class="card">
      <a href="${s.name}.svg" target="_blank">
        <img src="${s.name}.svg" alt="${s.label}"/>
      </a>
      <h3>${s.label}</h3>
    </div>`).join('')}
  </div>
</body>
</html>`;

writeFileSync('./mockups/preview.html', preview);
console.log('\n✅ Prévisualisation : ouvre scripts-docx/mockups/preview.html dans ton navigateur');
