// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'shuquan-5g315jeg71bca5e1',
})
const db = cloud.database()//初始化完成后，引出database
// 云函数入口函数
exports.main = async (event, context) => {
  //在main函数返回collection().get(),实现在云函数中新增数据
  try {
    return await db.collection("users").add({
      data: {
        userName: event.nickName,
        userAvatar: event.avatarUrl,
        userPhone: '',
        address: '',
        shoppingCartID: '',
        collections: [],
        openid: event.openid,
      },
    })
  } catch (e) {
    console.error(e)
  }
}