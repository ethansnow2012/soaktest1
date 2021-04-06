import appState from "./appState";

const _appState = appState()


export async function ownLogin(user_extracted){
    const token = await getIdToken()
    return fetch('/endpoint/asyncMember', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: user_extracted, token: token}),
        
    }).then((res)=>{  
      return res.json();
    }).then((json)=>{
      return json
    })
}
export async function getIdToken(){
    return firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)//.then((x)=>{ console.log(x) })
}


export default function Controller(){
    

    return {
        
    }
}
