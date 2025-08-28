const memento = [
    {
        title: '第一次骑车',
        content: '小学三年级的一个夏天，爸爸推着那辆旧自行车在小区楼下陪我练习。我跌倒了好几次，膝盖破了皮，还忍不住哭了。可等到终于能自己摇摇晃晃骑出去时，风吹在脸上的那一瞬间，我觉得自己真的长大了一点。',
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    },
    {
        title: '大学寝室的夜晚',
        content: "那些深夜熄灯后的宿舍，几个人躺在床上小声聊天。有人讲八卦，有人规划未来，还有人偷偷在被窝里打游戏。窗外的风吹动窗帘，整个夜晚充满了自由和年轻的味道。",
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    },
    {
        title: '第一次远行',
        content: '毕业后，一个人背着双肩包去了陌生的城市。火车站里人来人往，我却带着点兴奋和不安。走在陌生街道上，看着新的风景，突然意识到——原来自己真的开始了属于自己的生活。',
        imgs: [
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png',
            'https://trudbot-md-img.oss-cn-shanghai.aliyuncs.com/1756213185034_image%20156.png'
        ]
    }
]

import { uiChoose } from "./ui-choose.js"

uiChoose(memento).then(res => {
    console.log(JSON.stringify(res, null, 2));
});