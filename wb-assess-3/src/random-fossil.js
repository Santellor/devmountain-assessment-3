import axios from "axios";
console.log('Hello World');

document.querySelector('#get-random-fossil').addEventListener(`click`, async () => {
    // Picture destination
    const randomDiv = document.querySelector("#random-fossil-image")

    // Name destination
    const randomName = document.querySelector("#random-fossil-name")

    // create our response and fetch the required data (async - await method)
    const res = await axios.get('/random-fossil.json')

    // fill Name destination
    randomName.innerText = res.data.name

    // fill Picture destination
    randomDiv.innerHTML = `<img src=${res.data.img}>`
})