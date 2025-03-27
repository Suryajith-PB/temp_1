"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, Calendar, Utensils, LogOut, Home, MenuIcon, BookOpen } from "lucide-react"

// Type definitions
type User = {
  email: string
  role: string
  name: string
}

type Reservation = {
  id: string
  name: string
  date: string
  time: string
  guests: number
  status: "confirmed" | "pending" | "cancelled"
}

type MenuItem = {
  id: string
  name: string
  price: number
  category: string
  image:string
}

type Order = {
  id: string
  customer: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "completed" | "in-progress" | "new"
  date: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Sample data - in a real app, this would come from your API
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: "1", name: "John Doe", date: "2023-12-15", time: "7:00 PM", guests: 4, status: "confirmed" },
    { id: "2", name: "Jane Smith", date: "2023-12-16", time: "6:30 PM", guests: 2, status: "pending" },
    { id: "3", name: "Robert Johnson", date: "2023-12-17", time: "8:00 PM", guests: 6, status: "confirmed" },
    { id: "4", name: "Emily Davis", date: "2023-12-18", time: "7:30 PM", guests: 3, status: "cancelled" },
    { id: "5", name: "Michael Brown", date: "2023-12-19", time: "6:00 PM", guests: 2, status: "confirmed" },
  ])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      const fetchMenuItems = async () => {
        try {
          const response = await fetch('/api/menu')
          if (!response.ok) {
            throw new Error('Failed to fetch menu items')
          }
          const data = await response.json()
          setMenuItems(data)
          setLoading(false)
        } catch (err) {
          console.error('Error fetching menu items:', err)
          setError('Could not load menu items. Please try again later.')
          setLoading(false)
        }
      }
  
      fetchMenuItems()
    }, [])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      customer: "Alice Johnson",
      items: [
        { name: "Classic Burger", quantity: 2, price: 12.99 },
        { name: "Caesar Salad", quantity: 1, price: 9.99 },
      ],
      total: 35.97,
      status: "completed",
      date: "2023-12-15",
    },
    {
      id: "2",
      customer: "Bob Williams",
      items: [
        { name: "Margherita Pizza", quantity: 1, price: 14.99 },
        { name: "Garlic Bread", quantity: 1, price: 5.99 },
      ],
      total: 20.98,
      status: "in-progress",
      date: "2023-12-15",
    },
    {
      id: "3",
      customer: "Carol Martinez",
      items: [
        { name: "Grilled Salmon", quantity: 1, price: 18.99 },
        { name: "Chocolate Brownie", quantity: 2, price: 7.99 },
      ],
      total: 34.97,
      status: "new",
      date: "2023-12-15",
    },
  ])

  // Form states for adding new items
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: "Main Course",
  })

  const [reservationStatusFilter, setReservationStatusFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role === "admin") {
        setUser(parsedUser)
      } else {
        // Redirect non-admin users
        router.push("/login")
      }
    } else {
      // Redirect if not logged in
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMenuItem.name || !newMenuItem.price) return;

    const price = Number.parseFloat(newMenuItem.price);
    if (isNaN(price)) return;

    // Find the highest existing ID and increment by 1
    const highestId = menuItems.length > 0 
      ? Math.max(...menuItems.map(item => parseInt(item.id)))
      : 0;
    
    const newItem: MenuItem = {
      id: (highestId + 1).toString(),
      name: newMenuItem.name,
      price: price,
      category: newMenuItem.category,
      image: 'placeholder.svg?height=200&width=200'
    };

    try {
      // Send to database
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      const data = await response.json();
      // Update local state with the saved item (including DB-generated ID)
      setMenuItems([...menuItems, data]);
      setNewMenuItem({ name: "", price: "", category: "Main Course" });
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id))
  }

  const handleUpdateReservationStatus = (id: string, status: "confirmed" | "pending" | "cancelled") => {
    setReservations(reservations.map((res) => (res.id === id ? { ...res, status } : res)))
  }

  const handleUpdateOrderStatus = (id: string, status: "completed" | "in-progress" | "new") => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  // Filter reservations based on status
  const filteredReservations =
    reservationStatusFilter === "all"
      ? reservations
      : reservations.filter((res) => res.status === reservationStatusFilter)

  // Filter orders based on status
  const filteredOrders =
    orderStatusFilter === "all" ? orders : orders.filter((order) => order.status === orderStatusFilter)

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-amber-50">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-amber-900 text-white p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-amber-200 mt-2">Welcome, {user.name}</p>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center p-3 rounded-lg transition ${
                  activeTab === "dashboard" ? "bg-amber-800" : "hover:bg-amber-800"
                }`}
              >
                <BarChart3 className="mr-3" size={20} />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full flex items-center p-3 rounded-lg transition ${
                  activeTab === "menu" ? "bg-amber-800" : "hover:bg-amber-800"
                }`}
              >
                <MenuIcon className="mr-3" size={20} />
                Menu Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("reservations")}
                className={`w-full flex items-center p-3 rounded-lg transition ${
                  activeTab === "reservations" ? "bg-amber-800" : "hover:bg-amber-800"
                }`}
              >
                <Calendar className="mr-3" size={20} />
                Reservations
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center p-3 rounded-lg transition ${
                  activeTab === "orders" ? "bg-amber-800" : "hover:bg-amber-800"
                }`}
              >
                <Utensils className="mr-3" size={20} />
                Orders
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto space-y-2">
          <Link href="/" className="w-full flex items-center p-3 rounded-lg hover:bg-amber-800 transition">
            <Home className="mr-3" size={20} />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-amber-800 transition"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8">
        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Utensils className="text-amber-700" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                </div>
                <p className="text-3xl font-bold text-amber-900">{orders.length}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {orders.filter((o) => o.status === "new").length} new orders today
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <Calendar className="text-amber-700" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Reservations</h3>
                </div>
                <p className="text-3xl font-bold text-amber-900">{reservations.length}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {reservations.filter((r) => r.status === "pending").length} pending confirmation
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <BookOpen className="text-amber-700" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Menu Items</h3>
                </div>
                <p className="text-3xl font-bold text-amber-900">{menuItems.length}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Across {new Set(menuItems.map((item) => item.category)).size} categories
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Customer</th>
                        <th className="text-left py-3 px-2">Total</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b hover:bg-amber-50">
                          <td className="py-3 px-2">{order.customer}</td>
                          <td className="py-3 px-2">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "in-progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-amber-900 mb-4">Upcoming Reservations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Guests</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 5).map((res) => (
                        <tr key={res.id} className="border-b hover:bg-amber-50">
                          <td className="py-3 px-2">{res.name}</td>
                          <td className="py-3 px-2">
                            {res.date} {res.time}
                          </td>
                          <td className="py-3 px-2">{res.guests}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                res.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : res.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Management */}
        {activeTab === "menu" && (
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Menu Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4">Current Menu Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Price</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-amber-50">
                            <td className="py-3 px-4">{item.name}</td>
                            <td className="py-3 px-4">{item.category}</td>
                            <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDeleteMenuItem(item.id)}
                                className="text-red-600 hover:text-red-800 transition"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4">Add New Menu Item</h3>
                  <form onSubmit={handleAddMenuItem}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Item Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-700 text-white py-2 px-4 rounded-lg hover:bg-amber-800 transition"
                    >
                      Add Menu Item
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reservations */}
        {activeTab === "reservations" && (
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Reservations Management</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-amber-900">All Reservations</h3>
                <div>
                  <select
                    value={reservationStatusFilter}
                    onChange={(e) => setReservationStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Guests</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((res) => (
                      <tr key={res.id} className="border-b hover:bg-amber-50">
                        <td className="py-3 px-4">{res.name}</td>
                        <td className="py-3 px-4">{res.date}</td>
                        <td className="py-3 px-4">{res.time}</td>
                        <td className="py-3 px-4">{res.guests}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              res.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : res.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, "confirmed")}
                              className="text-green-600 hover:text-green-800 transition text-sm"
                              disabled={res.status === "confirmed"}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateReservationStatus(res.id, "cancelled")}
                              className="text-red-600 hover:text-red-800 transition text-sm"
                              disabled={res.status === "cancelled"}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Order Management</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-amber-900">All Orders</h3>
                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-amber-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-amber-900">Order #{order.id}</h4>
                        <p className="text-gray-600">Customer: {order.customer}</p>
                        <p className="text-gray-600">Date: {order.date}</p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-b py-3 my-3">
                      <h5 className="font-medium mb-2">Order Items:</h5>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="font-bold text-amber-900">Total: ${order.total.toFixed(2)}</div>
                      <div className="space-x-2">
                        {order.status !== "completed" && (
                          <>
                            {order.status === "new" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "in-progress")}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === "in-progress" && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition"
                              >
                                Mark Completed
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

