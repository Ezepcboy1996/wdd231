// Base path to members JSON source
const dataUrl = 'data/members.json';
const container = document.getElementById('directory-container');

// Fetch and display members
async function getMembers() {
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error('Network issue loading member data.');
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `<p class="error">Unable to load directory at this time.</p>`;
    }
}

// Map membership levels to strings
const getLevelName = (level) => {
    switch(level) {
        case 3: return 'Gold Member';
        case 2: return 'Silver Member';
        default: return 'Member';
    }
};

// Render elements to the DOM
function displayMembers(members) {
    container.innerHTML = ""; // Clear wrapper
    
    members.forEach(member => {
        const section = document.createElement('section');
        section.className = `member-card lvl-${member.membershipLevel}`;

        section.innerHTML = `
            <img src="${member.image}" alt="${member.name} Logo" loading="lazy">
            <h3>${member.name}</h3>
            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>
            <p class="membership">${getLevelName(member.membershipLevel)}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        `;
        container.appendChild(section);
    });
}

// Grid vs List Toggle Control
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

gridBtn.addEventListener('click', () => {
    container.classList.add('grid');
    container.classList.remove('list');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    container.classList.add('list');
    container.classList.remove('grid');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});

// Responsive Hamburger Navigation Menu
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Automatically setup footer date details
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Run data engine
getMembers();
