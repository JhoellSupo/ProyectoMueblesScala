import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';

export default function Home({ currentView = 'inicio', user, onLogout, onNavigate }) {
  const getSectionContent = () => {
    switch (currentView) {
      case 'sala':
        return {
          title: 'Sala',
          message: 'Aún no hay muebles que mostrar'
        };
      case 'comedor':
        return {
          title: 'Comedor',
          message: 'Aún no hay muebles que mostrar'
        };
      case 'modulos-tv':
        return {
          title: 'Módulos TV',
          message: 'Aún no hay muebles que mostrar'
        };
      case 'inicio':
      default:
        return {
          title: 'Bienvenido a Scala',
          message: 'Muebles de diseño y confort para tu hogar'
        };
    }
  };

  const { title, message } = getSectionContent();

  return (
    <div className="home-container">
      <Navbar
        user={user}
        onLogout={onLogout}
        onNavigate={onNavigate}
        activeItem={currentView}
      />

      <main className="home-main">
        <h1>{title}</h1>
        <p>{message}</p>
      </main>

      <Footer />
    </div>
  );
}
