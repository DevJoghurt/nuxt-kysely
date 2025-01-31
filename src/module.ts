import {
  defineNuxtModule,
  addServerImports,
  createResolver,
  addServerScanDir
} from '@nuxt/kit'
import { createDatabaseMigrationComposable } from './migrations'
import { join } from 'pathe'

// Module options TypeScript interface definition
export interface ModuleOptions {
  dir: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-kysely',
    configKey: 'kysely',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    dir: 'database'
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addServerScanDir(resolver.resolve('./runtime/server'))

    _nuxt.options.runtimeConfig = _nuxt.options.runtimeConfig || {};
		_nuxt.options.runtimeConfig.database = {
			file: join(_nuxt.options.srcDir, `.data/default.sqlite`),
		};

    await createDatabaseMigrationComposable(_nuxt.options.srcDir, _options.dir)

    // add migrations composable
    addServerImports([{
      name: 'useDatabaseMigrations',
      as: '$useDatabaseMigrations',
      from: resolver.resolve(_nuxt.options.buildDir, 'database-migration-composable'),
    }])

  },
})
