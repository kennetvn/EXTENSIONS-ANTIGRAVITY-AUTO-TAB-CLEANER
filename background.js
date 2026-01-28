/**
 * Antigravity Tab Cleaner - Background Service Worker
 * 
 * 🎯 Mục đích: Tự động dọn tabs cũ cho Antigravity Browser Subagent
 * 
 * Logic:
 * - Detect tab mới được tạo
 * - Hiển thị custom overlay notification trên browser
 * - Sau 15 giây, đóng tất cả tabs cũ
 * - Luôn giữ tối thiểu 1 tab để không đóng browser
 * - Overlay tự ẩn sau 3 giây để không ảnh hưởng screenshot
 * 
 * 🆓 Miễn phí cho Antigravity Users
 * ⚙️ Luôn hoạt động - Không cần config
 * 👤 Author: AKA FRANKIE
 */

const CLEANUP_DELAY = 15000; // 15 giây - CỐ ĐỊNH
const NOTIFICATION_HIDE_DELAY = 3000; // 3 giây

let pendingCleanup = null;

/**
 * Hiển thị overlay notification trên TAB MỚI
 */
async function showCleanupNotification(keepTabId) {
    try {
        // Lấy tất cả tabs
        const allTabs = await chrome.tabs.query({});

        // Đếm số tabs CŨ sẽ bị đóng
        const oldTabsCount = allTabs.length - 1;

        // Không hiển thị nếu chỉ có 1 tab
        if (oldTabsCount === 0) {
            console.log('[Tab Cleaner] Chỉ có 1 tab, không cần notification');
            return;
        }

        console.log(`[Tab Cleaner] 📢 Đợi tab MỚI load xong (ID: ${keepTabId})...`);

        // Đợi tab load xong
        await waitForTabReady(keepTabId);

        // Inject overlay trực tiếp vào tab
        try {
            await chrome.scripting.executeScript({
                target: { tabId: keepTabId },
                func: showOverlay,
                args: [oldTabsCount, CLEANUP_DELAY / 1000]
            });
            console.log('[Tab Cleaner] ✅ Đã inject overlay vào tab mới');
        } catch (err) {
            // Silent fail - Tab có thể không có permission (chrome://, file://, etc)
            // Không log error để tránh spam console
        }

    } catch (error) {
        console.error('[Tab Cleaner] ❌ Lỗi hiển thị overlay:', error);
    }
}

/**
 * Function sẽ được inject vào page để hiển thị overlay
 * CRITICAL: Function này chạy trong page context, KHÔNG có access to Chrome APIs
 */
