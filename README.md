# 🧹 Antigravity Tab Cleaner

**Miễn phí cho Antigravity Users** | Tự động dọn tabs cũ để Browser Subagent hoạt động tốt hơn

---

## 📖 Tổng Quan

Extension tự động đóng các tabs cũ khi tab mới được mở, giúp:
- ✅ Giảm memory usage
- ✅ Tăng hiệu suất Antigravity Browser Subagent
- ✅ Tránh browser crash do quá nhiều tabs

## ✨ Tính Năng

- 🎯 **Tự động cleanup** - Đóng tabs cũ sau 15 giây
- 🎨 **Beautiful overlay** - Thông báo centered, purple gradient
- 🔒 **An toàn** - Luôn giữ tối thiểu 1 tab
- 🚀 **Zero config** - Cài xong là dùng
- 👤 **Author**: AKA FRANKIE
- 📱 **Community**: [Join Zalo Group](https://zalo.me/g/snpqma128)

## 📦 Cài Đặt

1. Download hoặc clone repo
2. Vào `chrome://extensions`
3. Bật **Developer mode**
4. Click **"Load unpacked"**
5. Chọn folder `AKA-EXTENSIONS/EXTENSIONS-AUTO-TAB-CLEANER`
6. Done! ✅

## 🎯 Cách Hoạt Động

```
Mở tab mới
    ↓
Extension detect → Đợi page load
    ↓
Hiển thị overlay: "TAB MỚI ĐÃ ĐƯỢC MỞ"
    ↓
Sau 15s → Đóng tất cả tabs cũ
    ↓
Giữ lại ONLY tab mới
```

## �️ Preview

Overlay xuất hiện ở giữa màn hình với:
- 🧹 Icon chổi space theme
- 📊 Thông tin: "Các tab cũ (X tabs) sẽ được đóng trong 15s"
- 🎨 Purple gradient design
- 📱 Zalo group link

## 🔧 Technical

- **Manifest V3**
- **Programmatic injection** - Không dùng content scripts
- **Silent fail** - Không spam console errors
- **Permissions**: `tabs`, `scripting`, `host_permissions: <all_urls>`

## 📁 Cấu Trúc

```
EXTENSIONS-AUTO-TAB-CLEANER/
├── manifest.json       # Extension config
├── background.js       # Core logic + overlay injection
├── icons/             # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          # Docs
```

## � Known Issues

- ❌ Không hoạt động với `chrome://` pages (Chrome restriction)
- ✅ Work với: HTTP, HTTPS, file://, localhost

## � Version

**Current**: `1.4.1`

### Changelog

- **v1.4.1** - Silent fail + Zalo link
- **v1.4.0** - Programmatic injection
- **v1.3.x** - Custom overlay system
- **v1.2.0** - Removed popup UI
- **v1.1.x** - Bug fixes
- **v1.0.0** - Initial release

## 💬 Support

- 📱 **Zalo Group**: [https://zalo.me/g/snpqma128](https://zalo.me/g/snpqma128)
- 👤 **Author**: AKA FRANKIE
- 🌟 **Made for Antigravity Users**

---

**Enjoy cleaner tabs! 🧹✨**
