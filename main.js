"use strict";
const strokes = [];
function initStrokeEvent(element) {
    element.addEventListener("touchstart", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const rect = element.getBoundingClientRect();
            const stroke = {
                id: touch.identifier,
                log: [{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }],
            };
            ;
            strokes.push(stroke);
            strokeStart(stroke);
        });
    }, false);
    element.addEventListener("touchmove", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const rect = element.getBoundingClientRect();
            const stroke = strokes.find(x => x.id === touch.identifier);
            if (stroke === undefined)
                return;
            stroke.log.push({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
            strokeMove(stroke);
        });
    }, false);
    element.addEventListener("touchend", (event) => {
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
    element.addEventListener("touchcancel", (event) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
            if (strokeIndex === -1)
                return;
            strokes.splice(strokeIndex, 1); // remove it; we're done
        });
    }, false);
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
let coord = {
    x: 300,
    y: 300,
};
let prevCoord = {
    x: 300,
    y: 300,
};
const size = 50;
let transition = 1;
function move(direction) {
    prevCoord = coord;
    transition = 0;
    navigator.vibrate(80);
    coord = {
        "left": { x: coord.x - size, y: coord.y },
        "right": { x: coord.x + size, y: coord.y },
        "up": { x: coord.x, y: coord.y - size },
        "down": { x: coord.x, y: coord.y + size },
    }[direction];
}
function drawLoop() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null)
        return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (1 <= transition) {
        context.fillStyle = "lightgray";
        if (strokes.length !== 0) {
            context.beginPath();
            context.moveTo(coord.x - 50, coord.y - 30);
            context.lineTo(coord.x - 50 - 30, coord.y);
            context.lineTo(coord.x - 50, coord.y + 30);
            context.closePath();
            context.fill();
            context.beginPath();
            context.moveTo(coord.x + 50, coord.y - 30);
            context.lineTo(coord.x + 50 + 30, coord.y);
            context.lineTo(coord.x + 50, coord.y + 30);
            context.closePath();
            context.fill();
            context.beginPath();
            context.moveTo(coord.x - 30, coord.y - 50);
            context.lineTo(coord.x, coord.y - 30 - 50);
            context.lineTo(coord.x + 30, coord.y - 50);
            context.closePath();
            context.fill();
            context.beginPath();
            context.moveTo(coord.x - 30, coord.y + 50);
            context.lineTo(coord.x, coord.y + 30 + 50);
            context.lineTo(coord.x + 30, coord.y + 50);
            context.closePath();
            context.fill();
        }
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
    }
    const mixCoord = {
        x: prevCoord.x + (coord.x - prevCoord.x) * transition,
        y: prevCoord.y + (coord.y - prevCoord.y) * transition,
    };
    context.fillStyle = "gray";
    context.fillRect(mixCoord.x - size / 2, mixCoord.y - size / 2, size, size);
    transition = Math.min(transition + 0.1, 1);
    requestAnimationFrame(drawLoop);
}
function strokeStart(stroke) {
}
function strokeMove(stroke) {
}
function strokeEnd(stroke) {
    if (transition < 1)
        return;
    const result = isFrick(stroke);
    switch (result) {
        case "left_flick":
            move("left");
            break;
        case "right_flick":
            move("right");
            break;
        case "up_flick":
            move("up");
            break;
        case "down_flick":
            move("down");
            break;
    }
}
function keyDown(event) {
    if (event.repeat)
        return;
    switch (event.code) {
        case "ArrowLeft":
            {
                move("left");
            }
            break;
        case "ArrowRight":
            {
                move("right");
            }
            break;
        case "ArrowUp":
            {
                move("up");
            }
            break;
        case "ArrowDown":
            {
                move("down");
            }
            break;
    }
}
window.onload = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    initStrokeEvent(canvas);
    document.addEventListener("keydown", keyDown, false);
    drawLoop();
};
