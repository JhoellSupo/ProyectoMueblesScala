import Navbar from './Navbar';
import Footer from './Footer';
import './Home.css';

export default function Home({ user, onLogout, onNavigate }) {
  return (
    <div className="home-container">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="home-main">
        <h1>Bienvenido a Scala</h1>
        <p>Muebles de diseño y confort para tu hogar</p>
      </main>

      <Footer />
    </div>
  );
}
