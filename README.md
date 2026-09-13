# Nuxt プレビュー認証サンプル

[記事](https://zenn.dev/pepabo/articles/lolipop-deploy-now-preview-basic-auth)のパスワード制限を試すサンプルです。

## 起動

```sh
npm ci
npm run dev
```

デプロイナウでGitHubリポジトリを連携し、環境変数の「プレビュー」に `PREVIEW_PASSWORD` を設定します。
プルリクエストを作成するとプレビューURLが発行されます。
環境変数が未設定なら認証を要求しません。
CookieにSecure属性を使うため、認証の確認にはHTTPS環境を使用します。

Cookie値はパスワードのBase64です。英数字のパスワードを使う、記事の簡易実装です。
