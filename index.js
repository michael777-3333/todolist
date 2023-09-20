import express from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose";
const app= express()
let trueBooleano=false
let parametro = false
const port= 3000

async function connection() {
    await mongoose.connect('mongodb+srv://michael:Michael_777777@cluster0.27a07up.mongodb.net/')
    // await mongoose.connect('mongodb://0.0.0.0:27017/')
    .then(() => { console.log('Db is connected!'); })
    .catch(error => console.log(error));
}
connection()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

const listSchema =  new mongoose.Schema({
    name: {
        type:String,
        // required: [true,'plis check your data']
    },
}
)

const jobSchema= new mongoose.Schema({
    name:{
        type:String,
        // required:[true,'plis check your data']
    }
})

const List = mongoose.model('List', listSchema)
const Job= mongoose.model('Job',jobSchema)

app.get('/',(req, res)=>{
    // console.log(req.body['homework'],'p');
    List.find({}).then((foundItems)=>{
        if (foundItems==0) {
            const listOne = new List({
                name:'Pera',
            })
            listOne.save()
            res.redirect('/')
        }
        const data = {foundItems}
        res.render('index.ejs', data)
    }).catch((err)=>{
        console.log(err.message);
    })
})
app.get('/work', (req, res)=>{
    Job.find({}).then((workJob)=>{
        if (workJob==0) {
            const jobOne = new Job({
                name:'work in excel',
            })
            jobOne.save() 
            res.redirect('/work')
        }
        const dataWork = {workJob}
        res.render('work.ejs', dataWork)
    }).catch((err)=>{
        console.log(err.message);
    })
})

function getHomework(req, res , next) {
    // console.log(req.body['homework'],'l');
    parametro=true
    if (req.body['work'] =='' || req.body['homework']=='') {
        console.log('vacio');
        trueBooleano=true 
        next()
    }
    else{
        if (req.body['work']==undefined) {
            const listOne = new List({
                name:req.body['homework'],
            })
            listOne.save()
            next()
         }else if (req.body['homework']==undefined) {
            const jobOne = new Job({
                name:req.body['work'],
            })
            jobOne.save()
            next()
                }
            }  
        }
app.use(getHomework)

app.post('/works', (req, res)=>{
    Job.find({}).then((workJob)=>{
        const dataWork= {workJob}
        res.redirect('/work')  
        console.log(dataWork); 
    }).catch((err)=>{
        console.log(err.message);
    })
    
})

app.post('/submit', (req, res)=>{
    // console.log(req.body['homework','o']);
    List.find({}).then((foundItems)=>{
        res.redirect('/') 
        trueBooleano=false
    }).catch((err)=>{
        console.log(err.message);
    })   
    
})

app.post('/delete', (req,res)=>{
    // console.log(req.body['homework']);
    let idListDelete
        const id=req.body.checkHome
        List.findByIdAndRemove({_id:id})
            .then((err)=>{
                console.log(err);
                console.log('eliminada');
                res.redirect('/')
            }).catch((err)=>{
                console.log(err.message);
            }) 

        List.find({}).then((item)=>{
            console.log(item);
            let listdelete=item[item.length-1]
            idListDelete=listdelete.id
            console.log(listdelete.id);
            List.findByIdAndRemove({_id:idListDelete}).then((err)=>{
                console.log('deleted ths last');
                res.redirect('/')
            }).catch((err)=>{
                console.log(err.message);
            })
            console.log(idListDelete);
        }).catch((err)=>{
            console.log(err.message);
        })
        
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
  