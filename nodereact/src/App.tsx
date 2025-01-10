import { useState ,useEffect} from "react"
import "./App.css"
type Note={
  id:number,
  title:string,
  content:string
}
const App=()=>
{
  const[notes,setNotes]=useState<Note[]>([])
  const[tit,settit]=useState("")
  const[con,setcon]=useState("")
  const handleAddNote=async(event:React.FormEvent)=>
  {
    event.preventDefault()
   try{
    const response=await fetch("http://localhost:5432/api/notes",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title:tit,
          content:con
        })
      }
    )
    const newNote=await response.json();
    setNotes([newNote, ...notes])
    settit("")
    setcon("")
   }
   catch(e)
   {
     console.log(e)
   }
   
  }
  const[selectedNote,setSelected]=useState<Note|null>(null)
  const handleNoteClick=(note:Note)=>
  {
   setSelected(note);
   settit(note.title);
   setcon(note.content)
  }
  const handleUpdate=async(event:React.FormEvent)=>
  {
    event.preventDefault()
    try{
      const response=await fetch(`http://localhost:5432/api/notes/${selectedNote!.id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title:tit,
          content:con
        })
      })
      const updatedNote=await response.json();
      const updatedNoteList=notes.map((note)=>
    
        note.id === selectedNote!.id?updatedNote:note
      )
      setNotes(updatedNoteList)
      settit("")
      setcon("")
      setSelected(null)
    }
    catch(e)
    {
     console.log(0)
    }
    if(!selectedNote)
    {
      return;
    }
   
  }
  const handleCancel=()=>
  {
    settit("")
    setcon("")
    setSelected(null)
  }
  const deleteNode=async(event:React.FormEvent,noteId:number)=>
  {
    event.stopPropagation();
    try{
      await fetch(`http://localhost:5432/api/notes/${noteId}`,{
        method:"DELETE",
      })
      const updatedNotes=notes.filter((note)=>note.id!==noteId)
      setNotes(updatedNotes)
    }
    catch(e)
    {

    }
    
  }

  useEffect(()=>
  {
    const getNotes=async()=>
    {
      try{
         const response= await fetch("http://localhost:5432/api/notes")
         const notes:Note[]=await response.json()
         setNotes(notes)
      }
      catch(e)
      {
        console.log(e)
      }
    }
    getNotes();
  },[])
  return (
    <div className="app-container">
      <form className="note-form" onSubmit={(event)=> selectedNote?handleUpdate(event):handleAddNote(event)}>
        <input placeholder="Title"
        required value={tit} onChange={(event)=>settit(event.target.value)}></input>
        <textarea placeholder="Content" rows={10} required value={con} onChange={(event)=>setcon(event.target.value)}></textarea>
        {selectedNote?<div className="edit-button"><button type="submit">Save</button><button onClick={handleCancel}>Cancel</button></div>:<button type="submit">Add Note</button>}
      </form>
      <div className="notes-grid">
        {notes.map((note)=>(
          <div className="note-item" onClick={()=>handleNoteClick(note)}>

            <div className="notes-header">
          <button onClick={(event)=>deleteNode(event,note.id)}>X</button>
        </div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
  )
}
export default App