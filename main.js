"use strict";
const strokes = [];
function strokeStart(stroke) {
}
function strokeMove(stroke) {
}
function strokeEnd(stroke) {
    const result = isFrick(stroke);
    switch (result) {
        case "left_flick":
            coord.x -= size;
            navigator.vibrate(100);
            break;
        case "right_flick":
            coord.x += size;
            navigator.vibrate(100);
            break;
        case "up_flick":
            coord.y -= size;
            navigator.vibrate(100);
            break;
        case "down_flick":
            coord.y += size;
            navigator.vibrate(100);
            break;
    }
}
const flickRange = 50;
function isFrick(stroke) {
    const dx = stroke.log[stroke.log.length - 1].x - stroke.log[0].x;
    const dy = stroke.log[stroke.log.length - 1].y - stroke.log[0].y;
    if (dx * dx + dy * dy < flickRange * flickRange)
        return null;
    if (Math.abs(dy) < Math.abs(dx)) {
        return (0 < dx) ? "right_flick" : "left_flick";
    }
    else {
        return (0 < dy) ? "down_flick" : "up_flick";
    }
}
const coord = {
    x: 300,
    y: 300,
};
const size = 50;
function drawLoop() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "gold";
    strokes.forEach((stroke) => {
        switch (isFrick(stroke)) {
            case "left_flick":
                {
                    context.beginPath();
                    context.moveTo(coord.x - 50, coord.y - 50);
                    context.lineTo(coord.x - 50 - 50, coord.y);
                    context.lineTo(coord.x - 50, coord.y + 50);
                    context.closePath();
                    context.fill();
                }
                break;
            case "right_flick":
                {
                    context.beginPath();
                    context.moveTo(coord.x + 50, coord.y - 50);
                    context.lineTo(coord.x + 50 + 50, coord.y);
                    context.lineTo(coord.x + 50, coord.y + 50);
                    context.closePath();
                    context.fill();
                }
                break;
            case "up_flick":
                {
                    context.beginPath();
                    context.moveTo(coord.x - 50, coord.y - 50);
                    context.lineTo(coord.x, coord.y - 50 - 50);
                    context.lineTo(coord.x + 50, coord.y - 50);
                    context.closePath();
                    context.fill();
                }
                break;
            case "down_flick":
                {
                    context.beginPath();
                    context.moveTo(coord.x - 50, coord.y + 50);
                    context.lineTo(coord.x, coord.y + 50 + 50);
                    context.lineTo(coord.x + 50, coord.y + 50);
                    context.closePath();
                    context.fill();
                }
                break;
        }
    });
    context.fillStyle = "gray";
    context.fillRect(coord.x - size / 2, coord.y - size / 2, size, size);
    requestAnimationFrame(drawLoop);
}
window.onload = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const rect = canvas.getBoundingClientRect();
            const stroke = {
                id: touch.identifier,
                log: [{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }],
            };
            ;
            strokes.push(stroke);
            strokeStart(stroke);
        });
    }, false);
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const rect = canvas.getBoundingClientRect();
            const stroke = strokes.find(x => x.id === touch.identifier);
            if (stroke === undefined)
                return;
            stroke.log.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
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
    drawLoop();
};
