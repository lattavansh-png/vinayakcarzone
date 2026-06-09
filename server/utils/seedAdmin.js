import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Admin from '../models/Admin.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    })

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', process.env.ADMIN_EMAIL)
      console.log('   If you want to reset, delete the admin from MongoDB first.')
      process.exit(0)
    }

    // Create new admin
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'super-admin',
    })

    console.log('✅ Admin created successfully!')
    console.log('   Name:', admin.name)
    console.log('   Email:', admin.email)
    console.log('   Role:', admin.role)
    console.log('\n🚀 You can now log in at POST /api/admin/login')
    console.log('   Email:', process.env.ADMIN_EMAIL)
    console.log('   Password:', process.env.ADMIN_PASSWORD)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message)
    process.exit(1)
  }
}

seedAdmin()
