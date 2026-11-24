CREATE DATABASE IF NOT EXISTS mueblescalabd
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mueblescalabd;

-- 1. ADMINISTRADORES
CREATE TABLE IF NOT EXISTS administradores (
    id_administradores INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR', 'SUPERADMINISTRADOR')
        NOT NULL DEFAULT 'ADMINISTRADOR',
    estado ENUM('ACTIVO', 'INACTIVO')
        NOT NULL DEFAULT 'ACTIVO',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_administradores_usuario UNIQUE (usuario)
) ENGINE = InnoDB;

-- 2. CATEGORÍAS
CREATE TABLE IF NOT EXISTS categorias (
    id_categorias INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    url_imagen VARCHAR(1000) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    slug VARCHAR(150) NOT NULL,

    CONSTRAINT uq_categorias_slug UNIQUE (slug),
    CONSTRAINT chk_categorias_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

-- 3. PERFILES DE MEDIDAS
CREATE TABLE IF NOT EXISTS perfil_medidas (
    id_perfil INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_perfil_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

-- 4. DETALLE DE LOS PERFILES DE MEDIDAS
CREATE TABLE IF NOT EXISTS detalle_perfil_medidas (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_perfil INT UNSIGNED NOT NULL,
    nombre_pieza VARCHAR(150) NOT NULL,
    cantidad INT UNSIGNED NOT NULL DEFAULT 1,
    largo_cm DECIMAL(8,2) NULL,
    ancho_cm DECIMAL(8,2) NULL,
    alto_cm DECIMAL(8,2) NULL,
    orden INT UNSIGNED NOT NULL DEFAULT 1,

    CONSTRAINT fk_detalle_perfil
        FOREIGN KEY (id_perfil)
        REFERENCES perfil_medidas (id_perfil)
        ON DELETE CASCADE,

    CONSTRAINT chk_detalle_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_largo
        CHECK (largo_cm IS NULL OR largo_cm > 0),

    CONSTRAINT chk_detalle_ancho
        CHECK (ancho_cm IS NULL OR ancho_cm > 0),

    CONSTRAINT chk_detalle_alto
        CHECK (alto_cm IS NULL OR alto_cm > 0),

    CONSTRAINT chk_detalle_orden
        CHECK (orden > 0)
) ENGINE = InnoDB;

-- 5. TAPICES
CREATE TABLE IF NOT EXISTS tapices (
    id_tapices INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo_material VARCHAR(100) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    tono VARCHAR(100) NULL,

    CONSTRAINT chk_tapices_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

-- 6. MATERIALES
CREATE TABLE IF NOT EXISTS materiales (
    id_materiales INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL
) ENGINE = InnoDB;

-- 7. MUEBLES
CREATE TABLE IF NOT EXISTS muebles (
    id_muebles INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_categorias INT UNSIGNED NOT NULL,
    id_perfil INT UNSIGNED NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    slug VARCHAR(250) NOT NULL,

    CONSTRAINT uq_muebles_slug UNIQUE (slug),

    CONSTRAINT fk_muebles_categoria
        FOREIGN KEY (id_categorias)
        REFERENCES categorias (id_categorias)
        ON DELETE RESTRICT,

    CONSTRAINT fk_muebles_perfil
        FOREIGN KEY (id_perfil)
        REFERENCES perfil_medidas (id_perfil)
        ON DELETE RESTRICT,

    CONSTRAINT chk_muebles_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_muebles_precio_oferta
        CHECK (
            precio_oferta IS NULL
            OR (precio_oferta >= 0 AND precio_oferta < precio)
        ),

    CONSTRAINT chk_muebles_activo
        CHECK (activo IN (0, 1)),

    CONSTRAINT chk_muebles_destacado
        CHECK (destacado IN (0, 1))
) ENGINE = InnoDB;

-- 8. IMÁGENES DE LOS MUEBLES
CREATE TABLE IF NOT EXISTS imagenes_muebles (
    id_imagenes INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_muebles INT UNSIGNED NOT NULL,
    url_imagen VARCHAR(1000) NOT NULL,
    orden INT UNSIGNED NOT NULL DEFAULT 1,

    CONSTRAINT fk_imagenes_mueble
        FOREIGN KEY (id_muebles)
        REFERENCES muebles (id_muebles)
        ON DELETE CASCADE,

    CONSTRAINT chk_imagenes_orden
        CHECK (orden > 0),

    INDEX idx_imagenes_mueble_orden (id_muebles, orden)
) ENGINE = InnoDB;

-- 9. VARIANTES DE LOS MUEBLES
CREATE TABLE IF NOT EXISTS variantes_muebles (
    id_variantes INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_muebles INT UNSIGNED NOT NULL,
    id_tapices INT UNSIGNED NULL,
    tapiz_clave BIGINT GENERATED ALWAYS AS (IFNULL(id_tapices, -1)) STORED,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    sku VARCHAR(100) NOT NULL,

    CONSTRAINT uq_variantes_sku UNIQUE (sku),
    CONSTRAINT uq_mueble_tapiz UNIQUE (id_muebles, tapiz_clave),

    CONSTRAINT fk_variantes_mueble
        FOREIGN KEY (id_muebles)
        REFERENCES muebles (id_muebles)
        ON DELETE CASCADE,

    CONSTRAINT fk_variantes_tapiz
        FOREIGN KEY (id_tapices)
        REFERENCES tapices (id_tapices)
        ON DELETE RESTRICT
) ENGINE = InnoDB;

-- 10. RELACIÓN ENTRE MUEBLES Y MATERIALES
CREATE TABLE IF NOT EXISTS muebles_materiales (
    id_muebles INT UNSIGNED NOT NULL,
    id_materiales INT UNSIGNED NOT NULL,
    porcentaje DECIMAL(5,2) NULL,

    PRIMARY KEY (id_muebles, id_materiales),

    CONSTRAINT fk_muebles_materiales_mueble
        FOREIGN KEY (id_muebles)
        REFERENCES muebles (id_muebles)
        ON DELETE CASCADE,

    CONSTRAINT fk_muebles_materiales_material
        FOREIGN KEY (id_materiales)
        REFERENCES materiales (id_materiales)
        ON DELETE RESTRICT,

    CONSTRAINT chk_material_porcentaje
        CHECK (porcentaje > 0 AND porcentaje <= 100)
) ENGINE = InnoDB;

-- 11. BANNERS
CREATE TABLE IF NOT EXISTS banner_slider (
    id_banner INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    url_imagen VARCHAR(1000) NOT NULL,
    orden INT UNSIGNED NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_banner_orden CHECK (orden > 0),
    CONSTRAINT chk_banner_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

-- 12. HISTORIAL DE MUEBLES
CREATE TABLE IF NOT EXISTS historial_muebles (
    id_historial INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_muebles INT UNSIGNED NULL,
    id_administradores INT UNSIGNED NULL,
    usuario_admin VARCHAR(100) NOT NULL,
    nombre_mueble VARCHAR(200) NOT NULL,
    accion ENUM('CREAR', 'ACTUALIZAR', 'CAMBIO_ESTADO', 'ELIMINAR') NOT NULL,
    detalles TEXT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historial_mueble
        FOREIGN KEY (id_muebles)
        REFERENCES muebles (id_muebles)
        ON DELETE SET NULL,

    CONSTRAINT fk_historial_admin
        FOREIGN KEY (id_administradores)
        REFERENCES administradores (id_administradores)
        ON DELETE SET NULL
) ENGINE = InnoDB;
