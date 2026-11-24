export const marcaController = {
  // GET /api/marcas
  async listar(req, res) {
    res.json({
      success: true,
      data: [{ id_marca: 1, nombre: 'Scala', descripcion: 'Marca oficial Muebles Scala' }]
    });
  },

  // GET /api/marcas/:id
  async obtenerPorId(req, res) {
    res.json({
      success: true,
      data: { id_marca: 1, nombre: 'Scala', descripcion: 'Marca oficial Muebles Scala' }
    });
  },

  // POST /api/marcas
  async crear(req, res) {
    res.status(201).json({
      success: true,
      data: { id_marca: 1, nombre: 'Scala' }
    });
  }
};
