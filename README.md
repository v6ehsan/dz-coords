<div align="center">

# 🗺️ DZTeam Coordinate System

**A sleek, framework-agnostic FiveM resource for capturing and copying in-game coordinates with a single key press.**

*Built by **v6 EhSaN** — [DZTeam](https://github.com/DZTeamStudio)*

[![GitHub](https://img.shields.io/badge/GitHub-DZTeamStudio-181717?style=for-the-badge&logo=github)](https://github.com/DZTeamStudio)
[![Discord](https://img.shields.io/badge/Discord-Join%20Server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/53HkRrvzks)
[![YouTube](https://img.shields.io/badge/YouTube-DZTeamStudio-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@DZTeamStudio)

---

![FiveM](https://img.shields.io/badge/FiveM-Compatible-9947E8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PC9zdmc+)
![Lua](https://img.shields.io/badge/Lua-5.4-2C2D72?style=for-the-badge&logo=lua&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-c46fff?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-9947E8?style=for-the-badge)

</div>

---

## ✨ Features

- **One-key access** — press `F5` (rebindable) or type `/coords` to open the UI
- **Multiple formats** — `vector3`, `vector4`, `x/y/z` and high-precision variants, all in one panel
- **Click to copy** — click any row to instantly copy it to your clipboard
- **In-game notification** — confirms what was copied via ESX, QBCore, or native GTA V help text
- **Frosted-glass UI** — animated purple shimmer, ambient orb glows, smooth spring entrance
- **Zero dependencies** — no external libraries; pure Lua + vanilla JS
- **Framework-agnostic** — works standalone, with ESX, or with QBCore out of the box

---

## 📁 File Structure

```
dz-coords/
├── fxmanifest.lua        ← Resource manifest (FiveM metadata)
├── Lua/
│   └── CMain.lua         ← Client-side Lua logic
└── UIPage/
    ├── index.html        ← NUI page structure
    ├── main.js           ← NUI event handling & DOM rendering
    ├── main.css          ← All visual styling & animations
    └── img/
        └── logo.png      ← DZTeam logo shown in the header
```

---

## 🚀 Installation

1. **Download** this repository and rename the folder to `dz-coords`
2. **Place** the folder inside your server's `resources/` directory
3. **Add** the following line to your `server.cfg`:

   ```cfg
   ensure dz-coords
   ```

4. **Restart** your server — the resource will start automatically.

---

## ⚙️ Configuration

Open `Lua/CMain.lua` and set the `core` variable at the top to match your framework:

```lua
local core = nil   -- standalone (default)
local core = 'esx' -- es_extended
local core = 'qb'  -- qb-core
```

That's the only setting you need to change. Everything else works out of the box.

---

## 🎮 Usage

| Action | Result |
|--------|--------|
| Press `F5` | Opens the coordinate panel |
| `/coords` in chat / F8 | Also opens the panel |
| Click any row | Copies that coordinate string & closes the panel |
| Press `ESC` | Closes the panel without copying |
| Header `✕` button | Closes the panel without copying |

> Players can rebind `F5` to any key they prefer via **Settings → Key Bindings → FiveM** inside GTA V.

---

## 📐 Coordinate Formats

The panel displays your current position in six ready-to-paste formats:

| Label | Example Output |
|-------|---------------|
| `vector3` | `vector3(123.45, -678.90, 34.56)` |
| `vector4` | `vector4(123.45, -678.90, 34.56, 270.00)` |
| `x,y,z` | `x=123.45, y=-678.90, z=34.56` |
| `xyzh` | `x=123.45, y=-678.90, z=34.56, h=270.00` |
| `vec3` *(precise)* | `vec3(123.4500, -678.9000, 34.5600)` |
| `vec4` *(precise)* | `vec4(123.4500, -678.9000, 34.5600, 270.0000)` |

Standard rows use **2 decimal places**; Precise rows use **4 decimal places**.

---

## 🛠️ How It Works

```
Player presses F5
       │
       ▼
  CMain.lua — RegisterKeyMapping fires OpenUI()
       │
       ├─ GetEntityCoords(PlayerPedId())   → x, y, z
       ├─ GetEntityHeading(PlayerPedId())  → h
       └─ SendNUIMessage({ type="open", ... })
                │
                ▼
         main.js — window 'message' listener
                │
                ├─ Builds coordinate rows via makeRow()
                └─ Sets document.body visible
                        │
                 Player clicks a row
                        │
                        ├─ copyText(value)          → clipboard
                        ├─ nuiPost('int:noty', …)   → Lua notification
                        └─ nuiPost('int:close', …)  → SetNuiFocus(false)
```

---

## 🎨 UI Overview

| Element | Description |
|---------|-------------|
| **Shimmer bar** | Animated gradient line sweeping across the top of the card |
| **Ambient orbs** | Two blurred purple glows that float behind the modal |
| **Logo tile** | Displays `img/logo.png` with a pulsing corner dot |
| **Coordinate rows** | Click-to-copy rows with hover slide + green flash on success |
| **Live indicator** | Pulsing dot in the footer confirming real-time position data |

---

## 📦 Dependencies

| Dependency | Required | Notes |
|------------|----------|-------|
| FiveM server | ✅ | `fx_version 'cerulean'` or higher |
| `es_extended` | ❌ Optional | Only if `core = 'esx'` |
| `qb-core` | ❌ Optional | Only if `core = 'qb'` |

---

## 🤝 Credits

| Role | Name |
|------|------|
| Developer | **v6 EhSaN** |
| Team | [**DZTeam**](https://github.com/DZTeamStudio) |
| Discord | [discord.gg/53HkRrvzks](https://discord.gg/53HkRrvzks) |
| YouTube | [@DZTeamStudio](https://www.youtube.com/@DZTeamStudio) |

---

## 🛒 Products & Custom Scripts

DZTeam offers both **ready-made paid resources** and **fully custom script development**.

| Service | Details |
|---------|---------|
| 💰 **Paid Resources** | Pre-built premium FiveM scripts — purchase directly via our Discord |
| 🎨 **Custom Scripts** | Need something built specifically for your server? Order a custom script made just for you |
| 📦 **How to Order** | Join our Discord and open a ticket — we'll handle everything from there |

> 👉 **[discord.gg/53HkRrvzks](https://discord.gg/53HkRrvzks)** — open a ticket to buy or order

---

## 📺 YouTube

Script previews, tutorials, and showcases are posted regularly on our channel.

> 👉 **[youtube.com/@DZTeamStudio](https://www.youtube.com/@DZTeamStudio)**

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it.  
Please keep the author and team credits intact.

---

<div align="center">

*Made with 💜 by **v6 EhSaN** · [DZTeam](https://github.com/DZTeamStudio) · [Discord](https://discord.gg/53HkRrvzks) · [YouTube](https://www.youtube.com/@DZTeamStudio)*

</div>
