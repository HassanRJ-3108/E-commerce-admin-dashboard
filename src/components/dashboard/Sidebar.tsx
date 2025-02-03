"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { IconType } from "react-icons"
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings } from "react-icons/fi"

interface NavItem {
  name: string
  href: string
  icon: IconType
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Products", href: "/dashboard/products", icon: FiBox },
  { name: "Orders", href: "/dashboard/orders", icon: FiShoppingCart },
  { name: "Users", href: "/dashboard/users", icon: FiUsers },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between p-4">
        <h2 className={`font-bold ${isOpen ? "block" : "hidden"}`}>Dashboard</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center py-2 px-4 ${
              pathname === item.href ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            <item.icon className="h-6 w-6 mr-3" />
            <span className={isOpen ? "block" : "hidden"}>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