function showOverlay(oldTabsCount, delaySeconds) {
    // Remove overlay cũ nếu có
    const existingOverlay = document.getElementById('aka-tab-cleaner-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.id = 'aka-tab-cleaner-overlay';
    overlay.innerHTML = `
        <div class="aka-backdrop"></div>
        <div class="aka-alert">
            <div class="aka-alert-icon">🧹</div>
            <div class="aka-alert-title">TAB MỚI ĐÃ ĐƯỢC MỞ</div>
            <div class="aka-alert-message">
                Các tab cũ (${oldTabsCount} tabs) sẽ được đóng trong <strong>${delaySeconds}s</strong><br>
                để cải thiện hiệu suất Browser Subagent Antigravity
            </div>
            <div class="aka-alert-footer">
                Dev by AKA FRANKIE<br>
                <a href="https://zalo.me/g/snpqma128" target="_blank" class="aka-zalo-link">📱 Join Zalo Group</a>
            </div>
        </div>
    `;

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #aka-tab-cleaner-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }
        .aka-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        .aka-alert {
            position: relative;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 50px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            text-align: center;
            max-width: 500px;
            animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .aka-alert-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: bounce 0.6s ease-in-out;
        }
        .aka-alert-title {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 16px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .aka-alert-message {
            font-size: 16px;
            line-height: 1.6;
            opacity: 0.95;
            margin-bottom: 20px;
        }
        .aka-alert-message strong {
            font-weight: 700;
            font-size: 18px;
            color: #FFD700;
        }
        .aka-alert-footer {
            font-size: 12px;
            opacity: 0.7;
            font-style: italic;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .aka-zalo-link {
            display: inline-block;
            color: white;
            text-decoration: none;
            margin-top: 6px;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            font-size: 11px;
            font-style: normal;
            transition: all 0.2s ease;
        }
        .aka-zalo-link:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from {
                transform: scale(0.7);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .aka-overlay-hide {
            animation: fadeOut 0.3s ease-in forwards;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Auto-hide sau 3 giây
    setTimeout(() => {
        overlay.classList.add('aka-overlay-hide');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }, 3000);
}

/**
 * Đợi tab load xong (status = complete)
 * Timeout sau 5 giây nếu không load được
 */
function waitForTabReady(tabId) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log('[Tab Cleaner] ⏱️ Timeout waiting for tab load, proceeding anyway...');
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
        }, 5000);

        const listener = (updatedTabId, changeInfo, tab) => {
            if (updatedTabId === tabId && changeInfo.status === 'complete') {
                console.log('[Tab Cleaner] ✅ Tab đã load xong!');
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        };

        chrome.tabs.onUpdated.addListener(listener);

        // Check ngay xem tab đã complete chưa
        chrome.tabs.get(tabId, (tab) => {
            if (tab && tab.status === 'complete') {
                console.log('[Tab Cleaner] ✅ Tab đã sẵn sàng!');
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        });
    });
}

/**
 * Đợi tab load xong (status = complete)
 * Timeout sau 5 giây nếu không load được
 */
function waitForTabReady(tabId) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            console.log('[Tab Cleaner] ⏱️ Timeout - proceeding anyway');
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
        }, 5000);

        const listener = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === 'complete') {
                console.log('[Tab Cleaner] ✅ Tab loaded!');
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        };

        chrome.tabs.onUpdated.addListener(listener);

        // Check nếu tab đã ready
        chrome.tabs.get(tabId, (tab) => {
            if (chrome.runtime.lastError) {
                resolve();
                return;
            }
            if (tab && tab.status === 'complete') {
                console.log('[Tab Cleaner] ✅ Tab already ready!');
                clearTimeout(timeout);
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        });
    });
}

/**
 * Đóng tất cả tabs trừ tab được chỉ định
 */
async function cleanupOldTabs(keepTabId) {
    try {
        // Lấy tất cả tabs
        const allTabs = await chrome.tabs.query({});

        console.log(`[Tab Cleaner] Tổng số tabs: ${allTabs.length}`);

        // Nếu chỉ có 1 tab, không cần đóng
        if (allTabs.length <= 1) {
            console.log('[Tab Cleaner] Chỉ có 1 tab, bỏ qua cleanup');
            return;
        }

        // Đóng tất cả tabs trừ keepTabId
        const tabsToClose = allTabs.filter(tab => tab.id !== keepTabId);

        console.log(`[Tab Cleaner] Sẽ đóng ${tabsToClose.length} tabs cũ`);

        for (const tab of tabsToClose) {
            try {
                await chrome.tabs.remove(tab.id);
                console.log(`[Tab Cleaner] Đã đóng tab ${tab.id}: ${tab.title}`);
            } catch (err) {
                console.error(`[Tab Cleaner] Lỗi khi đóng tab ${tab.id}:`, err);
            }
        }

        console.log('[Tab Cleaner] ✅ Cleanup hoàn tất!');

        // Reset pending cleanup
        pendingCleanup = null;

    } catch (error) {
        console.error('[Tab Cleaner] ❌ Lỗi cleanup:', error);
    }
}

// Detect tab mới được TẠO (ONLY when new tab is created, not on switch)
chrome.tabs.onCreated.addListener(async (newTab) => {
    console.log(`[Tab Cleaner] ✨ Tab MỚI được tạo: ${newTab.id}`);

    // Hủy cleanup pending trước đó (nếu có)
    if (pendingCleanup) {
        clearTimeout(pendingCleanup);
        console.log('[Tab Cleaner] Hủy cleanup pending trước đó');
    }

    // Hiển thị notification ngay
    await showCleanupNotification(newTab.id);

    // Schedule cleanup sau 15 giây
    pendingCleanup = setTimeout(() => {
        cleanupOldTabs(newTab.id);
    }, CLEANUP_DELAY);

    console.log(`[Tab Cleaner] Đã lên lịch cleanup sau ${CLEANUP_DELAY / 1000}s`);
});

// Log khi extension được load
console.log('[Tab Cleaner] 🚀 Extension đã được khởi động!');
console.log('[Tab Cleaner] 🆓 Miễn phí cho Antigravity Users');

