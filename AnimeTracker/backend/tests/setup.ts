// Variables d'environnement pour les tests — chargées avant les imports
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3001';
process.env['POSTGRES_HOST'] = 'localhost';
process.env['POSTGRES_PORT'] = '5432';
process.env['POSTGRES_DB'] = 'animetracker_test';
process.env['POSTGRES_USER'] = 'animetracker_user';
process.env['POSTGRES_PASSWORD'] = 'animetracker_dev_password';
process.env['REDIS_HOST'] = 'localhost';
process.env['REDIS_PORT'] = '6379';
process.env['JWT_SECRET'] = 'test-secret-min-32-chars-long-ok!';
process.env['JWT_EXPIRES_IN'] = '1h';
process.env['JIKAN_API_URL'] = 'https://api.jikan.moe/v4';
