function startup() {
    const el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
    log("initialized.");
}
interface TouchStroke {
    readonly identifier: number;
    readonly log: { x: number, y: number; }[];
};
function strokeStart(touch: Touch): TouchStroke {
    return {
        identifier: touch.identifier,
        log: [{ x: touch.pageX, y: touch.pageY }],
    };
}

const strokes: TouchStroke[] = [];
function handleStart(evt: TouchEvent) {
    evt.preventDefault();
    log("touchstart.");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null) return;

    const touches: Touch[] = Array.from(evt.changedTouches);

    touches.forEach(touch => {
        const stroke = strokeStart(touch);
        strokes.push(stroke);

        ctx.beginPath();
        ctx.arc(touch.pageX, touch.pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        ctx.fillStyle = "black";
        ctx.fill();
        log("touchstart");
    });
}
function handleMove(evt: TouchEvent) {
    evt.preventDefault();
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null) return;

    const touches = Array.from(evt.changedTouches);

    touches.forEach(touch => {
        const stroke = strokes.find(x => x.identifier === touch.identifier);
        if (stroke === undefined) {
            log("can't figure out which touch to continue");
            return;
        }
        ctx.beginPath();
        ctx.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        ctx.lineTo(touch.pageX, touch.pageY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";
        ctx.stroke();

        stroke.log.push({ x: touch.pageX, y: touch.pageY });
    });
}
function handleEnd(evt: TouchEvent) {
    evt.preventDefault();
    log("touchend");
    const el = document.getElementsByTagName("canvas")[0];
    const ctx = el.getContext("2d");
    if (ctx === null) return;

    const touches = Array.from(evt.changedTouches);

    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
        const stroke = strokes[strokeIndex];
        if (stroke === undefined) {
            log("can't figure out which touch to end");
            return;
        }

        ctx.lineWidth = 4;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(stroke.log[stroke.log.length - 1].x, stroke.log[stroke.log.length - 1].y);
        ctx.lineTo(touch.pageX, touch.pageY);
        ctx.fillRect(touch.pageX - 4, touch.pageY - 4, 8, 8);  // and a square at the end

        strokes.splice(strokeIndex, 1);  // remove it; we're done
    });
}
function handleCancel(evt: TouchEvent) {
    evt.preventDefault();
    log("touchcancel.");
    const touches = Array.from(evt.changedTouches);

    touches.forEach(touch => {
        const strokeIndex = strokes.findIndex(x => x.identifier === touch.identifier);
        if (strokeIndex === -1) {
            log("can't figure out which touch to Cansel");
            return;
        }
        strokes.splice(strokeIndex, 1);  // remove it; we're done
    });
}

function log(msg: string) {
    var p = document.getElementById('log');
    if (p === null) return;

    p.innerHTML = msg + "\n" + p.innerHTML;
}