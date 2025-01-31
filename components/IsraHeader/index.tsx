import Image from "next/image"
import { useEffect, useState } from "react"
import logo from "../../assets/gdupdatedlogo.png"
import ThemeToggler from "../Header/ThemeToggler"
import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"


const SimplifiedHeader = () => {
  const [stickyMenu, setStickyMenu] = useState(false)

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true)
    } else {
      setStickyMenu(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu)
  })

  return (
    <header
      className={`fixed left-0 top-0 z-99999 w-full py-7 ${
        stickyMenu ? "bg-white !py-4 shadow transition duration-100 dark:bg-black" : ""
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
          <Link href="/" className="absolute left-2">
              <FaArrowLeft className="text-2xl text-gray-800 dark:text-white" />
            </Link>
            <a href="/" className="ml-16">
              <Image
                src={logo || "/placeholder.svg"}
                alt="logo"
                width={110}
                height={28}
                className="hidden w-full dark:block"
              />
              <Image
                src={logo || "/placeholder.svg"}
                alt="logo"
                width={110}
                height={10}
                className="w-full dark:hidden"
              />
            </a>
            <div className="flex flex-col ml-4">
              <span className="text-xl font-bold tracking-wide">I·S·R·A</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-6 h-[1px] bg-current opacity-70"></div>
                <span className="text-xs uppercase tracking-wider opacity-90">by GoDeskless</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  )
}

export default SimplifiedHeader
