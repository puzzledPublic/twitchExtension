<template>
    <div class="viewer">
        <h1>{{msg}}</h1>
        <div class="add">
            <div class="add-button" @click="addUser" >Click</div>
        </div>
        <div class="add-outline"></div>
        <!--<extension-viewer-sub></extension-viewer-sub>-->
    </div>
</template>

<script>
import ExtensionViewerSub from './viewer/ViewerSub'
import axios from 'axios'

export default {
    name: 'extensionViewer',
    data() {
        return {
            msg: 'First Come First Served',
            token : '',
            isActive : true,
        }
    },
    created() {
        console.log('created');
        if(window.Twitch.ext){
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
    methods: {
        addUser() {
            if(this.isActive){
                this.msg = "waiting..";
                this.isActive = false;
                if (window.Twitch.ext) {
                    window.Twitch.ext.onAuthorized((auth) => {
                        axios.get('https://localhost:3000/ebs/fcfs', {
                            headers: {
                                //'x-extension-jwt': auth.userId
                                'User-Id' : auth.userId,
                                'Channel-Id' : auth.channelId
                            }
                        }).then((response) => {
                            console.log(response.data);
                        });
                    });
                }
            }
        },
        tempEvent(event){
            if(this.isActive){
                this.msg = "waiting..";
                this.isActive = false;
            }
            console.log('clicked');
        }
    },
    components: {
        ExtensionViewerSub
    }
}
</script>
<style>
.add {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 100%;
}

.add-button {
    transition: all 0.3s ease;
    background-color: #FFDB5F;
    height: 144px;
    width: 144px;
    border-radius: 72px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .07);
    cursor: pointer;
    text-align: center;
    line-height: 144px;
    text-transform: uppercase;
    font-weight: bold;
    color: #f7f7f7;
}
.add-button:hover {
    background-color: #FFC145;
}
.add-button:active {
  background-color: #FFC145;
  width: 80px;
}

</style>




