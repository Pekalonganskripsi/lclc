// assets/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Add disco animation to header
    const discoElements = document.querySelectorAll('.neon-text, .disco-glow');
    let colorIndex = 0;
    const discoColors = ['#FF0077', '#00FFFF', '#FFD700', '#FF6B6B', '#4ECDC4', '#1A535C'];
    
    function changeDiscoColor() {
        if (discoElements.length > 0) {
            discoElements.forEach(element => {
                element.style.color = discoColors[colorIndex];
                element.style.textShadow = `0 0 5px ${discoColors[colorIndex]}, 0 0 10px ${discoColors[colorIndex]}`;
            });
            colorIndex = (colorIndex + 1) % discoColors.length;
        }
    }
    
    // Animate disco elements every 1.5 seconds
    setInterval(changeDiscoColor, 1500);
    
    // Add glassmorphism effect on hover for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        });
    });
});