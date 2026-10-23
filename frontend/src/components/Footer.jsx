import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ showMap = true }) {
  return (
    <footer className="pie-pagina">
      <div className="grupo-1">
        {showMap && (
          <div className="box box-map" id="box">
            <h2 className="footer-heading">NUESTRA UBICACIÓN</h2>
            <div className="map-responsive">
              <iframe
                title="Ubicación Muebles Scala"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.2261416445465!2d-70.24243398453983!3d-18.0024377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915ac580986858b3%3A0x98e41ee5dcd6bff!2sMUEBLES%20SCALA!5e0!3m2!1ses!2spe!4v1615384401438"
                width="500"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        <div className="box box-about">
          <h2 className="footer-heading">SOBRE NOSOTROS</h2>
          <p className="about-highlight">
            Especialistas en diseño y fabricación de muebles modernos, duraderos y a la medida.
          </p>
          <p>
            Transformamos tus espacios con elegancia, confort y materiales de la más alta calidad para tu hogar y oficina.
          </p>
        </div>

        <div className="box box-social">
          <h2 className="footer-heading">SÍGUENOS</h2>
          <p className="social-tagline">Conéctate con nosotros en redes sociales y entérate de nuestras novedades y promociones:</p>
          <div className="red-social">
            <a
              href="https://www.facebook.com/MueblesScalaOficial"
              className="social-btn facebook"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Muebles Scala"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/muebleria.scala/"
              className="social-btn instagram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Muebles Scala"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@mueblesscala"
              className="social-btn tiktok"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok de Muebles Scala"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.84a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.87-.27z" />
              </svg>
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=51923254150&text=Hola%2C+estoy+en+su+tienda+virtual+y+tengo+una+duda...&type=phone_number&app_absent=0"
              className="social-btn whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Muebles Scala"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="grupo-2">
        <small>
          &copy; {CURRENT_YEAR} <b>Scala</b> - Todos los Derechos Reservados.
        </small>
      </div>
    </footer>
  );
}
