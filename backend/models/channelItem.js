
class channelItem{
    constructor(channelId, openFlag, count){
        this.channelId = channelId;
        this.list = [];
        this.openFlag = openFlag || false;
        this.count = count || 0;
    }
    initList(){
        this.list = [];
    }
    getChannelId() {
        return this.channelId;
    }
    setChannelId(channelId){
        this.channelId = channelId;
    }
    getOpenFlag() {
        return this.openFlag;
    }
    setOpenFlag(openFlag) {
        this.openFlag = openFlag;
    }
    setCount(count) {
        this.count = count;
    }
    addUser(userId) {
        this.list.push(userId);
    }
    getFcfsList() {
        return this.list.slice(0, this.count);
    }
    isFull() {
        if(this.list.length == this.count){
            return true;
        }
        return false;
    }

    
}

module.exports = channelItem;