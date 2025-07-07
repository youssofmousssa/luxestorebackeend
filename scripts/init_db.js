// Script to initialize the LuxeStore database and tables
import { getDb } from '../services/sqliteClient.js';

(async () => {
  try {
    await getDb();
    console.log('Database and tables initialized.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();
