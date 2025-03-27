import { MongoClient } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const client = await MongoClient.connect("mongodb://localhost:27017")
    const db = client.db("resto")
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email, password })

    await client.close()

    if (user) {
      return NextResponse.json({
        email: user.email,
        role: user.role || "customer",
        name: user.name || "User",
      })
    } else {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
