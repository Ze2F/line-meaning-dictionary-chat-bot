export default {
  async fetch(request, env, ctx) {
    const lineData = await request.json();
    const messageType = lineData.events[0].message.type;
    const messageText = lineData.events[0].message.text;
    const replyToken = lineData.events[0].replyToken;

    let reply = {
      replyToken: replyToken,
      messages: []
    };

    const dictionaryAPIResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${messageText}`);
    const dictionaryData = await dictionaryAPIResponse.json();
    for (const meaning of dictionaryData[0].meanings) {
      reply.messages.push({
        type: 'text',
        text: `${meaning.partOfSpeech}: ${meaning.definitions[0].definition}`
      });
    }

    return await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env['line-token']}`
      },
      body: JSON.stringify(reply)
    });
  },
};