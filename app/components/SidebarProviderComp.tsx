"use client";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggle from "./modeToggle";
import { use } from "react";
import { useSession } from "next-auth/react";
import SignIn from "./client-components/Signin";

const SidebarProviderComp = ({ children }: { children: React.ReactNode }) => {

    const session = useSession();
  return (
    <>
     {
        session?.data?.user ? (
            <SidebarProvider>
      <div className="flex w-full h-screen text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
        <AppSidebar />

        <main className="flex-1 flex flex-col h-full w-full ">
          <div className="flex items-center justify-between bg-[#F8F3FC] dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 border-b border-gray-200 dark:border-gray-700">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
        ) : (
            <div className="flex items-center justify-center h-screen bg-[#F8F3FC] dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">Please sign in to access the chat.</p>
                  <SignIn />
                  
            </div>
        )
     }
    </>
  );
};

export default SidebarProviderComp;
