import {
  parseCookies,
  readFormData,
  setCookie,
  sendRedirect,
  setResponseStatus,
  setResponseHeader,
  send,
} from 'h3'

const renderForm = (errorMessage = '') => `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preview Access</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: grid; place-content: center; min-height: 100vh; margin: 0; background: #f8f9fa; color: #1a1a1a; }
    form { background: #ffffff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); width: 100%; max-width: 320px; box-sizing: border-box; }
    h1 { font-size: 1.25rem; margin: 0 0 1rem; }
    label { display: block; font-size: 0.875rem; margin-bottom: 0.5rem; color: #555; }
    input[type="password"] { width: 100%; padding: 0.625rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1rem; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.625rem; background: #0066cc; color: #ffffff; border: none; border-radius: 4px; font-weight: bold; font-size: 1rem; cursor: pointer; }
    button:hover { background: #0052a3; }
    .error { color: #d32f2f; font-size: 0.875rem; margin: 0 0 1rem; }
  </style>
</head>
<body>
  <form method="POST">
    <h1>パスワード制限</h1>
    ${errorMessage ? `<p class="error">${errorMessage}</p>` : ''}
    <label for="password">パスワードを入力してください</label>
    <input type="password" id="password" name="password" required autofocus>
    <button type="submit">ログイン</button>
  </form>
</body>
</html>`

export default defineNitroPlugin((nitroApp) => {
  const PASSWORD = process.env.PREVIEW_PASSWORD
  const COOKIE_NAME = 'preview_session'

  if (!PASSWORD) {
    return
  }

  const expectedToken = Buffer.from(PASSWORD).toString('base64')

  nitroApp.hooks.hook('request', async (event) => {
    // 1. 認証済み Cookie のチェック
    const cookies = parseCookies(event)
    if (cookies[COOKIE_NAME] === expectedToken) {
      return
    }

    // 2. パスワードフォーム（POST）の処理
    if (event.method === 'POST') {
      const body = await readFormData(event)
      if (body.get('password') === PASSWORD) {
        setCookie(event, COOKIE_NAME, expectedToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7日間有効
          path: '/',
        })
        return sendRedirect(event, event.node.req.url || '/', 303)
      }

      setResponseStatus(event, 401)
      setResponseHeader(event, 'content-type', 'text/html; charset=utf-8')
      await send(event, renderForm('パスワードが正しくありません'))
      return
    }

    // 3. 未認証のリクエストにはパスワードフォームを返す
    setResponseStatus(event, 401)
    setResponseHeader(event, 'content-type', 'text/html; charset=utf-8')
    await send(event, renderForm())
  })
})
