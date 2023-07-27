const apiKey = ""
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/styly', async function (req, res) {
    let {userMessages, assistantMessages, userage, userheight, usercolor} = req.body

    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    let messages = [
        {role: "system", content: "당신은 세계 최고의 퍼스널 스타일리스트입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 스타일리입니다. 당신은 각 개인의 개성과 취향에 맞추어 옷, 액세서리, 메이크업 등을 조합하여 최적의 스타일링을 제안할 수 있습니다. 퍼스널 컬러와 패션에 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 퍼스널 스타일리스트입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 스타일리입니다. 당신은 각 개인의 개성과 취향에 맞추어 옷, 액세서리, 메이크업 등을 조합하여 최적의 스타일링을 제안할 수 있습니다. 퍼스널 컬러와 패션에 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: "안녕하세요! 저는 스타일리입니다. 퍼스널 컬러와 스타일링에 관한 질문이 있으신가요? 어떤 것이든 물어보세요, 최선을 다해 답변해 드리겠습니다."},
        {role: "user", content: `저의 나이는 ${userage}이고 제 키는 ${userheight}입니다. 또한, 저에게 가장 잘 어울리는 색상은 ${usercolor}입니다.`},
        {role: "assistant", content: `당신의 나이가 ${userage}이고 키는 ${userheight}인 것을 확인했습니다. 또한, 당신에게 가장 잘 어울리는 색상은 ${usercolor}인 것 또한 확인했습니다. 퍼스널 컬러와 스타일링에 대한 것을 무엇이든 물어보세요 !`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

app.listen(3000)

