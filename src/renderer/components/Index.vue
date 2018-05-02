<template>
    <div class="layout" id="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="menu1" theme="dark" @on-select="menuClickHandle" width="auto" :class="menuitemClasses">
                    <MenuItem name="menu1" >
                        <Icon type="ios-circle-filled" style="color: #ffffff;"></Icon>
                        <span>新建任务 </span>
                    </MenuItem>
                    <MenuItem name="menu2" >
                        <Icon type="ios-circle-filled" style="color: #ff9900;"></Icon>
                        <span>未完成 ( {{readyList.length}} )</span>
                    </MenuItem>
                    <MenuItem name="menu3" >
                        <Icon type="ios-circle-filled" style="color: #19be6b;"></Icon>
                        <span>已完成 ( {{completeList.length}} )</span>
                    </MenuItem>
                    <MenuItem name="menu4" >
                        <Icon type="ios-circle-filled" style="color: #2d8cf0;"></Icon>
                        <span>全部任务 ( {{readyList.length + completeList.length}} )</span>
                    </MenuItem>
                    <MenuItem name="menu5" >
                        <Icon type="ios-circle-filled" style="color: #ed3f14;"></Icon>
                        <span>回收箱 ( {{recycleList.length}} )</span>
                    </MenuItem>
                </Menu>
                <div class="task-inout">
                    <div @click="taskFromLocal">
                        <Icon type="ios-download-outline"></Icon>
                        <span>导入任务</span>
                    </div>
                    <div  @click="taskToLocal">
                        <Icon type="ios-upload-outline"></Icon>
                        <span>导出任务</span>
                    </div>
                </div>
            </Sider>
            <Layout>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">

                    <!--<Button size="small" type="warning" @click.active="reLoadTask">刷新</Button>-->
                    <div v-if="currentnav == 'menu1'">
                        <div class="task-input-box">
                            <Input v-model="taskValue" type="textarea"
                                   placeholder="想要干点啥？" class="task-input"></Input>
                            <Button type="info" @click.native="selectTaskTag">GO</Button>
                        </div>
                        <transition name="fadeimg">
                        <div class="task-img-box" v-if="randimg !== ''">
                            <p class="task-text">{{imgtext.text}}</p>
                            <img  class="task-img" :src="'http://img-1252351090.cosbj.myqcloud.com/'+randimg+'.gif'" alt="">
                        </div>
                        </transition>
                    </div>
                    <div v-if="currentnav == 'menu2'">
                        <transition-group name="fade">
                        <Card class="taskItem"  v-for="(item,index) in readyList" :key="index">
                                <ButtonGroup class="item-setup">
                                    <Button size="small" type="primary" @click="editTask(item)">
                                        <Icon class="icon-item" style="color: #fff;" type="ios-compose-outline"></Icon>
                                    </Button>
                                    <Button size="small" type="primary" @click="changeComplete(item)">
                                        <Icon class="icon-item" style="color: #fff" type="android-checkbox-outline"></Icon>
                                    </Button>
                                    <Button size="small" type="primary" @click="delTask(item)">
                                        <Icon class="icon-item" style="color: #fff" type="android-close"></Icon>
                                    </Button>
                                </ButtonGroup>
                                <Dropdown class="tag-select">
                                    <Button :type="tagColor(item.tag)" size="small">
                                        {{tagTranlate(item.tag)}}
                                        <Icon type="arrow-down-b"></Icon>
                                    </Button>
                                    <DropdownMenu slot="list">
                                        <DropdownItem @click.native="resetTaskTag(item,3)">重要紧急</DropdownItem>
                                        <DropdownItem @click.native="resetTaskTag(item,2)">重要不紧急</DropdownItem>
                                        <DropdownItem @click.native="resetTaskTag(item,1)">紧急不重要</DropdownItem>
                                        <DropdownItem @click.native="resetTaskTag(item,0)">不重要不紧急</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            <div style="text-align:left">
                                <Input v-if="item.editing" @on-blur="blurSave(item)"  type="textarea"
                                       v-model="item.content"
                                       placeholder="想要干点啥？">{{item.content}}</Input>
                                <h4 v-else >{{item.content}}</h4>
                            </div>
                        </Card>
                        </transition-group>
                        <div v-if="!readyList.length" class="nulldata"><img  src="../assets/null.png" alt=""></div>
                    </div>
                    <div v-if="currentnav == 'menu3'">
                        <transition-group name="fade">
                        <Card class="taskItem"  v-for="(item,index) in completeList" :key="index">
                            <ButtonGroup class="item-setup">
                                <Button size="small" type="primary" @click="resetTask(item)">
                                    <Icon class="icon-item" style="color: #fff" type="reply"></Icon>
                                </Button>
                                <Button size="small" type="primary" @click="delTask(item)">
                                    <Icon class="icon-item" style="color: #fff" type="android-close"></Icon>
                                </Button>
                            </ButtonGroup>
                            <div style="text-align:left">
                                <h4>{{item.content}}</h4>
                            </div>
                        </Card>
                        </transition-group>
                        <div v-if="!completeList.length" class="nulldata"><img  src="../assets/null.png" alt=""></div>
                    </div>
                    <div v-if="currentnav == 'menu4'">
                        <h2 class="submenu-title" style="background: #ff9900;">未完成</h2>
                        <transition-group name="fade">
                            <Card class="taskItem"  v-for="(item,index) in readyList" :key="index">
                                <div style="text-align:left">
                                    <h4>{{item.content}}</h4>
                                </div>
                            </Card>
                        </transition-group>
                        <h2 class="submenu-title" style="background: #19be6b;">已完成</h2>
                        <transition-group name="fade">
                            <Card class="taskItem"  v-for="(item,index) in completeList" :key="index">
                                <div style="text-align:left">
                                    <h4>{{item.content}}</h4>
                                </div>
                            </Card>
                        </transition-group>
                    </div>
                    <div v-if="currentnav == 'menu5'">
                        <Button size="small" type="error" @click.active="allDel">全部删除</Button>
                        <transition-group name="fade">
                             <Card class="taskItem"  v-for="(item,index) in recycleList" :key="index">
                                 <ButtonGroup class="item-setup">
                                     <Button size="small" type="primary" @click="resetTask(item)">
                                         <Icon class="icon-item" style="color: #fff" type="reply"></Icon>
                                     </Button>
                                     <Button size="small" type="primary" @click="fulldelTask(item)">
                                         <Icon class="icon-item" style="color: #fff" type="android-close"></Icon>
                                     </Button>
                                 </ButtonGroup>
                                 <div style="text-align:left">
                                     <h4>{{item.content}}</h4>
                                 </div>
                             </Card>
                        </transition-group>
                        <div v-if="!recycleList.length" class="nulldata"><img  src="../assets/null.png" alt=""></div>
                    </div>
                </Content>
            </Layout>
        </Layout>
        <transition name="fade">
            <div class="select-task" v-if="taskTagShow">
                <div class="tag-box">
                    <Button @click="addTask(3)" type="error">重要<br/>紧急</Button>
                    <Button @click="addTask(2)" type="warning">重要<br/>不紧急</Button>
                    <Button @click="addTask(1)" type="success">紧急<br/>不重要</Button>
                    <Button @click="addTask(0)" type="info">不重要<br/>不紧急</Button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import imgText from '../gifdata';
    let ipc = require('electron').ipcRenderer;
    const fs = require('fs');
    const {dialog} = require('electron').remote;

    export default {
        name: "index-page",
        data(){
            return {
                isCollapsed: false,
                currentnav: 'menu1',
                taskValue: '',
                tasklist: [],
                taskTag:0,  //0默认为不重要也不紧急
                taskTagShow:false,
                imgtext:'',
                randimg:''
            }
        },
        computed: {
            readyList: function(){
                return this.tasklist.filter((item)=>{
                    return item.state == 0;
                }).sort((a,b)=>{
                    return b.tag - a.tag;
                })
            },
            completeList: function(){
                return this.tasklist.filter((item)=>{
                    return item.state == 1;
                }).sort((a,b)=>{
                    return b.tag - a.tag;
                })
            },
            recycleList: function(){
                return this.tasklist.filter((item)=>{
                    return item.state == 2;
                }).sort((a,b)=>{
                    return b.tag - a.tag;
                })
            },
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            menuClickHandle(menu){
                this.currentnav = menu;
            },
            selectTaskTag(){
                if(this.taskValue == ''){
                    this.$Message.warning('任务内容不能为空!');
                    return false;
                }
                this.taskTagShow = true;
            },
            resetTaskTag(item,tag){
                item.tag = tag;
                this.$nextTick(()=>{
                    this.saveToLocal();
                })
            },
            taskFromLocal(){
                let that = this;
                dialog.showOpenDialog(
                    { properties:
                            [ 'openFile',
                            ],
                        filters:[
                            {name:'JSON',extensions:['json']}
                        ]
                    },(path) => {
                        if(!path) return;
                        //拿到了本地选择的路径，再用fs,写入文件
                        let localPath = path[0];
                        try {
                            fs.readFile(localPath,(e,data) => {
                                if(e){
                                    that.$Message.error('导入失败');
                                }else{
                                    try {
                                        var jsondata = JSON.parse(data);
                                        if(jsondata.length>0){
                                            jsondata.map((item) => {
                                                return {
                                                    'content':item.content || '空',
                                                    'state':item.state || 0,
                                                    'editing':item.editing || false,
                                                    'tag':item.tag || 0,
                                                }
                                            })
                                            that.tasklist = jsondata;
                                            that.$Message.success('数据导入成功！');
                                            that.saveToLocal();
                                        }else{
                                            that.$Message.error('数据为空！');
                                        }
                                    }catch (err) {
                                        that.$Message.error('数据格式不合法！');
                                    }
                                    // if(jsondata instanceof Array && has(jsondata[0],'content'))
                                    // that.tasklist = JSON.parse(data);
                                    // that.saveToLocal()
                                }
                            })
                        }catch (e) {
                            console.log(e)
                        }

                    })
            },
            taskToLocal(){
                let that = this;
                dialog.showOpenDialog(
                    { properties:
                            [ 'openFile',
                              'openDirectory',
                              'multiSelections'
                            ]
                    },(path) => {
                        if(!path) return;
                        //拿到了本地选择的路径，再用fs,写入文件
                        let localPath = path[0];
                        let data = JSON.stringify(that.tasklist);

                        try {
                            fs.writeFile(localPath+'/C!todo.json',new Buffer(data),{flag:'w+',encoding:'utf8'},(e) => {
                                if(e){
                                    that.$Message.error('导出失败！')
                                }else{
                                    that.$Message.success('导出成功！')
                                }
                            })
                        }catch (e) {
                            console.log(e)
                        }

                    })
            },
            addTask(tag){
                this.tasklist.push({
                    content : this.taskValue,
                    state : 0,
                    editing : false,
                    tag : tag
                });
                this.$nextTick(()=>{
                    this.taskValue = '';
                    if (!this.$db.read().has('tasklist').value()) { // 先判断该值存不存在
                        this.$db.read().set('tasklist', this.tasklist).write() // 不存在就创建
                    }else{
                        this.$db.read().set('tasklist', this.tasklist).write() // 不存在就创建

                    }
                    this.taskTagShow = false;
                })

            },
            changeComplete(item){
                setTimeout(function () {
                    item.state = 1;
                    this.$nextTick(()=>{
                        this.saveToLocal();
                    })
                }.bind(this),100)
            },
            blurSave(item){
                item.editing = false;
                this.saveToLocal();
            },
            resetTask(item){
                item.state = (item.state == 2 ? 1 : 0);
                this.saveToLocal();
            },
            delTask(item){
                setTimeout(function () {
                    item.state = 2;
                    this.$nextTick(()=>{
                        this.saveToLocal();
                    })
                }.bind(this),100)
            },
            editTask(item){
                item.editing = true;
            },
            allDel(){
                this.tasklist = this.tasklist.filter((item)=>{
                    return item.state !== 2;
                });
                this.$nextTick(()=>{
                    this.saveToLocal();
                })
            },
            tagTranlate(tag){
                switch (tag){
                    case 0 : return '不重要不紧急';break;
                    case 1 : return '紧急不重要';break;
                    case 2 : return '重要不紧急';break;
                    case 3 : return '重要紧急';break;
                    default : return '不重要不紧急';break;
                }
            },
            tagColor(tag){
                switch (tag){
                    case 0 : return 'info';break;
                    case 1 : return 'success';break;
                    case 2 : return 'warning';break;
                    case 3 : return 'error';break;
                    default : return 'info';break;
                }
            },
            fulldelTask(item){
                let index = this.tasklist.indexOf(item);
                if(index > -1){
                    this.tasklist.splice(index, 1);
                }else{
                    return;
                }
                setTimeout(function () {
                    this.$nextTick(()=>{
                        this.saveToLocal();
                    })
                }.bind(this),500)
            },
            saveToLocal(){
                if (!this.$db.read().has('tasklist').value()) { // 先判断该值存不存在
                    this.$db.read().set('tasklist', this.tasklist).write() // 不存在就创建
                }else{
                    this.$db.read().set('tasklist', this.tasklist).write() // 不存在就创建
                }
            },
            reLoadTask(){
                if (!this.$db.read().has('tasklist').value()) { // 先判断该值存不存在
                    this.tasklist = [];
                }else{
                    this.tasklist = this.$db.read().get('tasklist').value();
                }
            },
            randomImgText(){
                this.randimg = '';
                setTimeout(()=>{
                    let rand = Math.floor(Math.random()*imgText.length);
                    while (rand == this.randimg) {
                        rand = Math.floor(Math.random()*imgText.length);
                    }
                    this.randimg = rand;
                    this.imgtext = imgText[rand];
                },1000)

            }
        },
        mounted(){
            this.reLoadTask();
            this.randomImgText();
            setInterval(() => {
                this.randomImgText();
            },30000)
        }
    }
