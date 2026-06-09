import mongoose from 'mongoose'

const PLACEHOLDER_TOKENS = ['USERNAME:PASSWORD', 'cluster0.xxxxx']

const isPlaceholderUri = (uri) => {
  if (!uri) return true
  return PLACEHOLDER_TOKENS.some((token) => uri.includes(token))
}

/**
 * Connect to MongoDB
 * - If MONGODB_URI is a real connection string, use it
 * - Otherwise (placeholder/unset), spin up an in-memory MongoDB
 *   for quick local development (data is wiped on restart).
 */
const connectDB = async () => {
  const useMemory = isPlaceholderUri(process.env.MONGODB_URI)

  if (useMemory) {
    console.log('⚠️  MONGODB_URI is not configured. Starting in-memory MongoDB for development...')
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server')
      const mem = await MongoMemoryServer.create()
      const memUri = mem.getUri()
      const conn = await mongoose.connect(memUri, {
        serverSelectionTimeoutMS: 10000,
      })
      console.log(`✅ In-memory MongoDB Connected: ${conn.connection.host}`)
      // Keep the server alive for the lifetime of the process
      process.on('SIGINT', async () => {
        await mem.stop()
        process.exit(0)
      })
      return
    } catch (err) {
      console.error('❌ Failed to start in-memory MongoDB:', err.message)
      console.error('Tip: install MongoDB locally or set a real MONGODB_URI in server/.env')
      process.exit(1)
    }
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error('Please check your MONGODB_URI in .env file')
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`)
})

export default connectDB
