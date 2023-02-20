// const myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";


const button = document.getElementById('navigate-to-top');

button.addEventListener('click', (event) => {
    window.scrollTo(0, 0);
});