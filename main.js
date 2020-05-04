"use strict";
function startup() {
    const el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
    log("initialized.");
}
;
function strokeStart(touch) {
    return {
        identifier: touch.identifier,
        log: [{ x: touch.pageX, y: touch.pageY }],
    };
}
const strokes = [];
function handleStart(evt) {
    evt.preventDefault();
    log("touchstart.");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = Array.from(evt.changedTouches);
    touches.forEach(touch => {
        const stroke = strokeStart(touch);
        strokes.push(stroke);
        const color = colorForStroke(stroke);
        ctx.beginPath();
        ctx.arc(touch.pageX, touch.pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
        log("touchstart");
    });
}
function handleMove(evt) {
    evt.preventDefault();
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = Array.from(evt.changedTouches);
    touches.forEach(touch => {
        const stroke = strokes.find(x => x.identifier === touch.identifier);
        if (stroke === undefined) {
            log("can't figure out which touch to continue");
            return;
        }
        const color = colorForStroke(stroke);
        ctx.beginPath();
        ctx.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        ctx.lineTo(touch.pageX, touch.pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        ctx.stroke();
        stroke.log.push({ x: touch.pageX, y: touch.pageY });
    });
}
function handleEnd(evt) {
    evt.preventDefault();
    log("touchend");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null)
        return;
    const touches = Array.from(evt.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
        const stroke = strokes[strokeIndex];
        if (stroke === undefined) {
            log("can't figure out which touch to end");
            return;
        }
        const color = colorForStroke(stroke);
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        ctx.lineTo(touch.pageX, touch.pageY);
        ctx.fillRect(touch.pageX - 4, touch.pageY - 4, 8, 8); // and a square at the end
        strokes.splice(strokeIndex, 1); // remove it; we're done
    });
}
function handleCancel(evt) {
    evt.preventDefault();
    log("touchcancel.");
    const touches = Array.from(evt.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
        if (strokeIndex === -1) {
            log("can't figure out which touch to Cansel");
            return;
        }
        strokes.splice(strokeIndex, 1); // remove it; we're done
    });
}
function colorForStroke(stroke) {
    const r = stroke.identifier % 16;
    const g = Math.floor(stroke.identifier / 3) % 16;
    const b = Math.floor(stroke.identifier / 7) % 16;
    const color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
    log("color for touch with identifier " + stroke.identifier + " = " + color);
    return color;
}
function log(msg) {
    var p = document.getElementById('log');
    if (p === null)
        return;
    p.innerHTML = msg + "\n" + p.innerHTML;
}
