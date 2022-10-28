<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>



<script>
import config from '../config.js';
export default {
  data(){
    return{
      ws: null,
      isOpen: false,
      nowPath: "",
       router: {
       "/": { prev: "", next: "/cloud" },
        "/cloud": { prev: "/", next: "/cloudcase" },
        "/cloudcase": { prev: "/cloud", next: "/light" },
        "/light": { prev: "/cloudcase", next: "/lightcase" },
        "/lightcase": { prev: "/light", next: "/5g" },
        "/5g": { prev: "/lightcase", next: "/5gcase" },
        "/5gcase": { prev: "/5g", next: "/" },
        0: "/",
        1: "/cloud",
        2: "/light",
        3: "/5g",
      },
    }
  },
  mounted() {
    // this.init();
    // setInterval(() => {
    //   if (!this.isOpen) {
    //     this.init();
    //   }
    // }, 10000);
    this.getPath();

    window.onload = () => {
      this.autofit()
    }
    window.onresize = () => {
      this.autofit()
    }
  },
  methods:{
    autofit() {
      const width = document.documentElement.clientWidth
      const height = document.documentElement.clientHeight
      const W = 3840
      const H = 2160

      const scaleW = width / W
      const scaleH = height / H

      console.log(width, height)

      console.log(scaleW, scaleH)

      const scale = scaleW > scaleH ? scaleH : scaleW

      const $app = document.getElementById('app')
      $app.style.transform = `scale(${scale})`;
      $app.style.transformOrigin = "0% 0%";
      $app.style.position = "absolute";
      if (scaleW > scaleH) {
        $app.style.left = `${(width - scale * W) / 2}px`
      } else {
        $app.style.top = `${(height - scale * H) / 2}px`
      }
    },
    init() {
      let user = JSON.stringify({
        action: "REGISTER",
      });
      // 初始化对象建立连接
      this.ws = new WebSocket(config.WS_SERVER);
      this.ws.onopen = () => {
        console.log("服务器连接成功！");
        this.isOpen = true;
        this.ws.send(user);
      };
      this.ws.onclose = () => {
        console.log("服务器连接失败");
        this.isOpen = false;
        this.ws = null;
      };
      this.ws.onerror = function (err) {
        console.log(err);
      };
      // 监听事件，服务器传回来值
       this.ws.onmessage = (msg) => {
        // 服务器指令
        if (msg.data) {
          let d = JSON.parse(msg.data);
          console.log("这是服务器传回的消息>>", msg.data);
          if (d) {  
            if(d.command==='prev'){
              this.prevChange();
            }else if(d.command==='next'){
              this.nextChange();
            }else{
              const path = this.router[d.command]
              this.$router.push(path)
              this.nowPath = path
            }
          }
        } else {
          console.log("err:没有数据！");
        }
      };
    },
    getPath() {
      this.nowPath = this.$route.path;
    },
    prevChange() {
      let path = this.router[this.nowPath].prev;
      if (path) {
        this.$router.push(path);
        this.nowPath = path;
      }
    },
    nextChange() {
      let path = this.router[this.nowPath].next;
      if (path) {
        this.$router.push(path);
        this.nowPath = path;
      }
    },
  },
  watch: {
    $route: "getPath",
  },
}
</script>
<style lang="less">
*{
    margin: 0;
    padding: 0;
}
html,body{
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
}
#app{
  width: 3840px;
  height: 2160px;
  box-sizing: border-box;
  overflow: hidden;
  ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
}
</style>
