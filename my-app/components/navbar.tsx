"use client"
import { ModeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export function NavBar() {
  const pathname = usePathname()
  console.log(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0  z-40 w-full border-b  bg-background px-4 ">
      <div className="mx-auto flex h-12 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className=" font-bold ">
               Civi Connect
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
          {!isAdminRoute && (
              <Link
                href="/user/edituser"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "text-zinc-700 dark:text-zinc-400",
                  })}
                >
                  <Icons.user className="h-5 w-5 fill-current" />
                </div>
              </Link>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
