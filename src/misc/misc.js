// anything that doesn't belong to any file
hlp.rainbow = () => {
  [...document.querySelectorAll("*")].forEach((element) => {
    element.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    element.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    element.style.borderColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  });
};

hlp.rainbowSeizure = () => {
  setInterval(hlp.rainbow, 1);
};