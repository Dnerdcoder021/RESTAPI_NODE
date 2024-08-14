const express=require("express");
const users=require("./MOCK_DATA.json")

const app=express();
const PORT=8000;
const fs=require("fs");
// Middleware
app.use(express.urlencoded({extended:false}));

app.use((req,res,next)=>{
    console.log("Hello From Middleware 1");
    next();
})

// ROUTES

app.get('/api/users',(req,res)=>{
    res.setHeader('myname','garg');
return res.json(users);
})

app.get('/users',(req,res)=>{
    const html=`
    <ul>
    ${users.map((user)=>`<li>${user.name}</li>`).join("")}
    </ul>`;
    res.send(html);
})

// app.get("/api/users/:userid",(req,res)=>{
//     const id=Number(req.params.userid);
//     const user=users.find((user)=>user.id===id);
//     return res.json(user);
// });

// app.post("/api/users",(req,res)=>{
//     return res.json({status:"pending"});
// });

// app.patch("/api/users/:userid",(req,res)=>{
//     // edit user
//     return res.json({status:"pending"});
// });
// app.delete("/api/users/:userid",(req,res)=>{
//     // delete user
//     return res.json({status:"pending"});
// });

app
.route("/api/users/:userid")
.get((req,res)=>{
    const id=Number(req.params.userid);
    const user=users.find((user)=>user.id===id);
    if(!user)return res.status(404).json({'error':'user not found'})
    return res.json(user);
}).patch((req,res)=>{
    return res.json({status:"pending"});
}).delete((req,res)=>{
    const body=req.body;
    return res.json({status:"pending"});     
});

app.post("/api/users",(req,res)=>{
    const body=req.body;
    if(!body || !body.name || !body.email){
        return res.status(400).json({msg:'all fields are required.'})
    }
    // console.log('body:',body);
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{
        return res.status(201).json({status:"success",id:users.length});
    });
    // return res.json({status:"pending"});
});

app.listen(PORT,()=>console.log(`Server Started at Port:${PORT}`));