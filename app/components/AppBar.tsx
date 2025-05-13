'use client';
import { signIn, signOut, useSession } from "next-auth/react";

export function AppBar() {
    const session = useSession(); 

    return (
        <div className="flex justify-between">
            <div>Chat-ai</div>
          
            <div>
                {session.data?.user && <button className="mt-2 p-2 bg-blue-400 " onClick={()=>signOut()}>Logout</button>}
                {session.data?.user && <button className="mt-2 p-2 bg-amber-900" onClick={()=>signIn()}>LogIn</button>}
            </div>
        </div>
    );
}