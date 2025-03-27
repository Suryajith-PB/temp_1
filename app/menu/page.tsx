"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

// Menu item type definition
type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

// Cart item type definition
type CartItem = {
  menuItem: MenuItem
  quantity: number
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showCart, setShowCart] = useState(false)

  // Fetch menu items from MongoDB
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

  // Get unique categories from menu items
  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]

  // Filter menu items by selected category
  const filteredMenuItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  // Add item to cart
  const addToCart = (menuItem: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.menuItem.id === menuItem.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevCart, { menuItem, quantity: 1 }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (menuItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItem.id !== menuItemId))
  }

  // Update item quantity in cart
  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart((prevCart) =>
      prevCart.map((item) => (item.menuItem.id === menuItemId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)

  // Place order
  const placeOrder = () => {
    if (cart.length === 0) return

    // In a real app, this would send the order to your backend
    alert("Order placed successfully!")
    console.log("Order placed:", cart)
    setCart([])
    setShowCart(false)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <header className="bg-amber-800 text-white p-6 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Delicious Bites</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto py-10 px-4 flex items-center justify-center">
          <div className="text-2xl text-amber-800">Loading menu items...</div>
        </main>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <header className="bg-amber-800 text-white p-6 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold">Delicious Bites</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto py-10 px-4 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="bg-amber-800 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Delicious Bites</h1>
          <nav className="flex items-center">
            <ul className="flex space-x-6 mr-6">
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
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 bg-amber-700 rounded-full hover:bg-amber-600 transition"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Our Menu</h2>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === category ? "bg-amber-700 text-white" : "bg-white text-amber-800 hover:bg-amber-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-amber-900">{item.name}</h3>
                  <span className="text-amber-700 font-bold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-amber-700 text-white py-2 rounded hover:bg-amber-800 transition"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-amber-900">Your Order</h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.menuItem.id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-900">{item.menuItem.name}</h4>
                          <p className="text-sm text-gray-500">${item.menuItem.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    className="w-full bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition"
                  >
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-amber-900 text-white p-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Delicious Bites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

