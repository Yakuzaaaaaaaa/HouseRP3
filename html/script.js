// Elementy DOM
const carHud = document.getElementById('carhud');
const speedValue = document.getElementById('speed');
const speedProgress = document.querySelector('.speed-progress');
const rpmBar = document.getElementById('rpmBar');
const rpmValue = document.getElementById('rpmValue');
const gearValue = document.getElementById('gear');
const fuelBar = document.getElementById('fuelBar');
const fuelValue = document.getElementById('fuelValue');
const healthBar = document.getElementById('healthBar');
const healthValue = document.getElementById('healthValue');
const engineIndicator = document.getElementById('engineIndicator');
const lightsIndicator = document.getElementById('lightsIndicator');
const beltIndicator = document.getElementById('beltIndicator');
const vehicleName = document.getElementById('vehicleName');

// Dodaj gradient SVG do speed circle
const svg = document.querySelector('.speed-svg');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
gradient.setAttribute('id', 'speedGradient');
gradient.setAttribute('x1', '0%');
gradient.setAttribute('y1', '0%');
gradient.setAttribute('x2', '100%');
gradient.setAttribute('y2', '0%');

const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop1.setAttribute('offset', '0%');
stop1.setAttribute('style', 'stop-color:#00bfff;stop-opacity:1');

const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
stop2.setAttribute('offset', '100%');
stop2.setAttribute('style', 'stop-color:#00ffff;stop-opacity:1');

gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);
svg.insertBefore(defs, svg.firstChild);

// Stan HUD
let hudVisible = false;
let currentSpeed = 0;

// Funkcja do animacji liczb
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = Math.round(end);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Funkcja do aktualizacji prędkości
function updateSpeed(speed) {
    const targetSpeed = Math.round(speed);

    // Animacja wartości
    if (Math.abs(targetSpeed - currentSpeed) > 1) {
        animateValue(speedValue, currentSpeed, targetSpeed, 300);
    } else {
        speedValue.textContent = targetSpeed;
    }

    currentSpeed = targetSpeed;

    // Aktualizacja koła (max 300 km/h)
    const percent = Math.min((speed / 300) * 100, 100);
    speedProgress.style.setProperty('--speed-percent', percent);

    // Zmiana koloru przy wysokiej prędkości
    if (speed > 200) {
        speedValue.style.color = '#ff00ff';
        speedValue.style.textShadow = '0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.4)';
    } else if (speed > 150) {
        speedValue.style.color = '#00ffff';
        speedValue.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)';
    } else {
        speedValue.style.color = '#00bfff';
        speedValue.style.textShadow = '0 0 10px rgba(0, 191, 255, 0.8), 0 0 20px rgba(0, 191, 255, 0.4)';
    }
}

// Funkcja do aktualizacji RPM
function updateRPM(rpm) {
    const rpmPercent = Math.min(rpm * 100, 100);
    rpmBar.style.width = rpmPercent + '%';
    rpmValue.textContent = (rpm * 10).toFixed(1);

    // Dodaj klasę high-rpm przy wysokich obrotach
    if (rpm > 0.8) {
        rpmBar.classList.add('high-rpm');
    } else {
        rpmBar.classList.remove('high-rpm');
    }
}

// Funkcja do aktualizacji biegu
function updateGear(gear) {
    if (gear === 0) {
        gearValue.textContent = 'R';
        gearValue.classList.add('reverse');
    } else {
        gearValue.textContent = gear;
        gearValue.classList.remove('reverse');
    }
}

// Funkcja do aktualizacji paliwa
function updateFuel(fuel) {
    const fuelPercent = Math.max(0, Math.min(fuel, 100));
    fuelBar.style.width = fuelPercent + '%';
    fuelValue.textContent = Math.round(fuelPercent) + '%';

    // Dodaj klasę low przy niskim poziomie paliwa
    if (fuelPercent < 20) {
        fuelBar.classList.add('low');
    } else {
        fuelBar.classList.remove('low');
    }
}

// Funkcja do aktualizacji zdrowia pojazdu
function updateHealth(health) {
    const healthPercent = Math.max(0, Math.min(health, 100));
    healthBar.style.width = healthPercent + '%';
    healthValue.textContent = Math.round(healthPercent) + '%';

    // Dodaj klasę low przy niskim poziomie zdrowia
    if (healthPercent < 30) {
        healthBar.classList.add('low');
    } else {
        healthBar.classList.remove('low');
    }
}

// Funkcja do aktualizacji wskaźników
function updateIndicators(engine, lights, belt) {
    if (engine) {
        engineIndicator.classList.add('active');
    } else {
        engineIndicator.classList.remove('active');
    }

    if (lights) {
        lightsIndicator.classList.add('active');
    } else {
        lightsIndicator.classList.remove('active');
    }

    if (belt) {
        beltIndicator.classList.add('active');
    } else {
        beltIndicator.classList.remove('active');
    }
}

// Funkcja do pokazania/ukrycia HUD
function setHudVisibility(visible) {
    if (visible && !hudVisible) {
        carHud.classList.add('active');
        hudVisible = true;
    } else if (!visible && hudVisible) {
        carHud.classList.remove('active');
        hudVisible = false;
    }
}

// Funkcja do aktualizacji nazwy pojazdu
function updateVehicleName(name) {
    vehicleName.textContent = name.toUpperCase();
}

// Nasłuchiwanie wiadomości z NUI
window.addEventListener('message', (event) => {
    const data = event.data;

    switch(data.action) {
        case 'updateHud':
            setHudVisibility(data.show);
            if (data.show) {
                if (data.speed !== undefined) updateSpeed(data.speed);
                if (data.rpm !== undefined) updateRPM(data.rpm);
                if (data.gear !== undefined) updateGear(data.gear);
                if (data.fuel !== undefined) updateFuel(data.fuel);
                if (data.health !== undefined) updateHealth(data.health);
                if (data.vehicle !== undefined) updateVehicleName(data.vehicle);

                updateIndicators(
                    data.engine !== undefined ? data.engine : false,
                    data.lights !== undefined ? data.lights : false,
                    data.belt !== undefined ? data.belt : false
                );
            }
            break;

        case 'hideHud':
            setHudVisibility(false);
            break;

        case 'showHud':
            setHudVisibility(true);
            break;
    }
});

// Ukryj HUD domyślnie
setHudVisibility(false);

// Debug - możesz usunąć w produkcji
console.log('CarHUD JavaScript załadowany');
