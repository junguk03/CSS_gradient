// 상태 관리
let colors = [
    { color: '#667eea', position: 0, alpha: 1 },
    { color: '#764ba2', position: 100, alpha: 1 }
];

// 프리셋 정의
const presets = [
    { name: 'Sunset', colors: ['#ff512f', '#dd2476'], type: 'linear', direction: 'to right' },
    { name: 'Ocean', colors: ['#2193b0', '#6dd5ed'], type: 'linear', direction: 'to right' },
    { name: 'Purple', colors: ['#667eea', '#764ba2'], type: 'linear', direction: '135deg' },
    { name: 'Peach', colors: ['#ed6ea0', '#ec8c69'], type: 'linear', direction: 'to right' },
    { name: 'Mojito', colors: ['#1D976C', '#93F9B9'], type: 'linear', direction: 'to right' },
    { name: 'Cherry', colors: ['#eb3349', '#f45c43'], type: 'linear', direction: 'to right' },
    { name: 'Aqua', colors: ['#00d2ff', '#3a7bd5'], type: 'linear', direction: 'to right' },
    { name: 'Rose', colors: ['#f953c6', '#b91d73'], type: 'linear', direction: 'to right' },
    { name: 'Midnight', colors: ['#232526', '#414345'], type: 'linear', direction: 'to bottom' },
    { name: 'Fire', colors: ['#f12711', '#f5af19'], type: 'linear', direction: 'to right' },
    { name: 'Royal', colors: ['#141e30', '#243b55'], type: 'linear', direction: 'to right' },
    { name: 'Rainbow', colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'], type: 'linear', direction: 'to right' }
];

// DOM 요소
const preview = document.getElementById('preview');
const gradientType = document.getElementById('gradientType');
const direction = document.getElementById('direction');
const angle = document.getElementById('angle');
const angleGroup = document.getElementById('angleGroup');
const directionGroup = document.getElementById('directionGroup');
const radialShapeGroup = document.getElementById('radialShapeGroup');
const radialShape = document.getElementById('radialShape');
const colorList = document.getElementById('colorList');
const addColorBtn = document.getElementById('addColorBtn');
const codeOutput = document.getElementById('codeOutput');
const copyBtn = document.getElementById('copyBtn');
const colorCount = document.getElementById('colorCount');
const presetsGrid = document.getElementById('presetsGrid');

// 랜덤 색상 생성
function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// 그라디언트 업데이트
function updateGradient() {
    const type = gradientType.value;
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);

    const colorStops = sortedColors.map(c => {
        const hex = c.color;
        if (c.alpha < 1) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${c.alpha}) ${c.position}%`;
        }
        return `${hex} ${c.position}%`;
    }).join(', ');

    let gradientCSS = '';
    let directionValue = '';

    if (type === 'linear') {
        if (direction.value === 'custom') {
            directionValue = `${angle.value}deg`;
        } else {
            directionValue = direction.value;
        }
        gradientCSS = `linear-gradient(${directionValue}, ${colorStops})`;
    } else if (type === 'radial') {
        const shape = radialShape.value;
        gradientCSS = `radial-gradient(${shape}, ${colorStops})`;
    } else if (type === 'conic') {
        gradientCSS = `conic-gradient(from ${angle.value}deg, ${colorStops})`;
    }

    preview.style.background = gradientCSS;
    updateCodeOutput(gradientCSS);
}

// 코드 출력 업데이트
function updateCodeOutput(css) {
    const formatted = css
        .replace(/(linear-gradient|radial-gradient|conic-gradient)/g, '<span class="function">$1</span>')
        .replace(/(#[a-fA-F0-9]{6})/g, '<span class="color">$1</span>')
        .replace(/(rgba?\([^)]+\))/g, '<span class="color">$1</span>')
        .replace(/(\d+%)/g, '<span class="value">$1</span>')
        .replace(/(\d+deg)/g, '<span class="value">$1</span>');

    codeOutput.innerHTML = `<span class="property">background</span>: ${formatted};`;
}

// 색상 리스트 렌더링
function renderColors() {
    colorList.innerHTML = '';
    colorCount.textContent = `${colors.length} / 10`;
    addColorBtn.disabled = colors.length >= 10;

    colors.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'color-item';
        div.innerHTML = `
            <span class="color-number">${index + 1}</span>
            <div class="color-picker-wrapper">
                <input type="color" value="${item.color}" data-index="${index}" class="color-input">
            </div>
            <span class="color-hex">${item.color.toUpperCase()}</span>
            <div class="position-slider">
                <input type="range" min="0" max="100" value="${item.position}" data-index="${index}" class="position-input">
                <span class="position-value">${item.position}%</span>
            </div>
            <button class="remove-btn" data-index="${index}" ${colors.length <= 2 ? 'disabled' : ''}>×</button>
        `;
        colorList.appendChild(div);
    });

    // 이벤트 리스너 추가
    document.querySelectorAll('.color-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.index);
            colors[idx].color = e.target.value;
            e.target.closest('.color-item').querySelector('.color-hex').textContent = e.target.value.toUpperCase();
            updateGradient();
        });
    });

    document.querySelectorAll('.position-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.index);
            colors[idx].position = parseInt(e.target.value);
            e.target.closest('.color-item').querySelector('.position-value').textContent = e.target.value + '%';
            updateGradient();
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (colors.length > 2) {
                const idx = parseInt(e.target.dataset.index);
                colors.splice(idx, 1);
                renderColors();
                updateGradient();
            }
        });
    });
}

// 프리셋 렌더링
function renderPresets() {
    presetsGrid.innerHTML = '';
    presets.forEach((preset, index) => {
        const div = document.createElement('div');
        div.className = 'preset-item';
        const colorStops = preset.colors.map((c, i) =>
            `${c} ${Math.round(i * 100 / (preset.colors.length - 1))}%`
        ).join(', ');
        div.style.background = `linear-gradient(to right, ${colorStops})`;
        div.title = preset.name;
        div.addEventListener('click', () => applyPreset(preset));
        presetsGrid.appendChild(div);
    });
}

// 프리셋 적용
function applyPreset(preset) {
    colors = preset.colors.map((c, i) => ({
        color: c,
        position: Math.round(i * 100 / (preset.colors.length - 1)),
        alpha: 1
    }));

    gradientType.value = preset.type;
    handleTypeChange();

    if (preset.direction.includes('deg')) {
        direction.value = 'custom';
        angle.value = parseInt(preset.direction);
        angleGroup.style.display = 'block';
    } else {
        direction.value = preset.direction;
    }

    renderColors();
    updateGradient();
}

// 타입 변경 핸들러
function handleTypeChange() {
    const type = gradientType.value;

    if (type === 'linear') {
        directionGroup.style.display = 'block';
        radialShapeGroup.style.display = 'none';
        angleGroup.style.display = direction.value === 'custom' ? 'block' : 'none';
    } else if (type === 'radial') {
        directionGroup.style.display = 'none';
        angleGroup.style.display = 'none';
        radialShapeGroup.style.display = 'block';
    } else if (type === 'conic') {
        directionGroup.style.display = 'none';
        radialShapeGroup.style.display = 'none';
        angleGroup.style.display = 'block';
    }

    updateGradient();
}

// 이벤트 리스너
gradientType.addEventListener('change', handleTypeChange);

direction.addEventListener('change', () => {
    angleGroup.style.display = direction.value === 'custom' ? 'block' : 'none';
    updateGradient();
});

angle.addEventListener('input', updateGradient);
radialShape.addEventListener('change', updateGradient);

addColorBtn.addEventListener('click', () => {
    if (colors.length < 10) {
        const lastPosition = colors[colors.length - 1].position;
        const newPosition = Math.min(lastPosition + 20, 100);
        colors.push({
            color: randomColor(),
            position: newPosition,
            alpha: 1
        });
        renderColors();
        updateGradient();
    }
});

copyBtn.addEventListener('click', () => {
    const type = gradientType.value;
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);

    const colorStops = sortedColors.map(c => {
        const hex = c.color;
        if (c.alpha < 1) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${c.alpha}) ${c.position}%`;
        }
        return `${hex} ${c.position}%`;
    }).join(', ');

    let css = '';
    if (type === 'linear') {
        const dir = direction.value === 'custom' ? `${angle.value}deg` : direction.value;
        css = `background: linear-gradient(${dir}, ${colorStops});`;
    } else if (type === 'radial') {
        css = `background: radial-gradient(${radialShape.value}, ${colorStops});`;
    } else if (type === 'conic') {
        css = `background: conic-gradient(from ${angle.value}deg, ${colorStops});`;
    }

    navigator.clipboard.writeText(css).then(() => {
        copyBtn.innerHTML = '<span>✓</span> 복사됨!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.innerHTML = '<span>📋</span> 복사하기';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

// 초기화
renderColors();
renderPresets();
updateGradient();
