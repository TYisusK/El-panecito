// Lógica para carrusel de imágenes automático
let currentIndex = 0;
const allCarousels = document.querySelectorAll('.carousel');

function moveCarousel() {
    allCarousels.forEach(carousel => {
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        let activeIndex = Array.from(carouselItems).findIndex(item => item.classList.contains('active'));
        activeIndex = (activeIndex + 1) % carouselItems.length;

        carouselItems.forEach(item => item.classList.remove('active'));
        carouselItems[activeIndex].classList.add('active');
    });
}

// Iniciar el carrusel automático
setInterval(moveCarousel, 3000);  // Cambiar imagen cada 3 segundos
