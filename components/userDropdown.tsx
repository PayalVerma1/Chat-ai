"use client";
import { useSession, signOut } from "next-auth/react";
import {
  Crown,
  Palette,
  Settings,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserDropdown() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name, email } = session.user;

  interface HandleMenuClick {
    (action: MenuAction): void;
  }

  type MenuAction = "upgrade" | "customize" | "settings" | "help";

  const handleMenuClick: HandleMenuClick = (action) => {
    switch (action) {
      case "upgrade":
        console.log("Upgrade plan clicked");
        break;
      case "customize":
        console.log("Customize clicked");
        break;
      case "settings":
        console.log("Settings clicked");
        break;
      case "help":
        console.log("Help clicked");
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
       <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold uppercase">
            {name?.charAt(0)}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium truncate">{name}</span>
            <span className="text-xs text-gray-400">Free</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72 bg-zinc-900 text-white border-zinc-700">
        <DropdownMenuLabel className="flex items-center space-x-2 text-gray-300 text-sm py-3">
          <User size={16} className="text-gray-400" />
          <span className="truncate">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-700" />

        <DropdownMenuItem
          className="flex items-center justify-between hover:bg-zinc-800 cursor-pointer py-3"
          onClick={() => handleMenuClick("upgrade")}
        >
          <div className="flex items-center space-x-3">
            <Crown size={16} className="text-gray-400" />
            <span className="text-sm font-medium">Upgrade plan</span>
          </div>
        </DropdownMenuItem>

       

        <DropdownMenuItem
          className="flex items-center justify-between hover:bg-zinc-800 cursor-pointer py-3"
          onClick={() => handleMenuClick("settings")}
        >
          <div className="flex items-center space-x-3">
            <Settings size={16} className="text-gray-400" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between hover:bg-zinc-800 cursor-pointer py-3"
          onClick={() => handleMenuClick("help")}
        >
          <div className="flex items-center space-x-3">
            <Settings size={16} className="text-gray-400" />
            <span className="text-sm font-medium">Help</span>
          </div>
          <ChevronRight size={14} className="text-gray-500" />
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-700" />

        <DropdownMenuItem
          className="flex items-center space-x-3 hover:bg-zinc-800 text-red-400 cursor-pointer py-3"
          onClick={() => signOut()}
        >
          <LogOut size={16} className="text-red-400" />
          <span className="text-sm font-medium">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
