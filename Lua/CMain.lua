-- ============================================================<DZ/>
--  DZTeam | Coordinate System — Client Main Script
--  Author  : v6 EhSaN
--  Team    : DZTeam
--  Version : 1.0.0
--  GitHub  : https://github.com/DZTeamStudio
--  Discord : https://discord.gg/53HkRrvzks
-- ============================================================<DZ/>

-- ┌──────────────────────────────────────────────────────────┐
-- │  FRAMEWORK CONFIGURATION                                 │
-- │  Set 'core' to match your server framework:              │
-- │    nil  → standalone (no framework)                      │
-- │    'esx' → es_extended                                   │
-- │    'qb'  → qb-core                                       │
-- └──────────────────────────────────────────────────────────┘
local core = nil -- nil, 'esx', or 'qb'

-- ── Framework Bootstrap ─────────────────────────────────────<DZ/>
-- Grab the shared object for whichever framework is selected.
-- This runs once at resource start, before any callbacks fire.
if core == 'esx' then
    ESX = exports['es_extended']:getSharedObject()
elseif core == 'qb' then
    QBCore = exports['qb-core']:GetCoreObject()
end

-- ============================================================<DZ/>
--  COMMAND REGISTRATION
--  /coords  — typed in the F8 console or chat
-- ============================================================<DZ/>
RegisterCommand('coords', function()
    OpenUI()
end, false)

-- ── Key Mapping ─────────────────────────────────────────────<DZ/>
-- Binds the command to F5 by default.
-- Players can rebind it in GTA V's key-binding settings.
RegisterKeyMapping('coords', 'Open DZTeam Coords', 'keyboard', 'F5')

-- ============================================================<DZ/>
--  OpenUI()
--  Collects the local player's position + heading and sends
--  them to the NUI (HTML/JS) layer via SendNUIMessage.
-- ============================================================<DZ/>
function OpenUI()
    -- Hand mouse and keyboard focus to the NUI page
    SetNuiFocus(true, true)

    -- Get the local player ped entity handle
    local _char = PlayerPedId()

    -- Retrieve world-space coordinates (returns a vector3)
    local _charPos = GetEntityCoords(_char)

    -- Retrieve compass heading in degrees (0–360, north = 0)
    local _charHeading = GetEntityHeading(_char)

    -- Push data to the browser context (index.html / main.js)
    SendNUIMessage({
        type        = "open",          -- event type consumed by the JS message listener
        _charPos    = {                -- split vector3 into plain table for JSON serialization
            x = _charPos.x,
            y = _charPos.y,
            z = _charPos.z
        },
        _charHeading = _charHeading,   -- float: yaw angle of the ped
    })
end

-- ============================================================<DZ/>
--  NUI CALLBACKS
--  Fired from the JS side via  fetch('https://<resource>/<endpoint>')
-- ============================================================<DZ/>

-- ── int:close ───────────────────────────────────────────────
-- Called when the player closes the UI (ESC key, close button,
-- or after clicking a coordinate row to copy it).
RegisterNUICallback('int:close', function(data, cb)
    -- Return focus to the game world
    SetNuiFocus(false, false)
    if cb then cb('ok') end
end)

-- ── int:noty ────────────────────────────────────────────────<DZ/>
-- Called after the player copies a coordinate string.
-- Displays a brief notification using the active framework
-- (or a native GTA V help text if running standalone).
RegisterNUICallback('int:noty', function(data, cb)
    if core == 'esx' then
        -- ESX top-right notification
        ESX.ShowNotification(data.noti)
    elseif core == 'qb' then
        -- QBCore bottom-left notification
        QBCore.Functions.Notify(data.noti)
    else
        -- Standalone fallback — uses GTA V's built-in help text
        SendDZNotif(data.noti)
    end
    if cb then cb('ok') end
end)

-- ============================================================<DZ/>
--  SendDZNotif(msg)
--  Standalone notification helper.
--  Registers a temporary text entry and renders it as a
--  3-second GTA V "help" prompt (top-left corner).
-- ============================================================<DZ/>
function SendDZNotif(msg)
    -- Register a reusable text label (overwritten each call)
    AddTextEntry('DZNotif', msg)

    -- Trigger the built-in help-text display pipeline
    BeginTextCommandDisplayHelp('DZNotif')
    EndTextCommandDisplayHelp(
        0,      -- display type: 0 = normal
        false,  -- loop: false = show once
        true,   -- beep sound: true = play notification beep
        3000    -- duration in milliseconds
    )
end
