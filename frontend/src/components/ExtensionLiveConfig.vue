<template>
    <div class="liveconfig">
        <p>{{msg}}</p>
        <input type="text" v-model="count"/> 
        <button @click="start">시작</button>
        <button @click="terminate">취소</button>
        <p v-for="item in list" :key="item">{{item}}</p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'extensionLiveConfig',
    data() {
        return {
            msg: 'This is Live_Config Page',
            count: 0,
            list: [],
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
                console.log(message);
                console.log(typeof message);
                let con = JSON.parse(message.toString());
                console.log(typeof con);
                if(con.code === 'success'){
                    console.log('success');
                    this.msg = con.result;
                }
            });
        }
    },
    methods : {
        start() {
            axios.post('https://localhost:3000/ebs/fcfs/config',{
                count : this.count,
                openFlag : true,
                channelId : this.channelId
            }).then((response) => {
                this.msg = response.data;
            });
        },
        terminate() {
            axios.post('https://localhost:3000/ebs/fcfs/config',{
                openFlag : false,
                channelId : this.channelId
            }).then((response) => {
                this.msg = response.data;
            });
        }
    }
}
</script>
