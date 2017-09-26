<template>
    <div class="viewer">
        <h1>{{msg}}</h1>
        <div class="add">
            <div class="add-button" @click="addUser">Button</div>
        </div>
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
            token : ''
        }
    },
    created: function() {

    },
    methods: {
        addUser: function() {
            if (window.Twitch.ext) {
                window.Twitch.ext.onAuthorized(function(auth) {
                    axios.get('/ebs/fcfs', {
                        headers: {
                            'x-extension-jwt': auth.userId
                        }
                    }).then(function(response) {
                        console.log(response.data);
                    });
                });
            }
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
    background-color: #FFC145;
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
</style>




