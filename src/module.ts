import {
  defineNuxtModule,
  addServerImports,
  createResolver,
  addServerScanDir,
} from '@nuxt/kit'
import { join } from 'pathe'
import { createDatabaseMigrationComposable, generateDatabaseTypes } from './migrations'

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
    dir: 'database',
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    addServerScanDir(resolver.resolve('./runtime/server'))

    _nuxt.options.runtimeConfig = _nuxt.options.runtimeConfig || {}
    _nuxt.options.runtimeConfig.database = {
      file: join(_nuxt.options.rootDir, `.data/default.sqlite`),
    }

    await createDatabaseMigrationComposable(_nuxt.options.serverDir, _options.dir)

    // create database types
    const generatedTypesPath = resolver.resolve(_nuxt.options.buildDir, 'types', 'kysely-generated.d.ts')
    await generateDatabaseTypes({
      url: _nuxt.options.runtimeConfig.database.file,
      outFile: generatedTypesPath,
    })

    // add migrations composable
    addServerImports([{
      name: 'useDatabaseMigrations',
      as: '$useDatabaseMigrations',
      from: resolver.resolve(_nuxt.options.buildDir, 'database-migration'),
    }, {
      name: 'DB',
      as: 'KyselyGeneratedDB',
      from: resolver.resolve(_nuxt.options.buildDir, 'types', 'kysely-generated'),
      type: true
    }])

    /*
    _nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#kysely/database'] = resolver.resolve(_nuxt.options.buildDir, 'types', 'kysely-database')
    })

    _nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: typesOutPath })
    })
      */
  },
})
