interface TouchStroke {
    readonly id: number;
    readonly log: { x: number, y: number; }[];
}
const strokes: TouchStroke[] = [];

function strokeStart(stroke: TouchStroke) {
}
function strokeMove(stroke: TouchStroke) {
}
function strokeEnd(stroke: TouchStroke) {
    const result = isFrick(stroke)
    switch(result) {
        case "left_flick":
        case "right_flick":
        case "up_flick":
        case "down_flick":
            navigator.vibrate(30);
            alert(result);
            break;
    }
}

const flickRange = 50;
function isFrick(stroke: TouchStroke) {
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

function drawLoop() {
    const canvas = document.getElementsByTagName("canvas")[0];
    const context = canvas.getContext("2d");
    if (context === null) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
        switch (isFrick(stroke)) {
            case "left_flick": {
                context.beginPath();
                context.moveTo(stroke.log[0].x, stroke.log[0].y);
                context.lineTo(stroke.log[0].x - 50, stroke.log[0].y - 50);
                context.lineTo(stroke.log[0].x - 50, stroke.log[0].y + 50);
                context.closePath();
                context.fill();
            } break;
            case "right_flick": {
                context.beginPath();
                context.moveTo(stroke.log[0].x, stroke.log[0].y);
                context.lineTo(stroke.log[0].x + 50, stroke.log[0].y - 50);
                context.lineTo(stroke.log[0].x + 50, stroke.log[0].y + 50);
                context.closePath();
                context.fill();
            } break;
            case "up_flick": {
                context.beginPath();
                context.moveTo(stroke.log[0].x, stroke.log[0].y);
                context.lineTo(stroke.log[0].x - 50, stroke.log[0].y - 50);
                context.lineTo(stroke.log[0].x + 50, stroke.log[0].y - 50);
                context.closePath();
                context.fill();
            } break;
            case "down_flick": {
                context.beginPath();
                context.moveTo(stroke.log[0].x, stroke.log[0].y);
                context.lineTo(stroke.log[0].x - 50, stroke.log[0].y + 50);
                context.lineTo(stroke.log[0].x + 50, stroke.log[0].y + 50);
                context.closePath();
                context.fill();
            } break;
        }
    });

    requestAnimationFrame(drawLoop);
}


window.onload = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("touchstart", (event: TouchEvent) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const rect = canvas.getBoundingClientRect();
            const stroke = {
                id: touch.identifier,
                log: [{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }],
            };;
            strokes.push(stroke);
            strokeStart(stroke);
        });
    }, false);
    canvas.addEventListener("touchmove", (event: TouchEvent) => {
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
    canvas.addEventListener("touchend", (event: TouchEvent) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
            if (strokeIndex === -1)
                return;
            const stroke = strokes[strokeIndex];
            strokes.splice(strokeIndex, 1);  // remove it; we're done
            strokeEnd(stroke);
        });
    }, false);
    canvas.addEventListener("touchcancel", (event: TouchEvent) => {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            const strokeIndex = strokes.findIndex(x => x.id === touch.identifier);
            if (strokeIndex === -1)
                return;
            strokes.splice(strokeIndex, 1);  // remove it; we're done
        });
    }, false);

    drawLoop();
}