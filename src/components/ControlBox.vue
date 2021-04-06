<template>
  <div class="theWrapper selfWrapper-fghdjslk" style="width:100%">
      <BigRedButton v-if="appState.logSession_fb_me.value" 
                    @click="send_email" 
                    :text="'寄信'" 
                    :active="bigRedButton_active" 
                    style="margin-left: auto;display:block">
      </BigRedButton>
  </div>
</template>
<script>
import { ref } from "vue";
import { ownLogin, getIdToken } from "@/modules/controller.js";
import appState from "@/modules/appState.js";
import BigRedButton from "@/components/BigRedButton.vue"
import {dfn__busy_prevent} from "@/_utils.js"

export default {
  name: "ControlBox",
  components: {
    BigRedButton
  },
  async setup(props, ctx) {
    const _appState = appState();
    let bigRedButton_active = ref(new Proxy({
        value: false
        },{})
      )
    return {
      appState: _appState,
      bigRedButton_active,
      send_email: dfn__busy_prevent(()=>{
        let send = async()=>{
            bigRedButton_active.value.value = true
            const user_extracted = _appState.logSession.value
            user_extracted['fb_session'] = {}
            user_extracted['fb_session']['logSession_fb_me'] = _appState.logSession_fb_me.value
            
            const token = await getIdToken()
            const user_extracted_raw = Object.assign({}, user_extracted)
            fetch('/endpoint/sendmail', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: user_extracted_raw, 
                    token: token
                }),
            }).then((rsp)=>{
              return rsp.json()
            }).then((json)=>{
              console.log(json)
              if(json.status){
                // nop
                alert("信件寄出")
              }else{
                alert(json.msg)
              }
              bigRedButton_active.value.value = false
              return
            })
            
        }
        send()
      },
      bigRedButton_active
      ),
      
    };
  },
  props: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .selfWrapper-fghdjslk > *{
    min-width: unset !important;
  }
</style>

