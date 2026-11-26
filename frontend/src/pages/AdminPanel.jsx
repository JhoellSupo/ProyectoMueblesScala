import { useState, useEffect, useMemo } from 'react';
import { productoService } from '../services/productoService';
import { categoriaService } from '../services/categoriaService';
import { sliderService } from '../services/sliderService';
import { adminService } from '../services/adminService';
import { historialService } from '../services/historialService';
import { uploadImage } from '../services/apiClient';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import ProductTable from '../components/admin/ProductTable';
import CategoryTable from '../components/admin/CategoryTable';
import SliderTable from '../components/admin/SliderTable';
import HistoryTable from '../components/admin/HistoryTable';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import ProductModal from '../components/admin/ProductModal';
import CategoryModal from '../components/admin/CategoryModal';
import SliderModal from '../components/admin/SliderModal';
import AdminUserModal from '../components/admin/AdminUserModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import './AdminPanel.css';

// Función para normalizar texto eliminando tildes, diacríticos y pasando a minúsculas
const normalizeText = (text = '') =>
  (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function AdminPanel({ user, onLogout, onNavigate }) {
  const isSuperAdmin = user?.rol === 'superadmin' || user?.nombre === 'superadmin';
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      if (window.location.search.includes('tab=historial')) return 'historial';
      if (window.location.search.includes('tab=admins')) return 'admins';
      if (window.location.search.includes('tab=categorias')) return 'categorias';
      if (window.location.search.includes('tab=slider')) return 'slider';
    }
    return 'productos';
  }); // 'productos' | 'categorias' | 'slider' | 'historial' | 'admins'

  // Estados de datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanners] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [admins, setAdmins] = useState([]);
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
    precio_oferta: '',
    largo_cm: '',
    ancho_cm: '',
    alto_cm: '',
    id_categoria: '',
    imagen_url: '',
    imageFile: null,
    imagePreview: '',
    fileName: ''
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    nombre: '',
    descripcion: '',
    imagen_url: ''
  });

  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [sliderForm, setSliderForm] = useState({
    titulo: '',
    imagen_url: '',
    imageFile: null,
    imagePreview: '',
    fileName: '',
    orden: 0
  });

  // Modal para nuevo administrador (solo superadmin)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    nombre: '',
    usuario: '',
    correo: '',
    password: '',
    rol: 'admin'
  });

  // Modal de confirmación para eliminar
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mostrar mensaje toast
  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Cargar datos del historial
  const fetchHistorial = async () => {
    try {
      const data = await historialService.listar();
      setHistorial(data || []);
    } catch (err) {
      console.warn('Error al cargar historial:', err.message);
    }
  };

  // Cargar lista de administradores
  const fetchAdmins = async () => {
    try {
      const data = await adminService.listar();
      setAdmins(data || []);
    } catch (err) {
      console.warn('Error al cargar administradores:', err.message);
    }
  };

  // Cargar datos generales desde servicios
  const fetchData = async () => {
    setLoading(true);
    try {
      const promises = [
        productoService.listar(),
        categoriaService.listar(),
        sliderService.listar()
      ];

      if (isSuperAdmin) {
        promises.push(historialService.listar());
        promises.push(adminService.listar());
      }

      const results = await Promise.all(promises);
      setProductos(results[0] || []);
      setCategorias(results[1] || []);
      setBanners(results[2] || []);

      if (isSuperAdmin) {
        setHistorial(results[3] || []);
        setAdmins(results[4] || []);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error al conectar con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isSuperAdmin]);

  // Estadísticas KPI
  const stats = useMemo(() => {
    const totalProd = productos.length;
    const activos = productos.filter((p) => p.activo === 1).length;
    const totalCat = categorias.length;
    return { totalProd, activos, totalCat };
  }, [productos, categorias]);

  // Filtrado de productos (insensible a tildes, mayúsculas y acentos)
  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);
    return productos.filter((p) => {
      const matchSearch =
        !query ||
        normalizeText(p.nombre).includes(query) ||
        normalizeText(p.descripcion).includes(query) ||
        normalizeText(p.categoria).includes(query);

      const matchCat =
        categoryFilter === 'todas' ||
        String(p.id_categoria) === String(categoryFilter);

      return matchSearch && matchCat;
    });
  }, [productos, searchQuery, categoryFilter]);

  // Filtrado de categorías (insensible a tildes, mayúsculas y acentos)
  const filteredCategories = useMemo(() => {
    const query = normalizeText(searchQuery);
    return categorias.filter((c) =>
      !query ||
      normalizeText(c.nombre).includes(query) ||
      normalizeText(c.descripcion).includes(query)
    );
  }, [categorias, searchQuery]);

  // Filtrado de banners del slider
  const filteredBanners = useMemo(() => {
    const query = normalizeText(searchQuery);
    return banners.filter((b) =>
      !query ||
      normalizeText(b.titulo).includes(query)
    );
  }, [banners, searchQuery]);

  const closeAllFullPageForms = () => {
    setIsProductModalOpen(false);
    setIsCategoryModalOpen(false);
    setIsSliderModalOpen(false);
  };

  const isFullPageFormOpen =
    isProductModalOpen || isCategoryModalOpen || isSliderModalOpen;

  // --- MANEJADORES DE PRODUCTO ---
  const handleOpenProductModal = (product = null) => {
    closeAllFullPageForms();
    setActiveTab('productos');
    if (product) {
      setEditingProduct(product);
      setProductForm({
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        precio_oferta: product.precio_oferta || '',
        largo_cm: product.largo_cm ? parseFloat(product.largo_cm) : '',
        ancho_cm: product.ancho_cm ? parseFloat(product.ancho_cm) : '',
        alto_cm: product.alto_cm ? parseFloat(product.alto_cm) : '',
        id_categoria: product.id_categoria || product.id_categorias || (categorias[0]?.id_categoria || ''),
        imagen_url: product.imagen_url || product.url_imagen || '',
        imageFile: null,
        imagePreview: product.imagen_url || product.url_imagen || '',
        fileName: ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        nombre: '',
        descripcion: '',
        precio: '',
        precio_oferta: '',
        largo_cm: '',
        ancho_cm: '',
        alto_cm: '',
        id_categoria: categorias[0]?.id_categoria || '',
        imagen_url: '',
        imageFile: null,
        imagePreview: '',
        fileName: ''
      });
    }
    setIsProductModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      let finalImageUrl = productForm.imagen_url || '';

      // Si el usuario seleccionó un archivo nuevo, subirlo al servidor primero
      if (productForm.imageFile) {
        finalImageUrl = await uploadImage(productForm.imageFile);
      }

      const isEdit = !!editingProduct;
      const payload = {
        nombre: productForm.nombre.trim(),
        descripcion: productForm.descripcion?.trim() || '',
        precio: Number(productForm.precio),
        precio_oferta: productForm.precio_oferta ? Number(productForm.precio_oferta) : null,
        largo_cm: productForm.largo_cm ? Number(productForm.largo_cm) : null,
        ancho_cm: productForm.ancho_cm ? Number(productForm.ancho_cm) : null,
        alto_cm: productForm.alto_cm ? Number(productForm.alto_cm) : null,
        id_categoria: productForm.id_categoria,
        imagen_url: finalImageUrl,
        url_imagen: finalImageUrl,
        activo: editingProduct ? editingProduct.activo : 1
      };

      if (isEdit) {
        await productoService.actualizar(editingProduct.id_muebles || editingProduct.id_mueble, payload);
      } else {
        await productoService.crear(payload);
      }

      showToast(isEdit ? 'Mueble actualizado con su foto' : 'Mueble creado con su foto exitosamente');
      setIsProductModalOpen(false);
      fetchData();
      if (isSuperAdmin) fetchHistorial();
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
      if (isSuperAdmin) fetchHistorial();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- MANEJADORES DE CATEGORÍA ---
  const handleOpenCategoryModal = (cat = null) => {
    closeAllFullPageForms();
    setActiveTab('categorias');
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        nombre: cat.nombre || '',
        descripcion: cat.descripcion || '',
        imagen_url: cat.imagen_url || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        nombre: '',
        descripcion: '',
        imagen_url: ''
      });
    }
    setIsCategoryModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      showToast(isEdit ? 'Categoría actualizada' : 'Categoría creada exitosamente');
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MANEJADORES DEL SLIDER ---
  const handleOpenSliderModal = (banner = null) => {
    closeAllFullPageForms();
    setActiveTab('slider');
    if (banner) {
      setEditingBanner(banner);
      setSliderForm({
        titulo: banner.titulo || '',
        imagen_url: banner.imagen_url || banner.url_imagen || '',
        imageFile: null,
        imagePreview: '',
        fileName: '',
        orden: banner.orden || 0
      });
    } else {
      setEditingBanner(null);
      setSliderForm({
        titulo: '',
        imagen_url: '',
        imageFile: null,
        imagePreview: '',
        fileName: '',
        orden: (banners.length + 1)
      });
    }
    setIsSliderModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!editingBanner && !sliderForm.imageFile && !sliderForm.imagen_url) {
      showToast('Debes seleccionar una foto para el slider', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = sliderForm.imagen_url || '';

      // Si el usuario seleccionó un archivo nuevo, subirlo al servidor primero
      if (sliderForm.imageFile) {
        finalImageUrl = await uploadImage(sliderForm.imageFile);
      }

      if (!finalImageUrl) {
        showToast('No se pudo procesar la foto seleccionada', 'error');
        setIsSubmitting(false);
        return;
      }

      const isEdit = !!editingBanner;
      const payload = {
        titulo: sliderForm.titulo?.trim() || 'Foto Slider Scala',
        imagen_url: finalImageUrl,
        url_imagen: finalImageUrl,
        orden: Number(sliderForm.orden) || 1
      };

      if (isEdit) {
        await sliderService.actualizar(editingBanner.id_banner, payload);
      } else {
        await sliderService.crear(payload);
      }

      showToast(isEdit ? 'Foto del slider actualizada' : 'Nueva foto guardada en el slider');
      setIsSliderModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBannerStatus = async (banner) => {
    const newStatus = banner.activo === 1 ? 0 : 1;
    try {
      await sliderService.cambiarEstado(banner.id_banner, newStatus);
      showToast(newStatus === 1 ? 'Imagen visible en slider' : 'Imagen ocultada del slider');
      setBanners((prev) =>
        prev.map((b) => (b.id_banner === banner.id_banner ? { ...b, activo: newStatus } : b))
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- MANEJADORES DE SUPERADMIN: ADMINISTRADORES ---
  const handleOpenAdminModal = () => {
    setAdminForm({
      nombre: '',
      usuario: '',
      correo: '',
      password: '',
      rol: 'admin'
    });
    setIsAdminModalOpen(true);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.crear({
        ...adminForm,
        usuario: (adminForm.usuario || adminForm.correo || '').trim()
      });
      showToast('Nuevo administrador creado correctamente');
      setIsAdminModalOpen(false);
      fetchAdmins();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAdminStatus = async (adm) => {
    const newStatus = adm.activo === 1 ? 0 : 1;
    try {
      await adminService.cambiarEstado(adm.id_admin, newStatus);
      showToast(newStatus === 1 ? 'Administrador activado' : 'Administrador desactivado');
      setAdmins((prev) =>
        prev.map((a) => (a.id_admin === adm.id_admin ? { ...a, activo: newStatus } : a))
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- CONFIRMAR Y EJECUTAR ELIMINACIÓN ---
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);

    try {
      if (deleteConfirm.type === 'producto') {
        await productoService.eliminar(deleteConfirm.id);
        showToast('Producto eliminado');
        if (isSuperAdmin) fetchHistorial();
      } else if (deleteConfirm.type === 'categoria') {
        await categoriaService.eliminar(deleteConfirm.id);
        showToast('Categoría eliminada');
      } else if (deleteConfirm.type === 'administrador') {
        await adminService.eliminar(deleteConfirm.id);
        showToast('Administrador eliminado');
        fetchAdmins();
      } else {
        await sliderService.eliminar(deleteConfirm.id);
        showToast('Imagen del slider eliminada');
      }

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

      {/* Vista principal: Formulario de página completa o Dashboard con barra lateral */}
      {isFullPageFormOpen ? (
        <main className="admin-fullpage-view">
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

          <SliderModal
            isOpen={isSliderModalOpen}
            editingBanner={editingBanner}
            formData={sliderForm}
            onChange={setSliderForm}
            onSubmit={handleSaveBanner}
            onClose={() => setIsSliderModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </main>
      ) : (
        <div className="admin-dashboard-layout">
        {/* Barra lateral de navegación (Sidebar izquierdo) */}
        <aside className="admin-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-group-title">Módulos del Sistema</span>
            <nav className="sidebar-nav">
              <button
                type="button"
                className={`sidebar-nav-btn ${activeTab === 'productos' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('productos');
                  setSearchQuery('');
                }}
              >
                <div className="nav-btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="nav-btn-content">
                  <span className="nav-btn-label">Catálogo Muebles</span>
                  <span className="nav-btn-badge">{productos.length}</span>
                </div>
              </button>

              <button
                type="button"
                className={`sidebar-nav-btn ${activeTab === 'categorias' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('categorias');
                  setSearchQuery('');
                }}
              >
                <div className="nav-btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div className="nav-btn-content">
                  <span className="nav-btn-label">Gestión Categorías</span>
                  <span className="nav-btn-badge">{categorias.length}</span>
                </div>
              </button>

              <button
                type="button"
                className={`sidebar-nav-btn ${activeTab === 'slider' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('slider');
                  setSearchQuery('');
                }}
              >
                <div className="nav-btn-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="nav-btn-content">
                  <span className="nav-btn-label">Imágenes Slider</span>
                  <span className="nav-btn-badge">{banners.length}</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Módulos exclusivos para Superadministrador */}
          {isSuperAdmin && (
            <div className="sidebar-group superadmin-section">
              <span className="sidebar-group-title super-title">
                👑 Superadministrador
              </span>
              <nav className="sidebar-nav">
                <button
                  type="button"
                  className={`sidebar-nav-btn super-nav-btn ${activeTab === 'historial' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('historial');
                    setSearchQuery('');
                    fetchHistorial();
                  }}
                >
                  <div className="nav-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="nav-btn-content">
                    <span className="nav-btn-label">Historial Modificaciones</span>
                    <span className="nav-btn-badge super">{historial.length}</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-btn super-nav-btn ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('admins');
                    setSearchQuery('');
                    fetchAdmins();
                  }}
                >
                  <div className="nav-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="nav-btn-content">
                    <span className="nav-btn-label">Administradores</span>
                    <span className="nav-btn-badge super">{admins.length}</span>
                  </div>
                </button>
              </nav>
            </div>
          )}

          <div className="sidebar-group sidebar-quick-actions">
            <span className="sidebar-group-title">Acciones Rápidas</span>
            <button
              type="button"
              className="btn-sidebar-action"
              onClick={() => handleOpenProductModal()}
            >
              + Nuevo Mueble
            </button>
            <button
              type="button"
              className="btn-sidebar-action secondary"
              onClick={() => handleOpenCategoryModal()}
            >
              + Nueva Categoría
            </button>
            <button
              type="button"
              className="btn-sidebar-action secondary"
              onClick={() => handleOpenSliderModal()}
            >
              + Imagen Slider
            </button>

            {isSuperAdmin && (
              <button
                type="button"
                className="btn-sidebar-action super-action"
                onClick={handleOpenAdminModal}
              >
                + Nuevo Administrador
              </button>
            )}
          </div>
        </aside>

        {/* Contenedor derecho: Métricas y Tablas */}
        <div className="admin-main-container">
          {/* Tarjetas KPI */}
          <StatsCards stats={stats} />

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

            {activeTab === 'slider' && (
              <SliderTable
                banners={filteredBanners}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                loading={loading}
                onNewBanner={() => handleOpenSliderModal()}
                onEditBanner={handleOpenSliderModal}
                onToggleStatus={handleToggleBannerStatus}
                onDeleteBanner={setDeleteConfirm}
              />
            )}

            {/* Módulos solo visibles si es superadmin */}
            {activeTab === 'historial' && isSuperAdmin && (
              <HistoryTable
                history={historial}
                loading={loading}
                onRefresh={fetchHistorial}
              />
            )}

            {activeTab === 'admins' && isSuperAdmin && (
              <AdminUsersTable
                admins={admins}
                loading={loading}
                currentUser={user}
                onNewAdmin={handleOpenAdminModal}
                onToggleStatus={handleToggleAdminStatus}
                onDeleteAdmin={(adm) =>
                  setDeleteConfirm({
                    type: 'administrador',
                    id: adm.id_admin,
                    name: adm.nombre
                  })
                }
              />
            )}
          </main>
        </div>
      </div>
      )}

      {/* Modales pequeños de confirmación y usuario */}
      {isSuperAdmin && (
        <AdminUserModal
          isOpen={isAdminModalOpen}
          formData={adminForm}
          onChange={setAdminForm}
          onSubmit={handleSaveAdmin}
          onClose={() => setIsAdminModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <DeleteConfirmModal
        confirmData={deleteConfirm}
        onConfirm={handleExecuteDelete}
        onClose={() => setDeleteConfirm(null)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
