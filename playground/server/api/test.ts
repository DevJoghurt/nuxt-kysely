export default defineEventHandler(() => {
  const { db } = useDatabase()

  const query = db.selectFrom('person')
    .where('id', 'is', 1)
    .selectAll()

  return query.executeTakeFirst()
})
