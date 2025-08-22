import { recommandTheme } from "./recommand-theme.js";

recommandTheme(`
我想记录我的大学生活    
`).then(res => {
    console.log("推荐主题和场景词：", res);
}).catch(err => {
    console.error("推荐主题和场景词失败：", err);
})

