// Script to delete the SQLite database file for LuxeStore
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'luxe_store.db');

fs.unlink(dbPath, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log('Database file does not exist.');
    } else {
      console.error('Error deleting database:', err);
    }
  } else {
    console.log('Database file deleted successfully.');
  }
});
