RecoTw Stub
===========

[![][workflow-badge]][workflow-link]

RecoTw Explorer のスタブサーバーとして動作します。

## ビルド

```bash
$ npm run build
```

## エンドポイント

### RecoTw API

```
GET /recotw/1/tweet/get_tweet_all[?since_id={id}]
```

登録されているすべてのツイートを取得します。
`all_tweets.json` をレスポンスとして返します。

`since_id` が指定された場合は常に `[]` を返します。

### Icon API

```
GET /icon/{screen_name}
```

指定したユーザー名の Twitter アイコンの URL にリダイレクトします。
ユーザーを取得するときにエラーが発生した場合はデフォルトアイコンの URL にリダイレクトします。

[workflow-link]:    https://github.com/RecoTwExplorer/RecoTwStub/actions?query=branch:master
[workflow-badge]:   https://img.shields.io/github/workflow/status/RecoTwExplorer/RecoTwStub/CI%20Workflow/master.svg?style=flat-square
