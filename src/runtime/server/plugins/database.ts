import { consola } from 'consola'
import {
  Kysely,
  Migrator,
  SqliteDialect
} from 'kysely'
import {
  useRuntimeConfig,
  defineNitroPlugin,
  $useDatabaseMigrations,
} from '#imports'
import { dirname } from "pathe";
import { mkdirSync } from "node:fs";
import SQLite from 'better-sqlite3';

export default defineNitroPlugin(async (nitro) => {
  const { database } = useRuntimeConfig();

  mkdirSync(dirname(database.file), { recursive: true });

  const { countMigrations, getMigrationProvider } = $useDatabaseMigrations()

  const dialect = new SqliteDialect({
    database: new SQLite(database.file),
  })

  const db = new Kysely<any>({
    dialect,
  })

  consola.info(`Found ${countMigrations('default')} database migrations`)

  const provider = getMigrationProvider('default')

  const migrator = new Migrator({
    db,
    provider
  })

  const { error, results } = await migrator.migrateToLatest()

  for (const it of results) {
    if (it.status === 'Success') {
      consola.success(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      consola.error(`failed to execute migration "${it.migrationName}"`)
    }
  }
})