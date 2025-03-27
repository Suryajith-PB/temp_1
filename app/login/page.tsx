"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const user = await response.json()
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            role: user.role,
            name: user.name,
          }),
        )
        router.push(user.role === "admin" ? "/admin/dashboard" : "/menu")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to login. Please try again.")
      }
    } catch (err) {
      setError("Failed to login. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="bg-amber-800 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Delicious Bites</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-amber-200 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-200 transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-amber-200 transition">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-200 transition">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-10 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">Login</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 text-white py-2 px-4 rounded-lg hover:bg-amber-800 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-amber-700 hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-2">Demo Accounts:</h3>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Admin:</strong> admin@example.com / admin123
            </p>
            <p className="text-sm text-gray-700">
              <strong>Customer:</strong> customer@example.com / customer123
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-amber-900 text-white p-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Delicious Bites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

