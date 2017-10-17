<template>
    <div class="liveconfig">
        <p>{{msg}}</p>
        <input type="text" v-model="count"/><br>
        <button @click="start">Start</button>
        <button @click="terminate">Cancel</button>
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
