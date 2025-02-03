import { mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import {
  Kysely,
  Migrator,
} from 'kysely'
import { createClient, type Client } from '@libsql/client'
import { dirname } from 'pathe'
import { consola } from 'consola'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import {
  useRuntimeConfig,
  $useDatabaseMigrations,
  type KyselyGeneratedDB,
} from '#imports'

export const useDatabase = () => {
  let _db: Kysely<KyselyGeneratedDB> | null = null
  let client: Client | null = null

  const createDatabase = () => {
    const { database } = useRuntimeConfig()
    mkdirSync(dirname(database.file), { recursive: true })

    client = createClient({
      url: pathToFileURL(database.file).toString(),
    })

    _db = new Kysely<KyselyGeneratedDB>({
      dialect: new LibsqlDialect({
        client: client,
      }),
    })

    return _db
  }

  const migrateDatabase = async () => {
    const { getMigrationProvider } = $useDatabaseMigrations()
    const provider = getMigrationProvider('default')

    const migrator = new Migrator({
      db: _db as Kysely<KyselyGeneratedDB>,
      provider,
    })

    const { error, results } = await migrator.migrateToLatest()

    if (error) {
      consola.error('failed to execute migrations')
      consola.error(error)
    }

    for (const it of results || []) {
      if (it.status === 'Success') {
        consola.success(`migration "${it.migrationName}" was executed successfully`)
      }
      else if (it.status === 'Error') {
        consola.error(`failed to execute migration "${it.migrationName}"`)
      }
    }
  }

  const closeDatabase = () => {
    if (client) {
      client.close()
      client = null
      _db = null
    }
  }

  if (!_db) {
    _db = createDatabase()
  }

  return {
    db: _db,
    migrateDatabase,
    closeDatabase,
    createDatabase,
  }
}
