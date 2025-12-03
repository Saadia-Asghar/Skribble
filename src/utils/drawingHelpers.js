export const drawStroke = (ctx, stroke) => {
    if (!stroke.path || stroke.path.length < 1) return;

    const { tool, brushType, shapeType, color, size, opacity = 1, path } = stroke;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Handle Brush Types
    if (tool === 'brush' || tool === 'eraser') {
        if (tool === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = size;
        } else if (brushType === 'marker') {
            ctx.globalAlpha = opacity * 0.7;
            ctx.shadowBlur = size / 2;
            ctx.shadowColor = color;
        } else if (brushType === 'highlighter') {
            ctx.globalAlpha = opacity * 0.4;
            ctx.lineWidth = size * 2;
            ctx.lineCap = 'butt';
        } else if (brushType === 'calligraphy') {
            ctx.lineCap = 'butt';
            // Simple calligraphy effect by drawing multiple lines with offset
            // Or just use the standard stroke for now as true calligraphy requires angle awareness
        } else if (brushType === 'spray') {
            ctx.setLineDash([1, size * 2]); // Dotted line effect
        }

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
    }

    // Handle Shape Types
    else if (tool === 'shape' && path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1]; // Use last point for dynamic preview
        const w = end.x - start.x;
        const h = end.y - start.y;

        ctx.beginPath();

        if (shapeType === 'line') {
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        } else if (shapeType === 'rect') {
            ctx.strokeRect(start.x, start.y, w, h);
        } else if (shapeType === 'rect_filled') {
            ctx.fillRect(start.x, start.y, w, h);
        } else if (shapeType === 'circle' || shapeType === 'circle_filled') {
            const radius = Math.sqrt(w * w + h * h);
            ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
            if (shapeType === 'circle_filled') ctx.fill();
            else ctx.stroke();
        } else if (shapeType === 'triangle') {
            ctx.moveTo(start.x + w / 2, start.y); // Top
            ctx.lineTo(start.x, start.y + h);     // Bottom Left
            ctx.lineTo(start.x + w, start.y + h); // Bottom Right
            ctx.closePath();
            ctx.stroke();
        } else if (shapeType === 'arrow') {
            // Draw line
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrow head
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const headLen = size * 3;
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }
    }

    ctx.restore();
};

export const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
};
