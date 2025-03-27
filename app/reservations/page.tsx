"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"
// Remove the direct MongoDB import
// import { connectToDatabase } from "@/lib/mongodb"

export default function Reservations() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Instead of connecting directly to MongoDB, call the API route
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to make reservation');
      }
      
      console.log("Reservation saved successfully:", result);

      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        specialRequests: "",
      })
    } catch (err) {
      setError("Failed to make reservation. Please try again.")
      console.error("Reservation error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate available time slots
  const timeSlots = []
  for (let hour = 11; hour <= 21; hour++) {
    const hourFormatted = hour > 12 ? hour - 12 : hour
    const period = hour >= 12 ? "PM" : "AM"
    timeSlots.push(`${hourFormatted}:00 ${period}`)
    timeSlots.push(`${hourFormatted}:30 ${period}`)
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

      <main className="flex-grow container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Reserve a Table</h2>

          {isSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg mb-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Reservation Successful!</h3>
              <p className="mb-4">Thank you for your reservation. We look forward to serving you!</p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-800 transition"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-gray-700 font-medium mb-2">
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                      Time
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="specialRequests" className="block text-gray-700 font-medium mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-700 text-white py-3 px-4 rounded-lg hover:bg-amber-800 transition flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Calendar className="mr-2" size={20} />
                      Reserve Table
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Reservation Policy</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Reservations can be made up to 30 days in advance.</li>
              <li>• We hold reservations for 15 minutes past the reservation time.</li>
              <li>• For parties of 8 or more, please call us directly at (123) 456-7890.</li>
              <li>• Cancellations should be made at least 24 hours in advance.</li>
              <li>• Special requests are accommodated based on availability.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-amber-900 text-white p-6 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Delicious Bites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

