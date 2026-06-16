-- ============================================================<DZ/>
--  DZTeam | Coordinate System — Resource Manifest
--  Author  : v6 EhSaN
--  Team    : DZTeam
--  GitHub  : https://github.com/DZTeamStudio
--  Discord : https://discord.gg/53HkRrvzks
--  YouTube : https://www.youtube.com/@DZTeamStudio
-- ============================================================<DZ/>

-- ── FiveM API Version ────────────────────────────────────────<DZ/>
-- 'cerulean' is the current stable fx_version target.
-- It unlocks modern natives, RegisterKeyMapping, and NUI APIs.
-- Do NOT downgrade this — older versions lack features used here.
fx_version 'cerulean'

-- ── Game Target ──────────────────────────────────────────────<DZ/>
-- Locks the resource to GTA V only.
-- Change to 'rdr3' if ever porting to RedM (requires full rewrite).
game 'gta5'

-- ── Metadata ─────────────────────────────────────────────────<DZ/>
-- Displayed in the server console and resource list.
-- Does not affect functionality.
author 'DZTeam'

-- ============================================================<DZ/>
--  CLIENT SCRIPT
--  The single Lua file that runs on every connecting client.
--  Path is relative to the resource root folder.
--
--  CMain.lua handles:
--    • Command + key binding registration  (/coords, F5)
--    • Reading player coords & heading from the game engine
--    • Sending data to the NUI layer (SendNUIMessage)
--    • NUI callbacks for close and notification events
-- ============================================================<DZ/>
client_script 'Lua/CMain.lua'

-- ============================================================<DZ/>
--  NUI PAGE  (ui_page)
--  Sets the HTML file that FiveM loads into its embedded
--  Chromium browser when this resource starts.
--  Only one ui_page is allowed per resource.
--
--  The page is hidden by default (body { display:none } in CSS)
--  and made visible by main.js when a 'message' event arrives.
-- ============================================================<DZ/>
ui_page 'UIPage/index.html'

-- ============================================================<DZ/>
--  FILE WHITELIST  (file { … })
--  Every file that the NUI page needs to load must be declared
--  here so FiveM's resource system bundles and serves them.
--
--  Files NOT listed here will return 404 inside the browser,
--  even if they exist on disk.
-- ============================================================<DZ/>
file {
    'UIPage/index.html',   -- NUI page entry point
    'UIPage/main.js',      -- coordinate rendering + clipboard logic
    'UIPage/main.css',     -- all visual styles & animations
    'UIPage/img/logo.png', -- DZTeam logo shown in the modal header
}