<template>
  <div class="control title">{{title?(title+':'):''}}</div>
  <div class="container">
    <div class="switch" @click="change($event)">
      <div class="background-container">
        <div :class="'background '+(value?'checked':'')"></div>
      </div>
      <div :class='"box "+(value?"checked":"")'></div>
    </div>
  </div>
</template>

<script lang="ts">


export default {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData', 'title'],
  name: "VueBoolComponent",
  data(){
    return {
      value: false
    }
  },
  methods: {
    change(e:any){
      console.log(e.target.checked)
      this.value = !this.value;
      this.update();
    },
    update() {
      //console.log("Bool-Control-Update:",this.value);
      if (this.ikey)
        this.putData(this.ikey, this.value)
      this.emitter(this.value);
    }
  },
  mounted() {
    this.value = this.getData(this.ikey) || false;
  }
};

</script>

<style scoped>

.container{
  width: 100px;
  padding: 0;
}

.switch {
  border: 1px solid #8cb6ff;
  width: 50px;
  height: 20px;
  display: flex;
  background: white;
  border-radius: 20px;
  align-items: center;
}

.box{
  position: absolute;
  z-index: 5;
  border-radius: 25px;
  background: #5188ea;
  border: 2px solid #8cb6ff;
  height: 27px;
  width: 27px;
  translate: -5px;
  transition: translate 0.1s linear;
}

.box.checked{
  translate: 30px;
  transition: translate 0.1s linear;
}

.background-container{
  position: absolute;
  border-bottom-left-radius: 40px;
  border-top-left-radius: 40px;
  height: 20px;
  overflow: hidden;
}

.background{
  background: #6f9aea;
  width: 0;
  height: 30px;
  transition: width 0.1s linear;
}
.background.checked{
  width: 35px;
  transition: width 0.1s linear;
}



.title{
  color: white;
}
</style>