import express from "express"
import cors from "cors"
import {PrismaClient} from "@prisma/client"
const app=express();
const prisma=new PrismaClient()


app.use(express.json())
app.use(cors())
//endpoint
app.get("/api/notes",async(req,res)=>
{
    const notes=await prisma.note.findMany();
    res.json(notes)
});

app.post("/api/notes", async (req,res)=>{
    const {title,content}=req.body;
    if(!title || !content)
    {
        res.status(400).send("title and content fields required");
        return;
    }
    const note=await prisma.note.create({
        data:{title,content}
    });
    res.json(note)
    try{
        const note=await prisma.note.create({
            data:{title,content}
        });
        res.json(note)
    }
    catch(error){
        res.status(500).send("Something went wrong");
    }
})
app.put("/api/notes/:id",async(req,res)=>
{
    const {title,content}=req.body;
    const id=parseInt(req.params.id)
    if(!title||!content)
    {
        res.status(400).send("title and content fields required")
        return ;
    }
    if(!id||isNaN(id))
    {
        res.status(400).send("Id must be valid")
        return;
    }
    try{
     const update=await prisma.note.update({where:{id},data:{title,content}})
     res.json(update);
    }
    catch(error)
    {
        res.status(500).send("somehtingw ent wrong")
    }
})
app.delete("/api/notes/:id",async(req,res)=>
{
    const id=parseInt(req.params.id)
    if(!id||isNaN(id))
    {
        res.status(400).send("ID must be valid")
        return;
    }
    try{
   await prisma.note.delete({
    where:{id}
   })
   res.status(204).send()
    }
    catch(error)
    {
      res.status(500).send("somehtingw ent wrong")
    }

})
app.listen(5432,()=>
{
    console.log("app running ")
})