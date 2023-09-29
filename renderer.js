const menu = document.body.querySelector('.menu');
const menuItems = menu.querySelectorAll('.menu-item');
const menuBorder = menu.querySelector('.menu-border');
let activeItem = menu.querySelector('.active');

function clickItem(item, index) {
    if (activeItem == item) return;
    if (activeItem) {
        activeItem.classList.remove('active');
    }
    item.classList.add('active');
    activeItem = item;
}

menuItems.forEach((item, index) => {
    item.addEventListener('click', () => clickItem(item, index));
})