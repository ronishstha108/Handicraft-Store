// frontend/src/components/SiteHeader.jsx
function SiteHeader({
  cartCount = 0,
  isStore = false,
  onHome,
  onLogin,
  onSignup,
  onLogout,
}) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <button className="brand" onClick={onHome}>
        <span>H</span>
        Handicraft Store
      </button>

      {!isStore && (
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#top">Home</a>
          <a href="#about">About Us</a>
          <a href="#featured">Featured</a>  {/* Changed from Collections to Featured */}
          <a href="#contact">Contact</a>
        </nav>
      )}

      <div className="header-actions">
        {isStore && <span className="cart-pill">Cart {cartCount}</span>}
        {isStore ? (
          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="secondary-button" onClick={onLogin}>
              Login
            </button>
            <button className="primary-button" onClick={onSignup}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;