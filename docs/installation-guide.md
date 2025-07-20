# App Icon Exporter インストールガイド

## 必要な環境

- Adobe Photoshop 2022 以降 (バージョン 23.3.0+)
- UXP Developer Tool (Adobe Creative Cloud Desktop経由でインストール)
- macOS または Windows

## インストール手順

### 1. リポジトリの取得

```bash
git clone git@github.com:Nakamuro-unl/AppIconExporter.git
cd AppIconExporter
```

### 2. UXP Developer Toolのインストール

1. Adobe Creative Cloud Desktopアプリを開く
2. 「アプリ」タブから「UXP Developer Tool」を検索
3. 「インストール」をクリック

### 3. Photoshopで開発者モードを有効化

1. Photoshop → 環境設定 → プラグイン
2. 「開発者モードを有効にする」にチェック
3. Photoshopを再起動

### 4. プラグインの読み込み

1. UXP Developer Toolを起動
2. 「Add Plugin...」ボタンをクリック
3. クローンしたフォルダ内の `manifest.json` ファイルを選択
4. 「Load」をクリック
5. Photoshopの「プラグイン」メニューに「App Icon Exporter」が表示されます

## 開発モードでの読み込み

開発中は「Load & Watch」を使用することで、ファイル変更時に自動リロードされます。

1. UXP Developer Toolで「Load & Watch」をクリック
2. ファイルを変更すると自動的にプラグインがリロードされます

## トラブルシューティング

### プラグインが表示されない場合

1. Photoshopの環境設定で「開発モード」が有効になっているか確認
2. UXP Developer Toolでプラグインのステータスを確認
3. manifest.jsonの内容が正しいか確認

### 権限エラーが発生する場合

manifest.jsonに必要な権限が含まれているか確認：
```json
"requiredPermissions": [
  "localFileSystem",
  "ipc",
  "clipboard"
]
```

### プラグインが動作しない場合

1. Photoshopを再起動
2. UXP Developer Toolでプラグインをリロード
3. ブラウザの開発者ツールでエラーログを確認（UXP Developer Tool内）