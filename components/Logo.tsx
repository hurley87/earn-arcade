import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/">
      <img
        className="h-8 w-8 cursor-pointer animate-spin-slow dark:text-white fill-pink-600"
        src="logo.svg"
      />
    </Link>
  )
}

export default Logo
