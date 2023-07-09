const express = require('express');

const router = express.Router();

const { getJoyas, getHATEOAS, getJoya, joyasXfiltro } = require('../consultas/consultas');
const mostrarConsulta = require('../middleware/middleware');

router.get('/', mostrarConsulta, (req, res) => {
    res.send('Holaa mundo desde ROUTER');
})

router.get("/joyas", mostrarConsulta, async (req, res) => {
  try {
    const consultas = req.query;
    page = +req.query.page || 1;
    const joyas = await getJoyas(consultas);
    const HATEOAS = getHATEOAS(joyas, page);
    res.json(HATEOAS);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/joyas/joya/:id", mostrarConsulta, async (req, res) => {
  try {
    const id = req.params.id;
    const joya = await getJoya(id);
    res.json(joya);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/joyas/filtros", mostrarConsulta, async (req, res) => {
  try {
    const consultas = req.query;
    const joyas = await joyasXfiltro(consultas);
    res.json(joyas);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router