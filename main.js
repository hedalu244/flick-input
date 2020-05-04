"use strict";
function startup() {
    const el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
    log("initialized.");
}
const ongoingTouches = [];
function handleStart(evt) {
    evt.preventDefault();
    log("touchstart.");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        const color = colorForTouch(touches[i]);
        ctx.beginPath();
        ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
        log("touchstart:" + i + ".");
    }
}
function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            log("continuing touch " + idx);
            ctx.beginPath();
            log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
            log(".");
        }
        else {
            log("can't figure out which touch to continue");
        }
    }
}
function handleEnd(evt) {
    evt.preventDefault();
    log("touchend");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
        else {
            log("can't figure out which touch to end");
        }
    }
}
function handleCancel(evt) {
    evt.preventDefault();
    log("touchcancel.");
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1); // remove it; we're done
    }
}
function colorForTouch(touch) {
    const r = touch.identifier % 16;
    const g = Math.floor(touch.identifier / 3) % 16;
    const b = Math.floor(touch.identifier / 7) % 16;
    const color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
}
;
function copyTouch(touch) {
    return {
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY
    };
}
function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}
function log(msg) {
    var p = document.getElementById('log');
    if (p === null)
        return;
    p.innerHTML = msg + "\n" + p.innerHTML;
}
