<template>
    <button :class="{ 'active': active.value }" >
        <span>
            {{props.text}}
        </span>
    </button>
</template>
<script>


export default {
  name: 'BigRedButton',
  props: {
      text: String,
      active: Object // expecting type of proxy
  },
  async setup(props, ctx) {
    return {
        props,
        active: props.active?props.active:{}
    }    
  },
  
}
</script>


<style scoped>
    button {
        /* this button "copy from": https://codepen.io/dudleystorey/pen/zqgGn */
        border-radius: 50%;
        padding: 7px;
        border: none;
        color: white;
        font-family: Avenir, Arial, sans-serif;
        font-weight: 900;
        font-size: 1rem;
        background: red;
        text-shadow: 0 3px 1px rgb(122 17 8 / 80%);
        box-shadow: 0 8px 0 rgb(183 9 0), 0 15px 20px rgb(0 0 0 / 35%);
        text-transform: uppercase;
        transition: .3s all ease-in;
        outline: none;
        cursor: pointer;
        text-align: center;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        position: relative;
        top: 0;
    }
    button.active {
        top: 3px;
        box-shadow: 0 5px 0 rgb(183 9 0), 0 12px 20px rgb(0 0 0 / 35%);
    }
</style>