</script>

<style scoped>
    .ivu-layout,.layout{
        height: 100%;
        overflow-x: hidden;
    }
    .layout{
        padding-top: 26px;
    }
    .layout .ivu-layout-content{
        padding-bottom: 5px;
    }

    .taskItem{
        margin-top: 10px;
        width: 100%;
        position: relative;
        padding-right: 100px;
        border-radius: 0;
    }
    .taskItem .ivu-dropdown-rel .ivu-btn{
        padding: 2px;
    }
    .ivu-layout-content{
        padding: 20px;
    }
    .item-setup{
        position: absolute;
        right: 0;
        top: 0;
        height: 30px;
        border-radius: 0 0  4px 4px;
        display: flex;
        justify-content: space-around;
        justify-items: right;
    }
    .item-setup .icon-item{
        font-size: 20px;
    }
    .ivu-layout-content{
        position: relative;
        z-index: 1000;
        right: -20px;
        overflow-x: hidden;
    }
    .submenu-title{
        font-size: 16px;
        padding: 5px 10px 5px 10px;
        font-weight: 500;
        color: #fff;
        margin-top: 20px;
    }
    .select-task{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background-color: rgba(0,0,0,.5);
    }
    .select-task .ivu-btn{
        width: 100px;
        height: 100px;
        border-radius: 50px;
        font-size: 16px;

    }
    .select-task .tag-box{
        position: absolute;
        top: 50%;
        left:50%;
        margin-left: -115px;
        margin-top: -115px;
        width: 230px;
        height: 230px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        display: flex;
        display: -webkit-flex;
    }
    h4{
        font-weight: 500;
        color: #454545;
    }
    .tag-select{
        position: absolute;
        right: 0;
        top: 30px;
        width: 88px;
    }
    .tag-select .ivu-btn{
        border-radius: 0 ;
        width: 88px;
    }
    .ivu-btn{
        border-radius: 0 ;
    }
    .task-input-box{
        display: flex;
        display: -webkit-flex;
        margin-bottom: 10px;
    }
    .task-input-box .ivu-input{
        border-radius: 0 ;
    }
    .task-inout{
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        color: rgba(255,255,255,.7);
        height: 30px;
        line-height: 30px;
        justify-content: space-around;
        width: 100%;
        border-top: 1px solid rgba(255,255,255,.4);
    }
    .task-inout>div{
        width: 50%;
        text-align: center;
        cursor: default;
    }
    .task-inout>div:hover{
        background: rgba(255,255,255,.1);
    }
    .task-inout>div:first-child{
        border-right: 1px solid rgba(255,255,255,.4);
    }
    .nulldata {
        text-align: center;
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);

    }
    .nulldata img{
        width: 200px;

    }
    .task-img-box{
        position: relative;
    }
    .task-img-box img{
        width: 100%;
        display: block;
    }
    .task-img-box p{
        position: absolute;
        right: 0;
        bottom: 20px;
        font-size: 14px;
        font-style: italic;
        color: #eee;
        text-shadow: 2px 7px 31px rgba(255,255,255,.96);
        padding: 0 6px 0 15px;
        border-radius: 24px 0 0 0;
        background: rgba(0,0,0,.6);
        letter-spacing: 1px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }
    .fadeimg-enter-active, .fadeimg-leave-active {
        transition: opacity 1s;
    }
    .fadeimg-enter, .fadeimg-leave-active {
        opacity: 0
    }
</style>