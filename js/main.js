let teamData = [];
let currentIndex = 0;
let slideInterval;

// 1. Fetch Dữ liệu (Backend Simulation)
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        teamData = data;
        renderCarousel();
        renderGrid();
        startSlideshow();
    });

// 2. Render Giao diện
function renderCarousel() {
    const track = document.getElementById('carousel-track');
    track.innerHTML = '';
    teamData.forEach((member, index) => {
        // Tạo thẻ a bao bọc để click chuyển trang và truyền ID lên URL
        const card = document.createElement('a');
        card.href = `cv.html?id=${member.id}`;
        card.className = `member-card fade-in ${index === currentIndex ? 'active' : ''}`;
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} - ${member.title}">
            <h3>${member.name}</h3>
            <p>${member.title}</p>
        `;
        // Pause on hover
        card.addEventListener('mouseenter', stopSlideshow);
        card.addEventListener('mouseleave', startSlideshow);
        track.appendChild(card);
    });
}

function renderGrid() {
    const grid = document.getElementById('grid-section');
    grid.innerHTML = '';
    teamData.forEach(member => {
        const card = document.createElement('a');
        card.href = `cv.html?id=${member.id}`;
        card.className = `member-card fade-in`;
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p>${member.title}</p>
        `;
        grid.appendChild(card);
    });
}

// 3. Logic Chuyển Slide (setInterval & transform)
function nextSlide() {
    currentIndex = (currentIndex + 1) % teamData.length;
    renderCarousel();
}
function prevSlide() {
    currentIndex = (currentIndex - 1 + teamData.length) % teamData.length;
    renderCarousel();
}

function startSlideshow() {
    stopSlideshow(); // Clear previous interval to avoid stacking
    slideInterval = setInterval(nextSlide, 3000);
}
function stopSlideshow() {
    clearInterval(slideInterval);
}

document.getElementById('next-btn').addEventListener('click', () => { stopSlideshow(); nextSlide(); });
document.getElementById('prev-btn').addEventListener('click', () => { stopSlideshow(); prevSlide(); });

// 4. Nút View All (Toggle Grid/Flexbox)
const viewAllBtn = document.getElementById('view-all-btn');
const carouselSec = document.getElementById('carousel-section');
const gridSec = document.getElementById('grid-section');

viewAllBtn.addEventListener('click', () => {
    carouselSec.classList.toggle('hidden');
    gridSec.classList.toggle('hidden');
    if (gridSec.classList.contains('hidden')) {
        viewAllBtn.innerText = 'View All Members';
        startSlideshow();
    } else {
        viewAllBtn.innerText = 'Show Carousel';
        stopSlideshow();
    }
});