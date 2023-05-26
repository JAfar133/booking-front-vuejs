<template>
  <template :key="input.id" v-for="input in inputs">
    <input
        type="tel"
        :ref="input.id"
        v-model="input.value"
        :id="input.id"
        @keydown="inputKeyDown"
        @input="codeInput"
        @paste="pasteCode"
        :class="{'danger': clientError.code}"
    >
  </template>
</template>
<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "CodeInput",
  props: {
    clientError:{
      type:Object,
      required: false
    }
  },
  emits:{
    showCode: (code)=> {
      if(code && code.length===6){
        return true
      }
      else{
        console.warn('invalid code');
        return false;
      }
    }
  },
  data(){
    return {
      inputs:[
        {id:"1",value:""},
        {id:"2",value:""},
        {id:"3",value:""},
        {id:"4",value:""},
        {id:"5",value:""},
        {id:"6",value:""},
      ],
      code: ""
    }
  },
  methods: {
    inputKeyDown(event){
      const inputId = Number(event.target.id)
      if (event.keyCode === 8) {
        if(inputId>1){
          if(this.inputs[inputId-1].value!==""){
            this.inputs[inputId-1].value=""
          }
          else document.getElementById(String(inputId-1)).focus();
        }
      }
      if(event.keyCode === 37){
        if(inputId>0){
          document.getElementById(String(inputId-1)).focus();
        }
      }
      if(event.keyCode === 39){
        if(inputId<6){
          document.getElementById(String(inputId+1)).focus();
        }
      }
    },
    codeInput(input){
      const value = input.target.value;
      const id = Number(input.target.id);

      this.inputs[id-1].value = this.inputs[id-1].value.slice(0,1)
      if(isNaN(value)){
        this.inputs[id-1].value = value.replace(/\D/g, '');
      }
      if(this.inputs[id-1].value!=="" && id!==this.inputs.length){
        document.getElementById(String(id+1)).focus();
      }

      for(input of this.inputs){
        if(input.value!=="") {
          this.code+=input.value;
        }
      }
      if(this.code.length===this.inputs.length){
        this.$emit('showCode',this.code);
      }
      else {
        this.code = '';
      }
    },
    pasteCode(event){
      const inputId = Number(event.target.id);
      const inputData = event.clipboardData.getData('text/plain');
      let pos = 0;
      for (let i = inputId-1; i < inputData.length+inputId-1; i++) {
        this.inputs[i].value = inputData.slice(pos,pos+1)
        document.getElementById(String(i+1)).focus();
        pos++;
      }
    },
  }
})
</script>


<style scoped>
input{
  font-size: 25px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
  border: none;
  border-bottom: 2px solid #aaaab3;
  width:40px;
}
input.danger{
  border-bottom: 2px solid #DA0916;
}
</style>