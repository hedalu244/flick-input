"use strict";
function startup() {
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
    log("initialized.");
}
;
const strokes = [];
function strokeStart(stroke) {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.beginPath();
    context.arc(stroke.log[stroke.log.length].x, stroke.log[stroke.log.length].y, 4, 0, 2 * Math.PI, false); // a circle at the start
    context.fillStyle = "black";
    context.fill();
    log("touchstart");
}
function strokeMove(stroke) {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.beginPath();
    context.moveTo(stroke.log[stroke.log.length - 2].x, stroke.log[stroke.log.length - 2].y);
    context.lineTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
    context.lineWidth = 4;
    context.strokeStyle = "black";
    context.stroke();
}
function strokeEnd(stroke) {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.lineWidth = 4;
    context.fillStyle = "black";
    context.beginPath();
    context.moveTo(stroke.log[stroke.log.length - 2].x, stroke.log[stroke.log.length - 2].y);
    context.lineTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
    context.fillRect(stroke.log[stroke.log.length - 1].x - 4, stroke.log[stroke.log.length - 1].y - 4, 8, 8); // and a square at the end
}
function handleStart(event) {
    event.preventDefault();
    log("touchstart.");
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const stroke = {
            id: touch.identifier,
            log: [{ x: touch.pageX, y: touch.pageY }],
        };
        ;
        strokes.push(stroke);
        strokeStart(stroke);
    });
}
function handleMove(event) {
    event.preventDefault();
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const stroke = strokes.find(x => x.id === touch.identifier);
        if (stroke === undefined) {
            log("can't figure out which touch to continue");
            return;
        }
        stroke.log.push({ x: touch.pageX, y: touch.pageY });
        strokeMove(stroke);
    });
}
function handleEnd(event) {
    event.preventDefault();
    log("touchend");
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
        const stroke = strokes[strokeIndex];
        if (stroke === undefined) {
            log("can't figure out which touch to end");
            return;
        }
        strokes.splice(strokeIndex, 1); // remove it; we're done
    });
}
function handleCancel(event) {
    event.preventDefault();
    log("touchcancel.");
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
        if (strokeIndex === -1) {
            log("can't figure out which touch to Cancel");
            return;
        }
        strokes.splice(strokeIndex, 1); // remove it; we're done
    });
}
function log(msg) {
    var p = document.getElementById('log');
    if (p === null)
        return;
    p.innerHTML = msg + "\n" + p.innerHTML;
}
