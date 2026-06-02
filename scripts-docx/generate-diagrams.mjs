import { deflateRaw } from 'zlib';
import { promisify } from 'util';
import https from 'https';
import { writeFileSync, mkdirSync } from 'fs';

const deflateRawAsync = promisify(deflateRaw);

// Encodage PlantUML (base64 maison)
function encodePlantUML(data) {
  const alpha = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  let result = '';
  for (let i = 0; i < data.length; i += 3) {
    const b0 = data[i];
    const b1 = i + 1 < data.length ? data[i + 1] : 0;
    const b2 = i + 2 < data.length ? data[i + 2] : 0;
    result += alpha[b0 >> 2];
    result += alpha[((b0 & 0x3) << 4) | (b1 >> 4)];
    result += alpha[((b1 & 0xF) << 2) | (b2 >> 6)];
    result += alpha[b2 & 0x3F];
  }
  return result;
}

async function generateDiagram(umlText, filepath) {
  const compressed = await deflateRawAsync(Buffer.from(umlText, 'utf-8'));
  const encoded = encodePlantUML(compressed);
  const url = `https://www.plantuml.com/plantuml/png/${encoded}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} pour ${filepath}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        writeFileSync(filepath, Buffer.concat(chunks));
        console.log(`✅ ${filepath}`);
        resolve();
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

mkdirSync('./diagrams', { recursive: true });

const diagrams = [

  // ── 1. Cas d'utilisation ──────────────────────────────────────────────────
  {
    file: './diagrams/uml-cas-utilisation.png',
    uml: `
@startuml
skinparam backgroundColor #FFFFFF
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #F5F3FF
  BorderColor #8B5CF6
  FontSize 13
}
skinparam actor {
  BackgroundColor #EDE9FE
  BorderColor #7C3AED
}
left to right direction

actor "Visiteur" as V
actor "Utilisateur" as U #EDE9FE
actor "Jikan API" as J #E0F2FE

rectangle "AnimeTracker" {
  usecase "S'inscrire" as UC1
  usecase "Se connecter" as UC2
  usecase "Rechercher un animé" as UC3
  usecase "Gérer sa bibliothèque" as UC4
  usecase "Rédiger un avis" as UC5
  usecase "Messagerie privée" as UC6
  usecase "Groupes de discussion" as UC7
  usecase "Suivre un utilisateur" as UC8
  usecase "Consulter son profil" as UC9
}

V --> UC1
V --> UC2
V --> UC3
U --> UC3
U --> UC4
U --> UC5
U --> UC6
U --> UC7
U --> UC8
U --> UC9
UC3 ..> J : <<uses>>
UC4 ..> J : <<uses>>
@enduml`,
  },

  // ── 2. Séquence — Login ───────────────────────────────────────────────────
  {
    file: './diagrams/uml-seq-login.png',
    uml: `
@startuml
skinparam backgroundColor #FFFFFF
skinparam sequenceArrowThickness 2
skinparam roundcorner 8
skinparam sequenceParticipant underline
skinparam participant {
  BackgroundColor #F5F3FF
  BorderColor #8B5CF6
}
skinparam database {
  BackgroundColor #EDE9FE
  BorderColor #7C3AED
}

actor "App mobile" as App
participant "Express\\nBackend" as Back
database "PostgreSQL" as DB
database "Redis" as R

App -> Back : POST /auth/login\\n{ email, password }
activate Back
Back -> Back : Validation Zod
Back -> DB : SELECT * FROM users\\nWHERE email = ?
DB --> Back : user row
Back -> Back : bcrypt.compare(pwd, hash)
Back -> R : GET blacklist:{token}\\n→ absent
Back -> Back : jwt.sign({ userId, role })\\nexpiresIn: 7j
Back --> App : 200 OK\\n{ token, user }
deactivate Back
App -> App : SecureStore.set(\\n  "auth_token", token\\n)
@enduml`,
  },

  // ── 3. Séquence — Ajout bibliothèque ─────────────────────────────────────
  {
    file: './diagrams/uml-seq-bibliotheque.png',
    uml: `
@startuml
skinparam backgroundColor #FFFFFF
skinparam sequenceArrowThickness 2
skinparam roundcorner 8
skinparam participant {
  BackgroundColor #F5F3FF
  BorderColor #8B5CF6
}
skinparam database {
  BackgroundColor #EDE9FE
  BorderColor #7C3AED
}

