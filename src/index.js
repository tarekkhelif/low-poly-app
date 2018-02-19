import "./style.css";

const arr = [...Array(20)];

const p = document.createElement("p");

for (const e of arr) {
  p.innerText += `${Math.floor(Math.random() * 20)} `;
}

document.body.appendChild(p);

const prom = new Promise((res, rej) => console.log("promiseeeee", res));

throw new Error("errorrororororor");
