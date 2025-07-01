import AppBar from "./components/AppBar";
// import InputBox from "./components/InputBox";
import ChatPage from "./chat/[id]/page";

export default function Home() {
  return (
    <div className="flex min-h-screen ">
      <ChatPage />
    </div>
  );
}
