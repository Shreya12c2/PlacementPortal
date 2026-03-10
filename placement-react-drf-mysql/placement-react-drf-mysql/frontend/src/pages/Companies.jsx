import { useState, useEffect } from "react";
import api from "../api";
export default function Companies(){
  const [form,setForm]=useState({name:"",website:"",sector:"",description:""});
  const [rows,setRows]=useState([]); const [msg,setMsg]=useState("");
  const list=async()=>{ const {data}=await api.get("/api/companies/"); setRows(data.results ?? data); };
  useEffect(()=>{ list().catch(()=>{}); },[]);
  const save=async(e)=>{ e.preventDefault();
    try{ await api.post("/api/companies/", form); setMsg("✅ Saved"); setForm({name:"",website:"",sector:"",description:""}); await list(); }
    catch{ setMsg("❌ Failed (login?)"); }
  };
  return (<div><h1>Companies</h1><h3>Create</h3>
    <form onSubmit={save}>
      <div><input placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
      <div><input placeholder="website" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} /></div>
      <div><input placeholder="sector" value={form.sector} onChange={e=>setForm({...form,sector:e.target.value})} /></div>
      <div><textarea placeholder="description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
      <button>Save</button>
    </form><p>{msg}</p><hr/>
    {rows.map(r=>(<div key={r.id} style={{marginBottom:8}}><b>{r.name}</b> — {r.sector} — {r.website}<div>{r.description}</div></div>))}
  </div>);
}