<template>
    <div class="liveconfig">
        <p>{{msg}}</p>
        <input type="text" v-model="count"/> 
        <button @click="start">시작</button>
        <button @click="terminate">취소</button>
        <button @click="result">결과</button>
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
            list: []
        }
    },
    methods : {
        start : function () {
            var that = this;
            axios.post('/ebs/fcfs/config',{
                count : this.count,
                isOpen : true
            }).then(function(response){
                that.msg = response.data;
            });
        },
        terminate : function () {
            var that = this;
            axios.post('/ebs/fcfs/config',{
                isOpen : false
            }).then(function(response){
                that.msg = response.data;
            });
        },
        result : function () {
            var that = this;
            axios.get('/ebs/fcfs/result').then(function (response){
                that.list = response.data;
            });
        }
    }
}
</script>
