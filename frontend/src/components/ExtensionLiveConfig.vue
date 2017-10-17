<template>
    <div class="liveconfig">
        <h3>{{msg}}</h3>
        <div>
            <div class="value">{{count}}</div>
            <input type="range" min="1" max="30" v-model="count"/><br>
            <button @click="start">Start</button>
            <button @click="terminate">Cancel</button>
        </div>
        <p>{{msg2}}</p>
        <div class="list">
            <p v-for="(list, index) in lists" :key="list">{{index+1}}. {{list}}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'extensionLiveConfig',
    data() {
        return {
            msg: 'Input the number of people',
            msg2: '',
            count: 0,
            lists: '',
            channelId : ''
        }
    },
    created() {
        console.log('created on liveConfig');
        if(window.Twitch.ext){
            window.Twitch.ext.onAuthorized((auth)=>{
                this.channelId = auth.channelId;
            });
            window.Twitch.ext.listen("broadcast", (target, contentType, message)=>{
                let con = JSON.parse(message.toString());
                //console.log(message);
                if(con.code === 'success'){
                    console.log('success');
                    this.msg2 = 'Result';
                    this.lists = con.result;
                }
            });
        }
    },
    methods : {
        start() {
            if(this.count < 1 || this.count >30){
                this.msg2 = 'At least 1';
                return;
            }
            axios.post(`https://${process.env.HOSTNAME}/ebs/fcfs/config`,{
                count : this.count,
                openFlag : true,
                channelId : this.channelId
            }).then((response) => {
                this.msg2 = response.data.data;
            });
        },
        terminate() {
            axios.post(`https://${process.env.HOSTNAME}/ebs/fcfs/config`,{
                openFlag : false,
                channelId : this.channelId
            }).then((response) => {
                this.msg2 = response.data.data;
            });
        }
    }
}
</script>
<style>
button{
  background:#392e5c;
  color:#fff;
  border:none;
  position:relative;
  margin-top: 20px;
  font-size:1.2em;
  cursor:pointer;
  transition:800ms ease all;
  outline:none;
}
button:hover{
  background:#fff;
  color:#392e5c;
}
button:before,button:after{
  content:'';
  position:absolute;
  top:0;
  right:0;
  height:2px;
  width:0;
  background: #392e5c;
  transition:400ms ease all;
}
button:after{
  right:inherit;
  top:inherit;
  left:0;
  bottom:0;
}
button:hover:before,button:hover:after{
  width:100%;
  transition:800ms ease all;
}

.value {
  text-align: center;
  font-weight: bold;
  font-size: 3em;
  margin: 10px auto;
  text-shadow: white 2px 2px 2px;
}

input[type="range"]{
  -webkit-appearance:none;
  width:200px;
  height:2px;
  background: white;
  background-position:center;
  background-repeat:no-repeat;
  position: absolute;
  top: 0px;
  bottoM: 0px;
  left: 0px;
  right: 0px;
  margin: auto;
}

input[type="range"]::-webkit-slider-thumb{
  -webkit-appearance:none;
  width:20px;
  height:20px;
  border-radius: 100%;
  background: #392e5c;
  position:relative;
  border: 10px solid rgba(0,0,0,.3);
  z-index:3;
  cursor: pointer;
}
</style>
