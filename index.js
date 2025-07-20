const photoshop = require("photoshop");
const uxp = require("uxp");
const fs = uxp.storage.localFileSystem;
const { app, core } = photoshop;

// アイコンサイズ定義を読み込み
const iconSizes = {
    ios: {
        appIcons: [
            { size: 1024, scale: 1, idiom: "ios-marketing", filename: "AppStore" },
            { size: 180, scale: 3, idiom: "iphone", filename: "iPhone-60@3x" },
            { size: 120, scale: 2, idiom: "iphone", filename: "iPhone-60@2x" },
            { size: 87, scale: 3, idiom: "iphone", filename: "iPhone-Settings-29@3x" },
            { size: 58, scale: 2, idiom: "iphone", filename: "iPhone-Settings-29@2x" },
            { size: 120, scale: 3, idiom: "iphone", filename: "iPhone-Spotlight-40@3x" },
            { size: 80, scale: 2, idiom: "iphone", filename: "iPhone-Spotlight-40@2x" },
            { size: 60, scale: 3, idiom: "iphone", filename: "iPhone-Notification-20@3x" },
            { size: 40, scale: 2, idiom: "iphone", filename: "iPhone-Notification-20@2x" },
            { size: 167, scale: 2, idiom: "ipad", filename: "iPad-Pro-83.5@2x" },
            { size: 152, scale: 2, idiom: "ipad", filename: "iPad-76@2x" },
            { size: 76, scale: 1, idiom: "ipad", filename: "iPad-76" },
            { size: 80, scale: 2, idiom: "ipad", filename: "iPad-Spotlight-40@2x" },
            { size: 40, scale: 1, idiom: "ipad", filename: "iPad-Spotlight-40" },
            { size: 58, scale: 2, idiom: "ipad", filename: "iPad-Settings-29@2x" },
            { size: 29, scale: 1, idiom: "ipad", filename: "iPad-Settings-29" },
            { size: 40, scale: 2, idiom: "ipad", filename: "iPad-Notification-20@2x" },
            { size: 20, scale: 1, idiom: "ipad", filename: "iPad-Notification-20" }
        ]
    },
    android: {
        appIcons: [
            { size: 512, density: "play-store", filename: "play-store-512" },
            { size: 432, density: "xxxhdpi", filename: "ic_launcher-xxxhdpi" },
            { size: 324, density: "xxhdpi", filename: "ic_launcher-xxhdpi" },
            { size: 216, density: "xhdpi", filename: "ic_launcher-xhdpi" },
            { size: 162, density: "hdpi", filename: "ic_launcher-hdpi" },
            { size: 108, density: "mdpi", filename: "ic_launcher-mdpi" },
            { size: 192, density: "xxxhdpi", filename: "ic_launcher_legacy-xxxhdpi" },
            { size: 144, density: "xxhdpi", filename: "ic_launcher_legacy-xxhdpi" },
            { size: 96, density: "xhdpi", filename: "ic_launcher_legacy-xhdpi" },
            { size: 72, density: "hdpi", filename: "ic_launcher_legacy-hdpi" },
            { size: 48, density: "mdpi", filename: "ic_launcher_legacy-mdpi" },
            { size: 36, density: "ldpi", filename: "ic_launcher_legacy-ldpi" }
        ]
    }
};

let outputFolder = null;

// DOMコンテンツが読み込まれたら初期化
document.addEventListener("DOMContentLoaded", () => {
    // ボタンのイベントリスナー設定
    document.getElementById("browse-button").addEventListener("click", selectOutputFolder);
    document.getElementById("export-button").addEventListener("click", exportIcons);
});

// 出力フォルダを選択
async function selectOutputFolder() {
    try {
        const folder = await fs.getFolder();
        if (folder) {
            outputFolder = folder;
            document.getElementById("output-path").value = folder.name;
            showStatus("Output folder selected: " + folder.name, "success");
        }
    } catch (error) {
        showStatus("Error selecting folder: " + error.message, "error");
    }
}

