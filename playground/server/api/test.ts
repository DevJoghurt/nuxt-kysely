export default defineEventHandler(() => {
  const { db } = useDatabase()

  const query = db.selectFrom('person')
    .where('id', 'is', 1)
    .orderBy('created_at', 'desc')
    .selectAll()

  return query.executeTakeFirst()
})
