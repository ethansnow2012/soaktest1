const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.json());

const serviceAccount = require("./firebaseKeys.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xxxx.firebaseio.com"
})

const storedb = admin.firestore();

const indexHtml = fs.readFileSync (__dirname+'/dist/index2.js.html').toString()

app.get ('*', (req, res) => {
    res.set ('Cache-Control', 'public, max-age = 300, s-maxage = 600');
    res.status(200).send(indexHtml);    
});
//====================================
// T1 function
const fn_snapshot2Array = function(querySnapshot) {
    let _rtn = []
    querySnapshot.forEach(function(doc) {
        let el = doc.data()
        el['d_key'] = doc.id
        _rtn.push(el)
    });
    return _rtn
}
const verifyIdToken = async (token) =>{
    return admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            if(decodedToken){
                return decodedToken
            }
            return null
        })
        .catch((error) => {
            return null
        });
}
//====================================
// T2 function
const getMember = async (uid)=>{
    // let u = await admin.auth().getUser()
    // console.log(admin)
    let f_collection = storedb.collection("memberList")
    f_collection = f_collection.where("uid","==",uid)
    return f_collection
        .get()
        .then(fn_snapshot2Array)
}
//====================================
// T1 procedure interface
const get__Member__validToke = async (data, token)=>{
    let values = await Promise.all([getMember(data.uid), verifyIdToken(token)])
    return {existed:values[0], validToke:values[1]}
}
const httpReport = function(status=false ,msg=""){
    return {
        status,
        msg
    }
}


const log_check_emailSending = async (uid) =>{
    
    const docRef0 = storedb.collection('log_emailSending').doc();
    let docRef1 = storedb.collection('log_emailSending').where('uid','==',uid).where('createTime','>=',(new Date(Date.now() - 3*60*1000)))
    

    const existed = await docRef1.get().then(fn_snapshot2Array)
    if(existed.length>=3){
        return false
    }
    
    await docRef0.set({
        uid: uid,
        createTime: admin.firestore.Timestamp.now()
    })
    //return
    return true
}

app.post ('/endpoint/asyncMember', async (req, res) => {
    let {data,token} = req.body
    let {existed, validToke} = await get__Member__validToke(data, token)

    if(!validToke){
        res.json(httpReport(false, 'invalid toke'))
        return 
    }
    if(validToke.uid != data.uid){
        res.json(httpReport(false, 'invalid toke 1'))
        return
    }
    if(existed.length == 0){
        // should be auth by id
        // then do below
        const docRef = storedb.collection('memberList').doc();
        
        
        await docRef.set(data).then(()=>{
            res.json(data)                  //|| tech debt => interface inconsistant
            //res.json(httpReport(true))    //||
            return
        }).catch((x)=>{
            res.json(httpReport(false, 'error'))
            return
        })
        
    }else{
        res.json(existed[0])
        return
    }
})
app.post ('/endpoint/asyncMember_fb', async (req, res) => {
    try {
        let {data, token} = req.body

        let {existed, validToke} = await get__Member__validToke(data, token)
        if(!validToke){
            res.json(httpReport(false, 'invalid toke'))
            return 
        }
        if(validToke.uid != data.uid){
            res.json(httpReport(false, 'invalid toke 1'))
            return
        }
        // res.json("data1")
        // return
        if(existed.length == 1){
            const docRef = storedb.collection('memberList').doc(existed[0].d_key);

            // res.json({fb_session:{
            //     logSession_fb_me: data.fb_session.logSession_fb_me,
            // }})
            //return
            
                const aa = await docRef.update({fb_session:{
                    logSession_fb_me: data.fb_session.logSession_fb_me,
                }}).catch(function(error) {
                    //console.log(error);
                    throw error;
               })
            
            res.json({status:"binded"})
            return
        }
        res.json("data")
        return
    
    }
    catch(err) {
        res.json(err)
    }
})
app.post ('/endpoint/sendmail', async (req, res) => {
    let {data, token} = req.body
    let {existed, validToke} = await get__Member__validToke(data, token)
    const emailSending_status =  await log_check_emailSending(validToke.uid)
    if(!emailSending_status){
        res.json(httpReport(false, 'You send too many emails. Please try again later.'))
        return
    }
    if(!validToke){
        return
    }
    if(validToke.uid != data.uid){
        return
    }
    if(existed.length == 1){
        //return
        await fetch(`https://us-central1-function-hot-poker.cloudfunctions.net/hc-ec-mail/oak/send`,{
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data:existed[0],
                serverMeta:{
                    to: existed[0].email
                }
            }),
        })
        .then((x)=>{
            console.log(x)
            res.json(httpReport(true))
            return
        })
        .catch((x)=>{
            res.json(httpReport(false),"email sending failed")
            return
        })
    }
    
})

app.post ('/endpoint', async (req, res) => {
    let data = {}
    data['name'] = 'test'

    const docRef = storedb.collection('test1').doc();
    const rtn = await docRef.set(data)
})

exports.app = functions.https.onRequest(app);



