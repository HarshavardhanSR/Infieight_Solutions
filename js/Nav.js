// Hide the nav while scrolling down, show it again when scrolling up.
(function () {
    const nav = document.getElementById("nav");
    if (!nav) return;
    let lastY = window.scrollY;
    window.addEventListener(
    "scroll",
    () => {
        const y = window.scrollY;
        nav.classList.toggle("nav-hidden", y > lastY && y > 80);
        lastY = y;
    },
    { passive: true }
    );
})();