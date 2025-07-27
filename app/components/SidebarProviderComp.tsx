"use client";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggle from "./modeToggle";
import { use } from "react";
import SignupPage from "./Signup";
import { useSession } from "next-auth/react";
import SignIn from "./client-components/Signin";

const SidebarProviderComp = ({ children }: { children: React.ReactNode }) => {

    const session = useSession();
  return (
    <>
     {
        session?.data?.user ? (
            <SidebarProvider>
      <div className="flex w-full h-screen text-[#171B17] hover:text-[#9CEE69] dark:text-white dark:hover:text-[#9CEE69]">
        <AppSidebar />

        <main className="flex-1 flex flex-col h-full w-full ">
          <div className="flex items-center justify-between bg-[#F5FBEF] dark:bg-[#252722] text-[#171B17] dark:text-white p-2 border-b border-gray-200 dark:border-[#252722]/30">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
        ) : (
            // <div className="flex items-center justify-center h-screen bg-white dark:bg-[#171B17]">
            //     <p className="text-gray-600 dark:text-gray-400">Please sign in to access the chat.</p>
            //       <SignIn />

            // </div>
            <SignupPage />
        )
     }
    </>
  );
};

export default SidebarProviderComp;