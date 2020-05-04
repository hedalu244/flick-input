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
function strokeStart(touch) {
    return {
        identifier: touch.identifier,
        log: [{ x: touch.pageX, y: touch.pageY }],
    };
}
const strokes = [];
function handleStart(event) {
    event.preventDefault();
    log("touchstart.");
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const stroke = strokeStart(touch);
        strokes.push(stroke);
        context.beginPath();
        context.arc(touch.pageX, touch.pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        context.fillStyle = "black";
        context.fill();
        log("touchstart");
    });
}
function handleMove(event) {
    event.preventDefault();
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const stroke = strokes.find(x => x.identifier === touch.identifier);
        if (stroke === undefined) {
            log("can't figure out which touch to continue");
            return;
        }
        context.beginPath();
        context.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        context.lineTo(touch.pageX, touch.pageY);
        context.lineWidth = 4;
        context.strokeStyle = "black";
        context.stroke();
        stroke.log.push({ x: touch.pageX, y: touch.pageY });
    });
}
function handleEnd(event) {
    event.preventDefault();
    log("touchend");
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
        const stroke = strokes[strokeIndex];
        if (stroke === undefined) {
            log("can't figure out which touch to end");
            return;
        }
        context.lineWidth = 4;
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        context.lineTo(touch.pageX, touch.pageY);
        context.fillRect(touch.pageX - 4, touch.pageY - 4, 8, 8); // and a square at the end
        strokes.splice(strokeIndex, 1); // remove it; we're done
    });
}
function handleCancel(event) {
    event.preventDefault();
    log("touchcancel.");
    const touches = Array.from(event.changedTouches);
    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
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
