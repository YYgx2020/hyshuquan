// export function test(params) {
//   console.log(1);
//   setTimeout(async () => {
//     await console.log(3);
//   })
//   console.log(2);
// }

export const myFun = async () => {
  return new Promise(resolve => {
    setTimeout(() => { // 用定时器模拟异步请求
      const data = [{
          id: 1,
          name: 'xiaoming',
          age: 11
        },
        {
          id: 2,
          name: 'xiaohong',
          age: 22
        },
        {
          id: 3,
          name: 'xiaogang',
          age: 33
        },
      ];
      resolve(data);
    },);
  });
}
// const myFun2 = async () => {
//   res = await myFun();
//   console.log('res:', res);
// }