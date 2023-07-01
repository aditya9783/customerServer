let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
    res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
const port = process.env.PORT || 2410
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let {customerData} = require("./customerData");
let fs=require("fs");
let fname="customer.json";

app.get("/customer/resetData",function(req,res){
    let data=JSON.stringify(customerData);

    fs.writeFile(fname,data,function(err){
        if(err) console.log(err);
        else res.send("Data reset Successfully")
    })
});

app.get("/customers",function(req,res){
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let data=JSON.parse(content);
            res.send(data);
        }
    })
});

app.get("/customers/:id",function(req,res){
    let id= req.params.id
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let data=JSON.parse(content);
            let cst=data.find(ct=>ct.id===id);
            if(cst) res.send(cst)
            else {
                res.status(404).send("No customer Found");
            }
        }
    })
})
app.post("/customers",function(req,res){
    let body=req.body
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let data=JSON.parse(content);
            data.push(body);
            let data1=JSON.stringify(data);
            fs.writeFile(fname,data1,function(err){
                if(err) console.log(err);
                else{
                    res.send(body)
                }
            })
            
        }
    })
})

app.put("/customers/:id",function(req,res){
    let body=req.body;
    let id=req.params.id
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let data=JSON.parse(content);
            let index=data.findIndex(ct=>ct.id===id)
            if(index>=0){
                let updatedCst={...body};
                data[index]=updatedCst;
                let data1=JSON.stringify(data);
                fs.writeFile(fname,data1,function(err){
                    if(err) console.log(err);
                    else{
                        res.send(updatedCst)
                    }
                })
            }
            else{
                res.status(404).send("No customer Found");
            }
        }
    })
})
app.delete("/customers/:id",function(req,res){
    let id=req.params.id
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let data=JSON.parse(content);
            let index=data.findIndex(ct=>ct.id===id)
            if(index>=0){
                let deletedCst=data.splice(index,1);
                let data1=JSON.stringify(data);
                fs.writeFile(fname,data1,function(err){
                    if(err) console.log(err);
                    else{
                        res.send(deletedCst)
                    }
                })
            }
            else{
                res.status(404).send("No Customer Found")
            }
            
            
            
            
        }
    })
})