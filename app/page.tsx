import AppBar from "./components/AppBar";
import InputBox from "./components/InputBox";
import SideBar from "./components/SideBar";
export default function Home() {
  return (
    <div className="flex h-screen">
      <SideBar />
    <div><AppBar/>
     <InputBox/></div> 
    </div>
  );
}
