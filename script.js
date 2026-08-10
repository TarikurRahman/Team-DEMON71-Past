const counters = document.querySelectorAll('.counter');
const speed = 200;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target;
        }
    };
    
    // Start animation when page loads
    updateCount();
});

const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

window.addEventListener('DOMContentLoaded', () => {
    VANTA.NET({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xff4d00,         // Martian Orange
      backgroundColor: 0x050505, // Deep Dark
      points: 8.00,            // Points komiye deya hoyeche (Minimalist)
      maxDistance: 24.00,      // Connection line-er length barano hoyeche
      spacing: 20.00,          // Dot-gulo ektu dure dure thakbe
      showDots: false          // Shudhu lines dekhabe, jeta onno-rokom organic vibe dey
    })
});