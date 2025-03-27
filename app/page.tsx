import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50">
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

      <main className="container mx-auto py-10 px-4">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">Welcome to Delicious Bites</h2>
          <p className="text-lg text-amber-800 max-w-2xl mx-auto">
            Experience the finest cuisine in town. Our restaurant offers a perfect blend of taste, ambiance, and
            service.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">Explore Our Menu</h3>
            <p className="text-gray-700 mb-4">Discover our wide range of delicious dishes prepared by expert chefs.</p>
            <Link
              href="/menu"
              className="inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-800 transition"
            >
              View Menu
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">Reserve a Table</h3>
            <p className="text-gray-700 mb-4">Book your table in advance to ensure a seamless dining experience.</p>
            <Link
              href="/reservations"
              className="inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-800 transition"
            >
              Make Reservation
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">Order Online</h3>
            <p className="text-gray-700 mb-4">
              Place your order online and enjoy our delicious food at your convenience.
            </p>
            <Link
              href="/menu"
              className="inline-block bg-amber-700 text-white py-2 px-4 rounded hover:bg-amber-800 transition"
            >
              Order Now
            </Link>
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-amber-900 mb-6 text-center">About Us</h2>
          <p className="text-gray-700 mb-4">
            Delicious Bites has been serving the community since 2010. Our mission is to provide high-quality food and
            exceptional service in a warm and welcoming environment.
          </p>
          <p className="text-gray-700">
            We source our ingredients locally whenever possible and our menu changes seasonally to ensure the freshest
            dining experience.
          </p>
        </section>
      </main>

      <footer className="bg-amber-900 text-white p-6 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">Delicious Bites</h3>
              <p>123 Gourmet Street</p>
              <p>Foodville, FD 12345</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p>Monday - Friday: 11am - 10pm</p>
              <p>Saturday - Sunday: 10am - 11pm</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-200 transition">
                  Facebook
                </a>
                <a href="#" className="hover:text-amber-200 transition">
                  Instagram
                </a>
                <a href="#" className="hover:text-amber-200 transition">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Delicious Bites. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

