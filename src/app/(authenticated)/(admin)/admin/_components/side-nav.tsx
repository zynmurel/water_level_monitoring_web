"use client";
import Link from "next/link";
import { Droplets } from "lucide-react";

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
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-8 w-8 text-primary" strokeWidth={3} />
          <span className="flex flex-col">
            <span className="text-base font-bold">Water Level Monitoring</span>
          </span>
        </Link>
      </div>
      <div className="flex-1 border-r py-2">
        <nav className="grid items-start gap-2 px-2 py-2 text-sm font-medium lg:px-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.route}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary ${isActive(route.route) ? "bg-muted" : "text-muted-foreground"}`}
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
