const pool = require("../db/conexion");
const format = require("pg-format");

//obtener todos los productos
const getJoyas = async ({limits = 10, page = 1, order_by = "id_asc"}) => {
    const [campo, direccion] = order_by.split("_");
    const offset = limits * (page - 1);
    const { rows: joyas } = await pool.query(
      format(
        "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
        campo,
        direccion,
        limits,
        offset
      )
    );
  return joyas;
};

const getHATEOAS = (joyas) => {
  const results = joyas.map((joya) => ({
    id: joya.id,
    nombre: joya.nombre,
    categoria: joya.categoria,
    metal: joya.metal,
    precio: joya.precio,
    stock: joya.stock,
    url: `/joyas/joya/${joya.id}`,
  }));
    
    const totalJoyas = 6;
    const totalJoyaxPage = results.length
    const paginacion = `${page} de ${Math.ceil(
      totalJoyas / totalJoyaxPage
    )}`;

    const HATEOAS = {
        totalJoyas,
        totalJoyaxPage,
        page,
        paginacion,
        results
    }

    return HATEOAS;
};

//obtener un producto
const getJoya = async (id) => {
  const { rows } = await pool.query("SELECT * FROM inventario WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

//Obtener productos por filtro
const joyasXfiltro = async (querystring) => {
  let filtros = [];
  let values = [];

  //agregamos el filtro para validar los campos
  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push(`${campo} ${comparador} $${length + 1}`);
  };

  //desestructuramos el querystring
  const { category, precio_max, precio_min, stock_max, stock_min, nombre } =
    querystring;

  //verificamos que los campos existan
  if (category) agregarFiltro("category", "ilike", `%${category}%`);
  if (precio_max) agregarFiltro("precio", "<=", precio_max);
  if (precio_min) agregarFiltro("precio", ">=", precio_min);
  if (stock_max) agregarFiltro("stock", "<=", stock_max);
  if (stock_min) agregarFiltro("stock", ">=", stock_min);
  if (nombre) agregarFiltro("nombre", "ilike", `%${nombre}%`);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    consulta += " WHERE " + filtros.join(" AND ");
  }
  const { rows: joyas } = await pool.query(consulta, values);
  return joyas;
};



module.exports = {
  getJoyas,
  getHATEOAS,
  getJoya,
  joyasXfiltro
};