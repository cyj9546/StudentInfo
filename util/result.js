function formatData({msg='success',status=200}){
    if(status==400){
        msg='fail';
    }
    return {
        msg,
        status
    }
}
module.exports={
    formatData
}