actor "App mobile" as App
participant "Jikan API" as Jikan #E0F2FE
participant "Backend" as Back
database "PostgreSQL" as DB

App -> Jikan : GET /anime/:id
Jikan --> App : { title, episodes,\\n  synopsis, image... }

App -> Back : POST /animes/:id/library\\n{ status, animeTitle, episodes }
activate Back
Back -> Back : authenticate(JWT)
Back -> DB : UPSERT user_anime\\n( id_user, id_anime,\\n  status, current_episode )
DB --> Back : userAnime row
Back --> App : 201 Created { userAnime }
deactivate Back
App -> App : dispatch(addToLibrary)\\nMise à jour du store Redux
@enduml`,
  },

  // ── 4. Séquence — Envoi message ───────────────────────────────────────────
  {
    file: './diagrams/uml-seq-message.png',
    uml: `
@startuml
skinparam backgroundColor #FFFFFF
skinparam sequenceArrowThickness 2
skinparam roundcorner 8
skinparam participant {
  BackgroundColor #F5F3FF
  BorderColor #8B5CF6
}
skinparam database {
  BackgroundColor #EDE9FE
  BorderColor #7C3AED
}

actor "Expéditeur" as App
participant "Backend" as Back
database "PostgreSQL" as DB
actor "Destinataire" as Dest

App -> Back : POST /conversations/:id/messages\\n{ content }
activate Back
Back -> Back : authenticate(JWT)
Back -> DB : SELECT participants\\nWHERE id_conversation = ?
DB --> Back : [user1, user2]
Back -> Back : Vérifier que l'expéditeur\\nest bien participant
Back -> DB : INSERT INTO messages\\n{ id_conversation, id_sender,\\n  content, created_at }
DB --> Back : message row
Back --> App : 201 Created { message }
deactivate Back
App -> App : dispatch(addMessage)\\nAffichage immédiat

note over Dest : Le destinataire voit le message\\nau prochain chargement de l'écran
@enduml`,
  },

  // ── 5. Diagramme de classes ───────────────────────────────────────────────
  {
    file: './diagrams/uml-classes.png',
    uml: `
@startuml
skinparam backgroundColor #FFFFFF
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #F5F3FF
  BorderColor #8B5CF6
  HeaderBackgroundColor #8B5CF6
  HeaderFontColor #FFFFFF
  FontSize 12
}
skinparam roundcorner 8

class User {
  +id : UUID
  +email : string
  +pseudo : string
  +role : USER | MODERATEUR | ADMIN
  +avatar : integer
  --
  +register()
  +login() : JWT
  +logout()
  +updateProfile()
  +getStatistics()
}

class UserAnime {
  +status : A_VOIR | EN_COURS\\n        | TERMINE | ABANDONNE
  +currentEpisode : integer
  +totalEpisodes : integer
  +isFavorite : boolean
  --
  +updateProgress()
  +updateStatus()
}

class Review {
  +rating : decimal (0-10)
  +comment : string
  +visibility : PUBLIC | PRIVE
  +likesCount : integer
  --
  +create()
  +update()
  +toggleVisibility()
}

class Follow {
  +createdAt : Date
}

class Conversation {
  +createdAt : Date
  --
  +getLastMessage()
}

class Message {
  +content : string
  +isRead : boolean
  +createdAt : Date
}

class Group {
  +name : string
  +type : OFFICIEL | PRIVE
  +memberCount : integer
  --
  +addMember()
  +removeMember()
}

class GroupMessage {
  +content : string
  +createdAt : Date
  +deletedAt : Date
}

User "1" *-- "0..*" UserAnime : possède
User "1" *-- "0..*" Review : rédige
User "1" *-- "0..*" Follow : follower >
User "1" *-- "0..*" Follow : following >
User "0..*" o-- "0..*" Conversation : participe
Conversation "1" *-- "0..*" Message : contient
User "1" *-- "0..*" Message : envoie
User "0..*" o-- "0..*" Group : membre
Group "1" *-- "0..*" GroupMessage : contient
@enduml`,
  },
];

// Génération séquentielle (respect rate limit API)
for (const d of diagrams) {
  await generateDiagram(d.uml, d.file);
  await new Promise(r => setTimeout(r, 800));
}

console.log('\n✅ Tous les diagrammes sont générés dans ./diagrams/');
