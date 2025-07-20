# App Icon Exporter 使用ガイド

## 基本的な使用方法

### 1. PSDファイルの準備

1. Photoshopでアプリアイコン用のPSDファイルを開く
2. アイコンデザインが正方形になっていることを確認
3. 高解像度（推奨: 1024x1024以上）で作成しておく

### 2. プラグインの起動

1. Photoshopメニューから「プラグイン」→「App Icon Exporter」を選択
2. パネルが表示されます

### 3. エクスポート設定

#### プラットフォーム選択
- **iOS**: iOSアプリ用アイコンをエクスポート
- **Android**: Androidアプリ用アイコンをエクスポート
- 両方選択することも可能

#### エクスポートオプション
- **App Icons**: アプリアイコン（必須サイズ）
- **Store Assets**: ストア用スクリーンショット（今後実装予定）

#### 出力ディレクトリ
1. 「Browse」ボタンをクリック
2. 出力先フォルダを選択

### 4. エクスポート実行

「Export Icons」ボタンをクリックしてエクスポートを開始します。

## 出力されるファイル

### iOS向け

```
output/
└── ios/
    ├── AppStore.png (1024x1024)
    ├── iPhone-60@3x.png (180x180)
    ├── iPhone-60@2x.png (120x120)
    ├── iPhone-Settings-29@3x.png (87x87)
    ├── iPhone-Settings-29@2x.png (58x58)
    ├── iPhone-Spotlight-40@3x.png (120x120)
    ├── iPhone-Spotlight-40@2x.png (80x80)
    ├── iPhone-Notification-20@3x.png (60x60)
    ├── iPhone-Notification-20@2x.png (40x40)
    ├── iPad-Pro-83.5@2x.png (167x167)
    ├── iPad-76@2x.png (152x152)
    ├── iPad-76.png (76x76)
    ├── iPad-Spotlight-40@2x.png (80x80)
    ├── iPad-Spotlight-40.png (40x40)
    ├── iPad-Settings-29@2x.png (58x58)
    ├── iPad-Settings-29.png (29x29)
    ├── iPad-Notification-20@2x.png (40x40)
    └── iPad-Notification-20.png (20x20)
```

### Android向け

```
output/
└── android/
    ├── play-store-512.png (512x512)
    ├── ic_launcher-xxxhdpi.png (432x432) - アダプティブアイコン
    ├── ic_launcher-xxhdpi.png (324x324)
    ├── ic_launcher-xhdpi.png (216x216)
    ├── ic_launcher-hdpi.png (162x162)
    ├── ic_launcher-mdpi.png (108x108)
    ├── ic_launcher_legacy-xxxhdpi.png (192x192) - レガシーアイコン
    ├── ic_launcher_legacy-xxhdpi.png (144x144)
    ├── ic_launcher_legacy-xhdpi.png (96x96)
    ├── ic_launcher_legacy-hdpi.png (72x72)
    ├── ic_launcher_legacy-mdpi.png (48x48)
    └── ic_launcher_legacy-ldpi.png (36x36)
```

## ベストプラクティス

### デザイン準備

1. **正方形デザイン**: アイコンは必ず正方形で作成
2. **高解像度**: 1024x1024以上の解像度で作成
3. **セーフゾーン**: 重要な要素は中心に配置（端の20%は避ける）
4. **シンプルデザイン**: 小さいサイズでも認識しやすいデザイン

### ファイル管理

1. **整理された出力**: プラットフォームごとにフォルダが自動作成
2. **バックアップ**: 元のPSDファイルは必ず保管
3. **バージョン管理**: 出力フォルダをGitで管理することを推奨

## 注意事項

1. **透明背景**: PNG形式で透明背景をサポート
2. **カラープロファイル**: sRGBまたはDisplay P3を推奨
3. **ファイルサイズ**: ストア要件に合わせて最適化
4. **命名規則**: Xcodeとの連携を考慮したファイル名

## トラブルシューティング

### エクスポートに失敗する場合

1. ドキュメントが開いているか確認
2. 出力フォルダの書き込み権限を確認
3. 十分なディスク容量があるか確認

### ファイルが見つからない場合

1. 出力パスが正しく設定されているか確認
2. フォルダ作成権限があるか確認
3. Photoshopを管理者権限で実行してみる