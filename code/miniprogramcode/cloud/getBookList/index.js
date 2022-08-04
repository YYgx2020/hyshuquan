// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'shuquan-5g315jeg71bca5e1',
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('books')
  // 从数据库中随机返回20条数据
  .aggregate()
  .sample({
    size: 10
  })
  // .field({
  //   ISBN: false,
  //   author: false,
  //   authorBrief: false,
  //   bookBrief: false,
  //   catalogue: false,
  //   comments: false,
  //   pages: false,
  //   press: false,
  //   subcat: false,
  //   year: false,
  //   _id: false,
  //   translator: false,
  //   id: true,
  //   nums: true,
  //   cover: true,
  //   bookName: true,
  //   price: true
  // })
  .end()
  
}