// ==========================================
// 1. HEADER NAVIGATION & FOOTER DATES
// ==========================================
const menuToggle = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

const currentYearSpan = document.querySelector('#current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

const lastModifiedSpan = document.querySelector('#last-modified');
if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
}

// ==========================================
// 2. OPENWEATHERMAP API (Current + 3-Day)
// ==========================================
const units = 'metric';

async function fetchWeather() {
    const base = 'https://Api.openweathermap.org/data/2.5/';
    const params = '?lat=5.11&lon=7.37&units=metric&appid=a8015036f82cb704ee88ed662fae1704';

    // Fetch Current Weather
    try {
        const weatherRes = await fetch(base + 'weather' + params);
        if (!weatherRes.ok) throw new Error('Weather API error: ' + weatherRes.status);
        const weatherData = await weatherRes.json();
        displayCurrentWeather(weatherData);
    } catch (error) {
        console.error('Weather Error:', error);
        document.getElementById('current-weather').innerHTML = '<p>Weather data unavailable (' + error.message + ').</p>';
    }

    // Fetch 3-Day Forecast
    try {
        const forecastRes = await fetch(base + 'forecast' + params);
        if (!forecastRes.ok) throw new Error('Forecast API error: ' + forecastRes.status);
        const forecastData = await forecastRes.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Forecast Error:', error);
        document.getElementById('weather-forecast').innerHTML = '<p>Forecast unavailable (' + error.message + ').</p>';
    }
}

function displayCurrentWeather(data) {
    const container = document.getElementById('current-weather');
    const tempUnit = units === 'imperial' ? '°F' : '°C';
    const currentCondition = data.weather.at(0);
    const iconSrc = 'https://openweathermap.org/img/wn/' + currentCondition.icon + '@2x.png';
    const desc = currentCondition.description;

    container.innerHTML = `
        <div class="weather-main">
            <img src="${iconSrc}" alt="${desc}" width="64" height="64">
            <div>
                <p><strong>${Math.round(data.main.temp)}${tempUnit}</strong></p>
                <p style="text-transform: capitalize;">${desc}</p>
                <p>High: ${Math.round(data.main.temp_max)}${tempUnit} | Low: ${Math.round(data.main.temp_min)}${tempUnit}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    const container = document.getElementById('weather-forecast');
    const tempUnit = units === 'imperial' ? '°F' : '°C';

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

    container.innerHTML = dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        return '<p><strong>' + dayName + ':</strong> ' + Math.round(day.main.temp) + tempUnit + '</p>';
    }).join('');
}

// ==========================================
// 3. MEMBER SPOTLIGHTS (Gold & Silver Only)
// ==========================================
const membersUrl = 'data/members.json';

async function fetchSpotlights() {
    try {
        const response = await fetch(membersUrl);
        if (!response.ok) throw new Error('Failed to load members.json');
        const data = await response.json();

        const members = Array.isArray(data) ? data : data.members;

        const eligibleMembers = members.filter(member => {
            const level = String(member.membershipLevel || member.membership || '').toLowerCase();
            return level === '3' || level === '2' || level === 'gold' || level === 'silver';
        });

        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligibleMembers[i], eligibleMembers[j]] = [eligibleMembers[j], eligibleMembers[i]];
        }

        displaySpotlights(eligibleMembers.slice(0, 3));

    } catch (error) {
        console.error('Spotlight Error:', error);
    }
}

function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');

    container.innerHTML = members.map(member => {
        const rawLevel = String(member.membershipLevel || member.membership || '').toLowerCase();
        const isGold = rawLevel === '3' || rawLevel === 'gold';
        const levelLabel = isGold ? 'Gold Member' : 'Silver Member';
        const badgeClass = isGold ? 'badge-gold' : 'badge-silver';
        const imgPath = member.image || member.imageurl || member.logo || '';

        return `
            <article class="spotlight-card">
                <h3>${member.name}</h3>
                <span class="membership-badge ${badgeClass}">${levelLabel}</span>
                <img src="${imgPath}" alt="${member.name} Logo" loading="lazy">
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
            </article>
        `;
    }).join('');
}

fetchWeather();
fetchSpotlights();
