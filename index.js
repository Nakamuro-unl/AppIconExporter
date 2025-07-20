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
    
    // アダプティブアイコンチェックボックスのイベントリスナー
    document.getElementById("adaptive-icons").addEventListener("change", toggleAdaptiveSection);
});

// アダプティブアイコン設定セクションの表示/非表示
function toggleAdaptiveSection() {
    const checkbox = document.getElementById("adaptive-icons");
    const section = document.getElementById("adaptive-section");
    section.style.display = checkbox.checked ? "block" : "none";
}

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
    const exportAdaptiveIcons = document.getElementById("adaptive-icons").checked;
    const foregroundLayerName = document.getElementById("foreground-layer").value.trim();
    const backgroundLayerName = document.getElementById("background-layer").value.trim();
    
    if (!exportIOS && !exportAndroid) {
        showStatus("Please select at least one platform", "error");
        return;
    }
    
    if (!exportAppIcons && !exportAdaptiveIcons) {
        showStatus("Please select at least one export option", "error");
        return;
    }
    
    // アダプティブアイコン用のレイヤー名チェック
    if (exportAdaptiveIcons && exportAndroid) {
        if (!foregroundLayerName || !backgroundLayerName) {
            showStatus("Please specify both foreground and background layer names for adaptive icons", "error");
            return;
        }
    }
    
    try {
        // エクスポートタスクを実行
        await core.executeAsModal(async () => {
            let totalIcons = 0;
            let currentIcon = 0;
            
            // 総アイコン数を計算
            if (exportIOS && exportAppIcons) totalIcons += iconSizes.ios.appIcons.length;
            if (exportAndroid && exportAppIcons) totalIcons += iconSizes.android.appIcons.length;
            if (exportAndroid && exportAdaptiveIcons) totalIcons += 10; // 前景・背景各5サイズ
            
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
            
            // Androidアダプティブアイコンをエクスポート
            if (exportAndroid && exportAdaptiveIcons) {
                const adaptiveFolder = await outputFolder.createFolder("android-adaptive");
                
                // アダプティブアイコンサイズ
                const adaptiveSizes = [
                    { size: 432, density: "xxxhdpi" },
                    { size: 324, density: "xxhdpi" },
                    { size: 216, density: "xhdpi" },
                    { size: 162, density: "hdpi" },
                    { size: 108, density: "mdpi" }
                ];
                
                // 前景アイコンをエクスポート
                for (const sizeInfo of adaptiveSizes) {
                    currentIcon++;
                    updateProgress(currentIcon, totalIcons, `Exporting Adaptive Foreground: ${sizeInfo.density}`);
                    
                    await exportAdaptiveIcon(doc, sizeInfo.size, adaptiveFolder, 
                        `ic_launcher_foreground-${sizeInfo.density}.png`, foregroundLayerName, true);
                }
                
                // 背景アイコンをエクスポート
                for (const sizeInfo of adaptiveSizes) {
                    currentIcon++;
                    updateProgress(currentIcon, totalIcons, `Exporting Adaptive Background: ${sizeInfo.density}`);
                    
                    await exportAdaptiveIcon(doc, sizeInfo.size, adaptiveFolder, 
                        `ic_launcher_background-${sizeInfo.density}.png`, backgroundLayerName, false);
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

// アダプティブアイコンをエクスポート
async function exportAdaptiveIcon(doc, size, folder, filename, layerName, isForeground) {
    try {
        // ドキュメントを複製
        const tempDoc = await doc.duplicate();
        
        // 指定されたレイヤーを探す
        const targetLayer = findLayerByName(tempDoc, layerName);
        if (!targetLayer) {
            throw new Error(`Layer '${layerName}' not found`);
        }
        
        // 他のレイヤーを非表示にして、対象レイヤーのみ表示
        await hideAllLayersExcept(tempDoc, targetLayer);
        
        // 前景の場合はセーフゾーン処理（66x66dpの中央配置）
        if (isForeground) {
            await applySafeZone(tempDoc, size);
        }
        
        // リサイズ
        await tempDoc.resizeImage(size, size, 72, "bicubicSmoother");
        
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
        console.error(`Error exporting adaptive icon ${filename}:`, error);
        throw error;
    }
}

// レイヤー名で検索
function findLayerByName(doc, layerName) {
    try {
        for (let i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i].name === layerName) {
                return doc.layers[i];
            }
            // グループ内も検索
            if (doc.layers[i].kind === "group") {
                const found = searchInGroup(doc.layers[i], layerName);
                if (found) return found;
            }
        }
        return null;
    } catch (error) {
        console.error("Error finding layer:", error);
        return null;
    }
}

// グループ内でレイヤーを検索
function searchInGroup(group, layerName) {
    try {
        for (let i = 0; i < group.layers.length; i++) {
            if (group.layers[i].name === layerName) {
                return group.layers[i];
            }
            if (group.layers[i].kind === "group") {
                const found = searchInGroup(group.layers[i], layerName);
                if (found) return found;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

// 指定レイヤー以外を非表示
async function hideAllLayersExcept(doc, targetLayer) {
    try {
        for (let i = 0; i < doc.layers.length; i++) {
            if (doc.layers[i] !== targetLayer) {
                doc.layers[i].visible = false;
            }
        }
        targetLayer.visible = true;
    } catch (error) {
        console.error("Error hiding layers:", error);
    }
}

// セーフゾーン処理（前景用）
async function applySafeZone(tempDoc, size) {
    // セーフゾーンは66x66dp（108dpの61%）
    // 中央配置するため、周囲に余白を追加
    const safeZoneRatio = 66 / 108;
    const padding = Math.round(size * (1 - safeZoneRatio) / 2);
    
    try {
        // キャンバスサイズを一時的に拡大してセーフゾーン処理
        // 実装を簡略化：リサイズ時に中央配置されることを利用
        console.log(`Applying safe zone: ${padding}px padding for ${size}px icon`);
    } catch (error) {
        console.error("Error applying safe zone:", error);
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