<template>

  <div id="app_root" :class="{'loading': appState.appLoading.value }">
    <router-view v-slot="{ Component }" :key="$route.path">
      <Suspense>
        <component :is="Component"  />
      </Suspense>
    </router-view>
  </div>
</template>

<script>
import { reactive, onMounted, ref, computed } from 'vue'
import { createWebHistory } from 'vue-router'
import { ownLogin, getIdToken } from "@/modules/controller.js";
import appState from '@/modules/appState.js'

export default {
  name: 'App',
  components:{
  },
  setup(props, ctx){
    const _appState = appState()
    //let ownLogin_once = false
    onMounted(()=>{
        firebase.auth().onAuthStateChanged(async function(google_user) {
          //console.log('onAuthStateChanged')
          if(google_user){
            // if(ownLogin_once){
            //   return
            // }
            if(!google_user.uid){
              return
            }
            const {uid, email, displayName} = google_user
            const user_extracted = {
              uid,
              email,
              displayName
            }
            let _session = await ownLogin(user_extracted)
            if(_session.fb_session){
              _appState.logSession_fb_me.value = _session
                                                .fb_session.logSession_fb_me
              _appState.logSession_fb_picture.value = _session
                                                      .fb_session
                                                      .logSession_fb_me.picture.data
            }
            delete _session.fb_session
            _appState.logSession.value = _session;

            //ownLogin_once = true
          }
          _appState.sessionMounted.value = true
          
        });
      
      
    })
    return {
      appState:_appState
    }

  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
a:-webkit-any-link {
  text-decoration: unset;
  color: unset
}

body {
  position: relative;
  margin: 0;
  height: 100vh;
  width: 100vw;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  min-height: 100vh;
  background: $blue-sky;
  /* padding-left: 8px;
  padding-right: 8px; */
  /* margin-top: 60px; */
}
:root{
  
}
#app_root{
  position: relative;
}
#app_root.loading::before{
  content: "";
  position: absolute;
  top: 0;
  width: 100%;
  height: 2px;
  background: red;
  left: 0;
  animation: slideleft 2s infinite;
}
@keyframes slideleft {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>
