
import SignIn from "./client-components/Signin";
export default function AppBar() {
  

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-xl font-bold">Chat-ai</div>
      <div>
        <SignIn />
        
      </div>
    </div>
  );
}