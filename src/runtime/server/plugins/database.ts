import {
  defineNitroPlugin,
  useDatabase,
} from '#imports'

export default defineNitroPlugin(async (nitro) => {
  const { migrateDatabase, closeDatabase } = useDatabase()

  await migrateDatabase()

  nitro.hooks.hook('close', () => {
    closeDatabase()
  })
})
