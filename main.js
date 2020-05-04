"use strict";
function startup() {
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const stroke = {
                id: touch.identifier,
                log: [{ x: touch.pageX, y: touch.pageY }],
            };
            ;
            strokes.push(stroke);
            strokeStart(stroke);
        });
    }, false);
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const stroke = strokes.find(x => x.id === touch.identifier);
            if (stroke === undefined)
                return;
            stroke.log.push({ x: touch.pageX, y: touch.pageY });
            strokeMove(stroke);
        });
    }, false);
    canvas.addEventListener("touchend", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
            if (strokeIndex === -1)
                return;
            const stroke = strokes[strokeIndex];
            strokes.splice(strokeIndex, 1); // remove it; we're done
            strokeEnd(stroke);
        });
    }, false);
    canvas.addEventListener("touchcancel", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
            if (strokeIndex === -1)
                return;
            strokes.splice(strokeIndex, 1); // remove it; we're done
        });
    }, false);
}
;
const strokes = [];
function strokeStart(stroke) {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.beginPath();
    context.arc(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y, 8, 0, 2 * Math.PI, false); // a circle at the start
    context.fillStyle = "black";
    context.fill();
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
    context.fillRect(stroke.log[stroke.log.length - 1].x - 8, stroke.log[stroke.log.length - 1].y - 8, 16, 16); // and a square at the end
}
