// ==========================================
// PHẦN 1: MAIN HANDLER (telegram-bot.js)
// ==========================================

exports.handler = async function(event, context) {
  // Chỉ chấp nhận POST request từ Telegram
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.trim();

      if (text === '/run') {
        await sendMessage(chatId, "⏳ Đang gửi lệnh kích hoạt workflow lên GitHub...");
        await triggerGitHubAction(chatId);
      } else if (text === '/start') {
        await sendMessage(chatId, "👋 Chào bạn! Hệ thống đã chạy trên Netlify. Gõ /run để đồng bộ Podcast.");
      }
    }

    // Trả về 200 OK ngay lập tức để chặn đứng chuỗi spam của Telegram
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (error) {
    console.error("Lỗi xử lý:", error);
    // Vẫn trả về 200 dù có lỗi nội bộ để Telegram không gửi lại (retry)
    return { statusCode: 200, body: JSON.stringify({ ok: true }) }; 
  }
};