// ステータスメッセージを表示
function showStatus(message, type = "info") {
    const statusEl = document.getElementById("status-message");
    statusEl.textContent = message;
    statusEl.className = "status-message " + type;
    statusEl.style.display = "block";
    
    if (type === "success") {
        setTimeout(() => {
            statusEl.style.display = "none";
        }, 5000);
    }
}

// プログレスバーを更新
function updateProgress(current, total, message) {
    const progressSection = document.getElementById("progress-section");
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    
    progressSection.style.display = "block";
    progressFill.style.width = (current / total * 100) + "%";
    progressText.textContent = message;
}

// プログレスバーを非表示
function hideProgress() {
    document.getElementById("progress-section").style.display = "none";
}

// アイコンをエクスポート
async function exportIcons() {
    if (!outputFolder) {
        showStatus("Please select an output folder first", "error");
        return;
    }
    
    const doc = app.activeDocument;
    if (!doc) {
        showStatus("Please open a document first", "error");
        return;
    }
    
    // オプションを取得
    const exportIOS = document.getElementById("ios-checkbox").checked;
    const exportAndroid = document.getElementById("android-checkbox").checked;
    const exportAppIcons = document.getElementById("app-icons").checked;
    
    if (!exportIOS && !exportAndroid) {
        showStatus("Please select at least one platform", "error");
        return;
    }
    
    if (!exportAppIcons) {
        showStatus("Please select at least one export option", "error");
        return;
    }
    
    try {
        // エクスポートタスクを実行
        await core.executeAsModal(async () => {
            let totalIcons = 0;
            let currentIcon = 0;
            
            // 総アイコン数を計算
            if (exportIOS && exportAppIcons) totalIcons += iconSizes.ios.appIcons.length;
            if (exportAndroid && exportAppIcons) totalIcons += iconSizes.android.appIcons.length;
            
            // iOSアイコンをエクスポート
            if (exportIOS && exportAppIcons) {
                const iosFolder = await outputFolder.createFolder("ios");
                
                for (const icon of iconSizes.ios.appIcons) {
                    currentIcon++;
                    updateProgress(currentIcon, totalIcons, `Exporting iOS: ${icon.filename}.png`);
                    
                    await exportIcon(doc, icon.size, icon.size, iosFolder, icon.filename + ".png");
                }
            }
            
            // Androidアイコンをエクスポート
            if (exportAndroid && exportAppIcons) {
                const androidFolder = await outputFolder.createFolder("android");
                
                for (const icon of iconSizes.android.appIcons) {
                    currentIcon++;
                    updateProgress(currentIcon, totalIcons, `Exporting Android: ${icon.filename}.png`);
                    
                    await exportIcon(doc, icon.size, icon.size, androidFolder, icon.filename + ".png");
                }
            }
            
            hideProgress();
            showStatus(`Successfully exported ${totalIcons} icons!`, "success");
        }, {"commandName": "Export App Icons"});
        
    } catch (error) {
        hideProgress();
        showStatus("Error during export: " + error.message, "error");
        console.error(error);
    }
}

// 個別のアイコンをエクスポート
async function exportIcon(doc, width, height, folder, filename) {
    try {
        // ドキュメントを複製して安全に処理
        const tempDoc = await doc.duplicate();
        
        // レイヤーを統合（アルファチャンネルと色が正しく処理される）
        await tempDoc.flatten();
        
        // 高品質リサイズ（アイコン用）
        await tempDoc.resizeImage(width, height, 72, "bicubicSmoother");
        
        // ファイルを作成
        const file = await folder.createFile(filename, { overwrite: true });
        
        // PNG形式で保存
        await tempDoc.saveAs.png(file, {
            compression: 6,
            interlaced: false
        });
        
        // 一時ドキュメントを閉じる
        await tempDoc.closeWithoutSaving();
        
    } catch (error) {
        console.error(`Error exporting ${filename}:`, error);
        throw error;
    }
}

// エントリーポイントの設定
const { entrypoints } = require("uxp");
entrypoints.setup({
    panels: {
        appIconExporterPanel: {
            show() {
                console.log("App Icon Exporter panel shown");
            }
        }
    }
});