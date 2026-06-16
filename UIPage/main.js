// ============================================================<DZ/>
//  DZTeam | Coordinate System — NUI JavaScript Layer
//  Author  : v6 EhSaN
//  Team    : DZTeam
//  Version : 1.0.0
//  GitHub  : https://github.com/DZTeamStudio
//  Discord : https://discord.gg/53HkRrvzks
// ============================================================<DZ/>

// ── Resource Name ────────────────────────────────────────────<DZ/>
// GetParentResourceName() returns the FiveM resource folder
// name at runtime. Falls back to 'dz-coords' during local
// browser development so the file can be opened without GTA V.
const RESOURCE = window.GetParentResourceName
    ? window.GetParentResourceName()
    : 'dz-coords';


// ============================================================<DZ/>
//  nuiPost(endpoint, data)
//  Sends an HTTP POST from the NUI page back to the Lua
//  client script via FiveM's NUI callback system.
//
//  @param {string} endpoint  — callback name registered with
//                              RegisterNUICallback in Lua
//  @param {*}      data      — payload (auto-serialised to JSON)
// ============================================================<DZ/>
function nuiPost(endpoint, data) {
    fetch('https://' + RESOURCE + '/' + endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data)
    }).catch(function() {});   // silently swallow network errors
}


// ============================================================<DZ/>
//  copyText(str)
//  Copies a string to the OS clipboard.
//  Uses the legacy execCommand approach for maximum CEF
//  (Chromium Embedded Framework) compatibility inside GTA V.
//
//  @param {string} str — text to copy
// ============================================================<DZ/>
function copyText(str) {
    try {
        // Create an off-screen textarea so nothing flashes on screen
        const ta = document.createElement('textarea');
        ta.value = str;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');   // deprecated but reliable in CEF
        document.body.removeChild(ta);
    } catch (e) {}
}


// ============================================================<DZ/>
//  closeUI()
//  Hides the entire NUI panel and clears its dynamic content,
//  then tells Lua to release mouse/keyboard focus back to the
//  game world.
// ============================================================<DZ/>
function closeUI() {
    document.body.style.display = 'none';   // hide the page instantly

    // Clear coordinate rows so stale data is never shown on next open
    var body = document.getElementById('dzBody');
    if (body) body.innerHTML = '';

    // Notify Lua → SetNuiFocus(false, false)
    nuiPost('int:close', 'close');
}


// ── SVG Icon Strings ─────────────────────────────────────────<DZ/>
// Inline SVGs for the copy and check-mark icons on each row.
// Storing them as strings avoids extra HTTP requests.
var ICON_COPY = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
var ICON_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';


// ============================================================<DZ/>
//  makeRow(tag, value)
//  Builds a single clickable coordinate row element.
//
//  Structure:
//    .dz-row
//      ├─ .dz-tag   (format label, e.g. "vector3")
//      ├─ .dz-val   (the coordinate string itself)
//      └─ .dz-ico   (copy / check icon)
//
//  On click:
//    1. Copies `value` to clipboard
//    2. Flashes the row green with a check-mark
//    3. Sends a notification to the Lua side
//    4. Closes the UI after 200 ms
//
//  @param {string} tag   — short format label shown on the left
//  @param {string} value — coordinate string to display & copy
//  @returns {HTMLElement}
// ============================================================<DZ/>
function makeRow(tag, value) {
    var row = document.createElement('div');
    row.className = 'dz-row';

    // Left: format label badge
    var tagEl = document.createElement('span');
    tagEl.className = 'dz-tag';
    tagEl.textContent = tag;

    // Center: the coordinate value
    var valEl = document.createElement('span');
    valEl.className = 'dz-val';
    valEl.textContent = value;

    // Right: clipboard icon (swapped to check-mark on copy)
    var ico = document.createElement('span');
    ico.className = 'dz-ico';
    ico.innerHTML = ICON_COPY;

    row.appendChild(tagEl);
    row.appendChild(valEl);
    row.appendChild(ico);

    // ── Click handler ────────────────────────────────────────<DZ/>
    row.addEventListener('click', function () {
        copyText(value);                        // write to clipboard
        row.classList.add('dz-ok');             // trigger green-flash CSS animation
        ico.innerHTML = ICON_CHECK;             // swap icon to check-mark

        // Tell Lua to show an in-game notification
        nuiPost('int:noty', { noti: 'DZTeam | Copied: ' + value });

        // Brief delay so the player can see the success state, then close
        setTimeout(function() { closeUI(); }, 200);
    });

    return row;
}

