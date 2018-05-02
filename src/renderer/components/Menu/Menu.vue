<template>
    <div class="menu">
        <div class="drag-area" style="-webkit-app-region: drag" >
            {{dateString}}
        </div>
        <div class="menu-item" @click="smallwin"><Icon type="android-remove-circle"></Icon></div>
        <div class="menu-item" @click="maxwin"><Icon type="android-add-circle"></Icon></div>
        <div class="menu-item" @click="closewin"><Icon type="android-cancel" ></Icon></div>
    </div>
</template>

<script>
    let ipc = require('electron').ipcRenderer;

    export default {
        name: "menu-page",
        data(){
            return {
                timer : '',
                dateString:''
            }
        },
        methods:{
            closewin(){
                ipc.send('window-close');
            },
            smallwin(){
                ipc.send('window-min');
            },
            maxwin(){
                ipc.send('window-max');
            },
            nowTime(){
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.dateString = new Date().toLocaleString();
                    this.nowTime()
                },1000)
            }
        },
        mounted(){
            this.nowTime();
        }
    }
</script>

<style scoped>
    .drag-area{
        padding-left: 10px;
        letter-spacing: 1px;
    }
    .menu{
        height: 26px;
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }
    .menu .ivu-icon{
        font-size: 20px;
        margin: 0 auto;
    }
    .menu>div{
        display: flex;
        align-items: center;
        height: 100%;
        width: 30px;
    }
    .menu>.menu-item:hover{
        background: rgba(80,80,80,.2);
    }
    .menu .drag-area{
        width: 100%;
        flex: 1;
    }
</style>