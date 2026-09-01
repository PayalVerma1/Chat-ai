
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { monitor } from "@/lib/monitor";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
