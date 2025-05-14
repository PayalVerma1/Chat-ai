import { NextResponse } from "next/server";
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.API_KEY,
});
export async function POST(req:Request){
    try{
const result= await req.json();
const content=result.prompt;
if(!content){
    return NextResponse.json({error:"No content provided"});
}
const response=await groq.chat.completions.create({
    model:"llama-3.3-70b-versatile",
    messages:[{role:"user",content}]
})
const airesponse=response.choices[0].message.content;
 return NextResponse.json({ res: airesponse });
}
catch(error){
console.log("Error:",error);
return NextResponse.json({error:"Error in API call"});
}
}