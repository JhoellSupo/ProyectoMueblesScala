import { useState, useEffect, useMemo } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import ProductTable from '../components/admin/ProductTable';
import CategoryTable from '../components/admin/CategoryTable';
import ProductModal from '../components/admin/ProductModal';
import CategoryModal from '../components/admin/CategoryModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import './AdminPanel.css';

export default function AdminPanel({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'categorias'

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text: '' }

  // Filtros y búsquedas
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  // Modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    imagen_url: ''
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    nombre: '',
    descripcion: ''
  });

  // Modal de confirmación para eliminar
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mostrar mensaje toast
  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Cargar datos desde servicios
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        productoService.listar(),
        categoriaService.listar()
      ]);
      setProductos(prodData || []);
      setCategorias(catData || []);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Estadísticas KPI
  const stats = useMemo(() => {
    const totalProd = productos.length;
    const activos = productos.filter((p) => p.activo === 1).length;
    const totalCat = categorias.length;
    const precioPromedio =
      totalProd > 0
        ? productos.reduce((acc, p) => acc + Number(p.precio || 0), 0) / totalProd
        : 0;

    return { totalProd, activos, totalCat, precioPromedio };
  }, [productos, categorias]);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch =
        p.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoria?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        categoryFilter === 'todas' ||
        String(p.id_categoria) === String(categoryFilter);

      return matchSearch && matchCat;
    });
  }, [productos, searchQuery, categoryFilter]);

  // Filtrado de categorías
  const filteredCategories = useMemo(() => {
    return categorias.filter((c) =>
      c.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categorias, searchQuery]);

  // --- MANEJADORES DE PRODUCTO ---
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        id_categoria: product.id_categoria || (categorias[0]?.id_categoria || ''),
        imagen_url: product.imagen_url || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        nombre: '',
        descripcion: '',
        precio: '',
        id_categoria: categorias[0]?.id_categoria || '',
        imagen_url: ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.nombre.trim()) {
      showToast('El nombre del producto es obligatorio', 'error');
      return;
    }
    if (!productForm.id_categoria) {
      showToast('Selecciona una categoría', 'error');
      return;
    }
    if (productForm.precio === '' || Number(productForm.precio) < 0) {
      showToast('El precio debe ser un número válido', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = !!editingProduct;
      const payload = {
        ...productForm,
        activo: editingProduct ? editingProduct.activo : 1
      };

      if (isEdit) {
        await productoService.actualizar(editingProduct.id_mueble, payload);
      } else {
        await productoService.crear(payload);
      }

      showToast(isEdit ? 'Producto actualizado correctamente' : 'Producto creado exitosamente');
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleProductStatus = async (product) => {
    const newStatus = product.activo === 1 ? 0 : 1;
    try {
      await productoService.cambiarEstado(product.id_mueble, newStatus);
      showToast(newStatus === 1 ? 'Producto activado' : 'Producto desactivado');
      setProductos((prev) =>
        prev.map((p) => (p.id_mueble === product.id_mueble ? { ...p, activo: newStatus } : p))
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- MANEJADORES DE CATEGORÍA ---
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        nombre: cat.nombre || '',
        descripcion: cat.descripcion || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        nombre: '',
        descripcion: ''
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.nombre.trim()) {
      showToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = !!editingCategory;
      if (isEdit) {
        await categoriaService.actualizar(editingCategory.id_categoria, categoryForm);
      } else {
        await categoriaService.crear(categoryForm);
      }

      showToast(isEdit ? 'Categoría actualizada' : 'Categoría creada con éxito');
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- CONFIRMAR Y EJECUTAR ELIMINACIÓN ---
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);

    try {
      const isProduct = deleteConfirm.type === 'producto';
      if (isProduct) {
        await productoService.eliminar(deleteConfirm.id);
      } else {
        await categoriaService.eliminar(deleteConfirm.id);
      }

      showToast(isProduct ? 'Producto eliminado' : 'Categoría eliminada');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Notificación Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header modular */}
      <AdminHeader
        user={user}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Tarjetas KPI */}
      <StatsCards stats={stats} />

      {/* Selector de pestañas */}
      <div className="admin-nav-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('productos');
            setSearchQuery('');
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Catálogo de Productos ({productos.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'categorias' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('categorias');
            setSearchQuery('');
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span>Gestión de Categorías ({categorias.length})</span>
        </button>
      </div>

      {/* Contenido según pestaña */}
      <main className="admin-content-area">
        {activeTab === 'productos' && (
          <ProductTable
            products={filteredProducts}
            categories={categorias}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            loading={loading}
            onNewProduct={() => handleOpenProductModal()}
            onEditProduct={handleOpenProductModal}
            onToggleStatus={handleToggleProductStatus}
            onDeleteProduct={setDeleteConfirm}
          />
        )}

        {activeTab === 'categorias' && (
          <CategoryTable
            categories={filteredCategories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
            onNewCategory={() => handleOpenCategoryModal()}
            onEditCategory={handleOpenCategoryModal}
            onDeleteCategory={setDeleteConfirm}
          />
        )}
      </main>

      {/* Modales */}
      <ProductModal
        isOpen={isProductModalOpen}
        editingProduct={editingProduct}
        categories={categorias}
        formData={productForm}
        onChange={setProductForm}
        onSubmit={handleSaveProduct}
        onClose={() => setIsProductModalOpen(false)}
        isSubmitting={isSubmitting}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        editingCategory={editingCategory}
        formData={categoryForm}
        onChange={setCategoryForm}
        onSubmit={handleSaveCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        confirmData={deleteConfirm}
        onConfirm={handleExecuteDelete}
        onClose={() => setDeleteConfirm(null)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
