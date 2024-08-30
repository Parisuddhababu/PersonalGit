import Link from "next/link";
import Image from "next/image";

const NavBar = () => (
  <header className="w-full  absolute z-10">
    <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent">
      <Link href="/" className="flex justify-center items-center">
        {/* for navbar logo */}
        <Image
          src="/logo.svg"
          alt="logo"
          width={118}
          height={18}
          className="object-contain"
        />
      </Link>
      {/* to navigate into home page */}
      <Link href="/" className="flex">
        Home
      </Link>
      {/* to navigate into cars page */}
      <Link href="/cars" className="flex">
        AllCars
      </Link>
      {/* to navigate into products page */}
      <Link href="/products" className="flex">
        AllProducts
      </Link>
    </nav>
  </header>
);

export default NavBar;
