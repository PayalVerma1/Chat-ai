import AppBar from "./components/AppBar";
// import InputBox from "./components/InputBox";
import ChatPage from "./chat/[id]/page";
import SideBar from "./components/SideBar";
export default function Home() {
  return (
    <div className="flex h-screen">
     
   
    <SideBar />
     <ChatPage/>
    </div>
  );
}
