import React from "react";
import SignIn from "./client-components/Signin";
import ModeToggle from "./modeToggle";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#252722] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(124, 179, 66, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124, 179, 66, 0.08) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#7CB342]/40 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#CBD5D1]/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#7CB342]/60 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#7CB342]/10 to-transparent"></div>
      
      <div className="relative z-10 max-w-md w-full">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-[#1E1E1E]/50 to-[#252722]/50 rounded-2xl blur-sm"></div>
          <div className="relative bg-[#1E1E1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#7CB342]/20">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <h1 className="text-3xl font-extralight text-[#F5F7F6] tracking-[0.2em]">
                    TOTO<span className="text-[#CBD5D1] font-light">-</span>
                    <span className="text-[#7CB342] font-normal">AI</span>
                  </h1>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-[1px] bg-[#7CB342]/60"></div>
                </div>
                <p className="text-[#CBD5D1] text-sm font-light tracking-wide leading-relaxed">
                  Start a new conversation to explore ideas and get answers.
                </p>
              </div>

              <div className="pt-4">
                <button className="w-full group relative overflow-hidden bg-[#252722]/60 hover:bg-[#1E1E1E]/80 text-[#F5F7F6] font-light py-3 px-6 rounded-lg border border-[#7CB342]/30 hover:border-[#7CB342]/60 transition-all duration-500 backdrop-blur-sm hover:shadow-lg hover:shadow-[#7CB342]/10">
                  <span className="relative z-10 tracking-wider text-sm text-white">
                    <SignIn className="text-white" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7CB342]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-[#CBD5D1]/60 text-xs tracking-widest">
            <div className="w-1 h-1 bg-[#7CB342]/60 rounded-full"></div>
            <span>SECURE ACCESS</span>
            <div className="w-1 h-1 bg-[#7CB342]/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;