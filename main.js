// Declaración de variables
// 3 declaraciones de constantes arriba
const cards = document.getElementById("cards");

// 10 crear variable para controlar el body de la tabla donde agregamos los productos
const items = document.getElementById("items");

// 11 crear variable para controlar el footer de la tabla donde mostramos el total
const footer = document.getElementById("footer");

// 8 crear la variable que va a contener los productos seleccionados
// let cart = {
//   1: { id: 1, title: "Cafe", precio: 500, cant: 1 },
//   2: { id: 2, title: "Pizza", precio: 300, cant: 1 },
//   3: { id: 3, title: "Agua", precio: 100, cant: 1 },
// };
let cart = {};

// Eventos
// 2 evento para cuando todo el documento este listo poder pedir la data
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

// 6 añadimos el evento click al listado de cards para controlar cuando se da click en los cards
cards.addEventListener("click", (e) => {
  addCart(e);
});

// 15 controlar los botones de acción de la tabla
items.addEventListener("click", (e) => {
  btnActions(e);
});

// 1 creamos la función para cargar la data (teaser)
const fetchData = async () => {
  try {
    const res = await fetch("./api.json");
    const data = await res.json();
    showCards(data); // 5 llamar la función para pintar las cards
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// 4 crear función para pintar las cards
const showCards = (data) => {
  let list = "";

  data.forEach(({ thumbnailUrl, title, precio, id }) => {
    list += `
        <article>
        <img src="${thumbnailUrl}" >
          <div class="body">
            <h5>${title}</h5>
            <p>${precio}</p>
            <button class="btn btn-dark" data-id='${id}'>Comprar</button>
          </div>
        </article>`;
  });
  cards.innerHTML = list;
};

// 7 función para añadir al carrito
const addCart = (e) => {
  console.log(e.target); // muestra el elemento al cual le hicimos click

  // necesitamos saber si el elemento que le damos click es un botón
  console.log(e.target.classList.contains("btn-dark"));

  if (e.target.classList.contains("btn-dark")) {
    console.log(e.target.parentElement); //nos devuelve el padre del elemento al cual le hicimos click
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

// 9 función para crear un objeto con los datos que extraemos de obj
const setCart = (obj) => {
  //creando el producto que vamos a añadir
  const product = {
    id: obj.querySelector(".btn-dark").dataset.id,
    title: obj.querySelector("h5").textContent,
    precio: obj.querySelector("p").textContent,
    cant: 1,
  };

  //   preguntamos si ese producto nuevo ya existe en el carrito. Si existe, modificamos la cantidad de ese producto
  if (cart.hasOwnProperty(product.id)) {
    product.cant = cart[product.id].cant + 1;
  }

  //   añadimos el nuevo producto y si existe lo modificamos
  cart[product.id] = { ...product };
  //   llamamos a showTable cada vez que agregamos o modificamos productos
  showTable();
};

// 12 función para pintar en la tabla los productos seleccionados
const showTable = () => {
  let rows = "";
  // cart es un objeto con indices y los valores de cada indice son los objetos que tenemos que mostrar en la tabla
  Object.values(cart).forEach(({ title, precio, id, cant }) => {
    rows += `
        <tr>
            <th scope="row">${id}</th>
            <td>${title}</td>
            <td>${cant}</td>
            <td>
              <button class="btn btn-info" data-id='${id}'>+</button>
              <button class="btn btn-danger" data-id='${id}'>-</button>
            </td>
            <td>$ <span>${cant * precio}</span></td>
          </tr>`;
  });

  items.innerHTML = rows;
  showFooter();
};

// 13 función para mostrar el footer de la tabla con el total de elementos y el precio
const showFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Empty cart, start shopping!</th>`;
    return;
  }

  const sumCant = Object.values(cart).reduce(
    (acc, { cant }) => (acc += cant),
    0
  );

  const sumPrecio = Object.values(cart).reduce(
    (acc, { cant, precio }) => acc + cant * precio,
    0
  );

  footer.innerHTML = `<th scope="row" colspan="2">Total products</th>
  <td>${sumCant}</td>
  <td>
    <button class="btn btn-danger btn-sm" id="delete-all">
delete all
    </button>
  </td>
  <td class="font-weight-bold">$ <span>${sumPrecio}</span></td>`;

  // 14 crear variable para controlar el botón delete all
  const deleteButton = document.getElementById("delete-all");
  deleteButton.addEventListener("click", () => {
    cart = {};
    showTable();
  });
};

// 16 creamos función para controlar los botones de la tabla
const btnActions = (e) => {
  // acción de aumentar cantidad
  if (e.target.classList.contains("btn-info")) {
    const product = cart[e.target.dataset.id];
    product.cant = cart[e.target.dataset.id].cant + 1;
    console.log(cart);
    showTable();
  }
  // acción de disminuir cantidad
  if (e.target.classList.contains("btn-danger")) {
    const product = cart[e.target.dataset.id];
    product.cant--;
    if (product.cant === 0) {
      delete cart[e.target.dataset.id];
    }
    showTable();
  }
  e.stopPropagation();
};
