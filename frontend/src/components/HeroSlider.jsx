import { useState, useEffect, useRef } from 'react';
import { sliderService } from '../services/sliderService';
import './HeroSlider.css';

const DEFAULT_SLIDES = [
  {
    id_banner: 1,
    imagen_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80',
    titulo: 'Colección de Sala Scala'
  },
  {
    id_banner: 2,
    imagen_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
    titulo: 'Juegos de Comedor Modernos'
  },
  {
    id_banner: 3,
    imagen_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80',
    titulo: 'Centros de Entretenimiento y Módulos TV'
  }
];

export default function HeroSlider() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = useRef(null);

  // Cargar banners dinámicos desde la base de datos
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await sliderService.listar({ soloActivos: 1 });
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error('Error al cargar banners del slider:', err);
      }
    };
    fetchBanners();
  }, []);

  const total = slides.length;

  const nextSlide = () => {
    if (total === 0) return;
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total === 0) return;
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  // Cambio automático cada 5 segundos
  useEffect(() => {
    if (!isPaused && total > 1) {
      slideInterval.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [isPaused, currentSlide, total]);

  return (
    <section
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Galería de fotos de muebles Scala"
    >
      <div className="slider-track">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id_banner || index}
              className={`slide-item ${isActive ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.imagen_url})` }}
              role="img"
              aria-label={slide.titulo || 'Foto Muebles Scala'}
            />
          );
        })}
      </div>

      {/* Flecha Anterior */}
      {total > 1 && (
        <button
          type="button"
          className="slider-arrow prev"
          onClick={prevSlide}
          aria-label="Foto anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Flecha Siguiente */}
      {total > 1 && (
        <button
          type="button"
          className="slider-arrow next"
          onClick={nextSlide}
          aria-label="Foto siguiente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Puntos Indicadores */}
      {total > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ver foto ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
