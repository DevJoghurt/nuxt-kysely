import { Kysely } from 'kysely'

type MigrationFunction = (db: Kysely<any>) => Promise<void>

type Migration = {
	version: number
	name: string
	database?: string
	up: MigrationFunction
	down: MigrationFunction
}

export const defineMigration = (migration: Migration) => {
  return migration
}