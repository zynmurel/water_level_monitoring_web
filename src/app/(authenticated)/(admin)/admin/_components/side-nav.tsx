"use client";
import Link from "next/link";
import { Package2 } from "lucide-react";

import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store/app";
const SideNavigation = ({
  routes,
}: {
  routes: {
    title: string;
    route: string;
    icon: JSX.Element;
  }[];
}) => {
  const { user } = useStore();
  const pathname = usePathname();
  const isActive = (route: string) => {
    const path = pathname.split("/")[2] || "";
    const rt = route.split("/")[2] || "";
    return rt === path;
  };
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="flex flex-col">
            <span className="">Water Level Monitoring</span>
            <span className="-mt-1 text-xs font-normal capitalize">
              {user?.role.replace("_", "")}
            </span>
          </span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 py-2 text-sm font-medium lg:px-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.route}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive(route.route) ? "bg-muted" : "text-muted-foreground"}`}
            >
              {route.icon}
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavigation;
