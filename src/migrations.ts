import { globby } from 'globby'
import { addTemplate } from '@nuxt/kit'
import { basename, extname, join } from 'pathe'

type MigrationFile = {
	name: string
	ext: string
	file: string
}

async function getMigrationFiles(cwd: string, dir: string) {
	const migrationFiles = [] as MigrationFile[]
	const files = await globby(`server/${dir}/migrations/**/*.{ts,js,mjs}`, {
		cwd: cwd,
		deep: 2,
	})
	let count = 0
	for(const file of files) {
		const name = basename(file, extname(file)).replace(/[\W\d]+/g, '')
		migrationFiles.push({
			name: `${name}_${count}`,
			ext: extname(file),
			file: file
		})
		count++
	}
	return migrationFiles
}

const importFiles = (migrationFiles: MigrationFile[], cwd: string = 'file') =>
	migrationFiles
	  .map(
		migrationFile => `import ${migrationFile.name} from '${join(cwd, migrationFile.file.replace(migrationFile.ext, ''))}';`,
	  ).join('\n')

  export const createDatabaseMigrationComposable = async (
	cwd: string,
	dir: string,
  ) => {
	const migrationFiles = await getMigrationFiles(cwd, dir)

	const databaseMigrationComposable = `
  	${importFiles(migrationFiles, cwd)}
  	import { Migration, MigrationProvider } from 'kysely'

  	const migrations = [${migrationFiles.map(migrationFile => migrationFile.name).join(', ')}];

	class FileMigrationProvider implements MigrationProvider {
		readonly database: string;

		constructor(database: string) {
    		this.database = database;
  		}

		async getMigrations(): Promise<Record<string, Migration>> {
			const transformedMigrations = {};
			migrations.filter(migration => migration.database === this.database || !migration.database).sort((a,b) => a.version - b.version).forEach(migration => {
				transformedMigrations[migration.name] = {
					up: migration.up,
					down: migration.down,
				};
  			});
			return transformedMigrations;
		}
	}

	export const useDatabaseMigrations = () => {
		const countMigrations = (database: string) => {
			let count = 0;
			for(const migration of migrations) {
				if(migration?.database && (migration.database === database)) {
					count++;
				}else if(!migration?.database && database === 'default') {
					count++;
				}
			}
			return count;
		};

		const getMigrationProvider = (database: string) => {
			return new FileMigrationProvider('default') ;
		};

		return {
			countMigrations,
			getMigrationProvider
		};
	};
  `

	addTemplate({
	  filename: 'database-migration-composable.ts',
	  write: true,
	  getContents: () => databaseMigrationComposable,
	})
  }
