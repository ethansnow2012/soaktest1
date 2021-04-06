<template>
  <div class="theWrapper" v-show="appState.sessionMounted.value" >
    <div class="btn" v-if="!appState.logSession.value" @click="e_google_login">
      Google Login
    </div>
    <div class="btn" v-if="appState.logSession.value" @click="e_google_logout">
      Google Logout
    </div>
    <div class="e-fb-info" v-if="appState.logSession_fb_me.value">
        <div >
            Facebook binded with:
        </div>
        <div style="margin-top:3px">
            <img :src="appState.logSession_fb_picture.value.url" alt=""
                style="width:50xp;height:50xp;margin-right:12px"
                v-if="appState.logSession_fb_picture.value"
            >
            <span>{{ appState.logSession_fb_me.value.name }}</span>
        </div>
    </div>
    <div v-if="appState.logSession.value" @click="e_fb_bind($event)"
        
        >
        <div :class="[
                    {'btn2': true}, 
                    {'added': (appState.logSession_fb_me.value && appState.logSession_fb_me.value.name)?true:false }
                ]" 
                id="btn-bind-fb" 
            >
            Bind with Facebook
            <img src="https://oaktest1-50022.web.app/aaa.gif"/>
        </div>
    </div>
  </div>
  
</template>
<script>
import { ref } from "vue";
import { ownLogin, getIdToken } from "@/modules/controller.js";
import appState from "@/modules/appState.js";
import {dfn__busy_prevent, hideOnClickOutside} from "@/_utils.js"

export default {
  name: "LoginBox",
  async setup(props, ctx) {
    const _appState = appState();
    return {
      appState: _appState,
      e_google_login: () => {
        _appState.appLoading.value = true
        firebaseGSignin((session) => {
          if (session) {
            console.log("getIdToken");
            let u_session = session.uid?session:session.user
            const {uid, email, displayName} = u_session
            const user_extracted = {
                uid,
                email,
                displayName
            }  
            _appState.logSession.value = user_extracted;
            ownLogin(user_extracted)
            // compile error for procedure: "async" key word
            // setTimeout for now
            setTimeout(()=>{
              _appState.appLoading.value = false
            },1000)
          }
          
        });
      },
      e_google_logout: () => {
        firebaseGSignout(() => {
          _appState.logSession.value = null;
          _appState.logSession_fb_me.value = null;
          _appState.logSession_fb_picture.value = null;
        });
      },
      e_fb_bind: dfn__busy_prevent(async(ev) => {
        console.log('ev')
        console.log(ev)
        FB.login(function (response) {
          if (response.authResponse) {
            const fetch_me  = function(){
                return new Promise((resolve)=>{
                    FB.api("/me?fields=picture,name", function (response) {
                        let {id, name} = response
                        let {picture:{data}} = response
                        _appState.logSession_fb_me.value = response;
                        _appState.logSession_fb_picture.value = data;
                        resolve()
                    });
                })
            }  
            fetch_me()
                .then(async()=>{
                    const user_extracted = _appState.logSession.value
                    user_extracted['fb_session'] = {}
                    user_extracted['fb_session']['logSession_fb_me'] = _appState.logSession_fb_me.value
                    const token = await getIdToken()
                    const user_extracted_raw = Object.assign({}, user_extracted)
                    fetch('/endpoint/asyncMember_fb', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: user_extracted_raw, 
                            token: token
                        }),
                        
                    })
                    
                })
            
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        });
        let _img = document.querySelector(".btn2 img")
        _img.style.display="block"
        hideOnClickOutside(_img)
        ev.stopPropagation();
      }),
    };
  },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .e-fb-info{
        border-bottom: 1px solid #8fc4de;
        border-left: none;
        border-right: none;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-bottom: ($margin-top-component/2*-1);
    }
    .e-fb-info > *{
        text-align:left;
        padding: 0 5px;
    }
    .btn{
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid $blue-sky;
        background: $blue-sky;
        background: linear-gradient(
                    148deg,
                    rgba(2,0,36,1) 0%, rgba(9,9,121,1) 3%, rgba(0,212,255,1) 100%);
        
        color: $primary-font-color;
        padding-bottom: 5px;
        padding-top: 5px;
        cursor: pointer;
        border-radius: 7px;
        transition: all 0.5 ease;
    }
    .btn:hover, .btn:focus {
        background: linear-gradient(176deg, rgba(2,0,36,1) 0%, rgba(49,9,121,1) 3%, rgba(255,0,0,1) 100%);
    }
    .btn2{
        margin-left: auto;
        width: max-content;
        cursor:pointer;
        position: relative;

    }
    .btn2 img{
        position: absolute;
        width: calc(100vw - 375px);
        display: none;
        z-index: 1;
        left: 0;
    }
    .btn2:hover{
        text-decoration: underline;
        text-underline-position: under;
    }
    .btn2.added::after{
        content: "↻";
        position: absolute;
        display: block;
        right: calc(100% + 5px);
        top: -1.5px;
    }
    .btn2.added::after{
        animation:spin 4s linear infinite;
    }
    @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
    // .btn2:active img{
    //     display: block;
    // }
</style>

