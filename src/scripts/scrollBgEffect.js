const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('showMove');
            entry.target.classList.remove('hideMove');
        }
    });
});

const portfolioElements = document.getElementsByClassName("item");
for (let i = 0; i < portfolioElements.length; i++) {
    portfolioElements[i].classList.add('hideMove');
    observer.observe(portfolioElements[i]);
}