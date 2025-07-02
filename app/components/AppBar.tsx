import SignIn from "./client-components/Signin";
export default function AppBar() {
  return (
    <div className="flex ml-6 items-center ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-log-in size-4"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" x2="3" y1="12" y2="12"></line>
      </svg>
      <SignIn />
    </div>
  );
}
