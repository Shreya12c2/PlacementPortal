import { useState } from "react";
import api from "../api";
export default function Login(){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");
  const submit=async(e)=>{
    e.preventDefault();
    try{
      const {data}=await api.post("/api/token/",{username,password});
      localStorage.setItem("access",data.access);
      localStorage.setItem("refresh",data.refresh);
      setMsg("✅ Logged in!"); window.location.href="/";
    }catch{ setMsg("❌ Login failed"); }
  };
  return (<div style={{padding:16}}><h2>Login</h2>
    <form onSubmit={submit}>
      <div><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} /></div>
      <div><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button>Login</button>
    </form><p>{msg}</p></div>);
}