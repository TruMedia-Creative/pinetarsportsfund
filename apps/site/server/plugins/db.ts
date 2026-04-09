import { initDatabase, setDatabasePath } from '../utils/db'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()
  const dbPath = (config.database as any)?.path || './data/app.sqlite.bin'

  // Set the database path
  setDatabasePath(dbPath)

  // Initialize database tables
  initDatabase()

  console.log(`Database initialized at ${dbPath}`)
})

