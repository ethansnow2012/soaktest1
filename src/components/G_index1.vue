<template>
  <div class="theWrapper selfWrapper" style="">
    <LoginBox></LoginBox>
    <ControlBox></ControlBox>
  </div>
  
</template>
<script>
import {ref} from "vue"
import LoginBox from "@/components/LoginBox"
import ControlBox from "@/components/ControlBox"

export default {
  name: 'G_index1',
  components: {
    LoginBox,
    ControlBox
  },
  async setup(props, ctx) {
    return {
        
    }    
  },
  props: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .selfWrapper{
      margin:auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
  }
  
</style>