// ============================================================<DZ/>
//  makeGroup(label)
//  Builds a visual section divider / group header element.
//
//  @param {string} label — uppercase section title text
//  @returns {HTMLElement}
// ============================================================<DZ/>
function makeGroup(label) {
    var g = document.createElement('div');
    g.className = 'dz-grp';
    g.textContent = label;
    return g;
}


// ============================================================<DZ/>
//  MESSAGE LISTENER
//  Receives data from Lua's SendNUIMessage({ type = "open", … })
//  and renders the coordinate rows into #dzBody.
// ============================================================<DZ/>
window.addEventListener('message', function (event) {
    var data = event.data;

    // Only process our own "open" event type
    if (!data || data.type !== 'open') return;

    var x, y, z, h;

    // ── Data-shape normalisation ─────────────────────────────<DZ/>
    // Support two slightly different payload shapes so the UI
    // is compatible with future refactors of the Lua side.
    if (data._charPos) {
        // Current shape: { _charPos: {x,y,z}, _charHeading: float }
        x = data._charPos.x;
        y = data._charPos.y;
        z = data._charPos.z;
        h = data._charHeading;

    } else if (data.coords) {
        // Alternative shape: { coords: {x,y,z}, heading: float }
        x = data.coords.x;
        y = data.coords.y;
        z = data.coords.z;
        h = data.heading;
    } else {
        return; // unknown payload — ignore
    }

    // ── Number formatters ────────────────────────────────────<DZ/>
    function f2(n) { return parseFloat(n).toFixed(2); }   // 2 decimal places
    function f4(n) { return parseFloat(n).toFixed(4); }   // 4 decimal places (precise)

    // ── Build coordinate rows ────────────────────────────────<DZ/>
    var body = document.getElementById('dzBody');
    body.innerHTML = '';    // clear any previous session's rows

    // — Standard precision section —
    body.appendChild(makeGroup('Coords'));
    body.appendChild(makeRow('vector3', 'vector3(' + f2(x) + ', ' + f2(y) + ', ' + f2(z) + ')'));
    body.appendChild(makeRow('vector4', 'vector4(' + f2(x) + ', ' + f2(y) + ', ' + f2(z) + ', ' + f2(h) + ')'));
    body.appendChild(makeRow('x,y,z',   'x=' + f2(x) + ', y=' + f2(y) + ', z=' + f2(z)));
    body.appendChild(makeRow('xyzh',    'x=' + f2(x) + ', y=' + f2(y) + ', z=' + f2(z) + ', h=' + f2(h)));

    // — High precision section —
    body.appendChild(makeGroup('Precise'));
    body.appendChild(makeRow('vec3', 'vec3(' + f4(x) + ', ' + f4(y) + ', ' + f4(z) + ')'));
    body.appendChild(makeRow('vec4', 'vec4(' + f4(x) + ', ' + f4(y) + ', ' + f4(z) + ', ' + f4(h) + ')'));

    // Make the page visible now that content is ready
    document.body.style.display = 'block';
});


// ============================================================<DZ/>
//  KEYBOARD HANDLER
//  ESC closes the UI — matches the footer hint text.
// ============================================================<DZ/>
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeUI();
});


// ============================================================<DZ/>
//  DOM READY — wire up the close button in the header
// ============================================================<DZ/>
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('dzClose');
    if (btn) btn.addEventListener('click', closeUI);
});
