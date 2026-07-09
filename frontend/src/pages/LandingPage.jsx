// frontend/src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

const categories = [
  { name: "Basketry", icon: "🧺", description: "Handwoven baskets for every purpose" },
  { name: "Ceramics", icon: "🏺", description: "Beautiful pottery and ceramic art" },
  { name: "Textiles", icon: "🧵", description: "Soft fabrics and woven textiles" },
  { name: "Woodcraft", icon: "🪵", description: "Carved wooden masterpieces" },
  { name: "Wall Decor", icon: "🖼️", description: "Art pieces for your walls" },
  { name: "Tableware", icon: "🍽️", description: "Elegant dining essentials" },
];

function LandingPage() {
  const navigate = useNavigate();

  const handleExploreStore = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/shop");
    } else {
      navigate("/auth");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleSignup = () => {
    navigate("/auth");
  };

  const handleAdmin = () => {
    navigate("/admin/login");
  };

  return (
    <main className="site-shell" id="top">
      <SiteHeader
        cartCount={0}
        onHome={() => navigate("/")}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {/* Hero Section */}
      <section style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        padding: "60px 20px"
      }}>
        <div style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50%",
          height: "70%",
          background: "radial-gradient(circle, rgba(184, 92, 56, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "40%",
          height: "50%",
          background: "radial-gradient(circle, rgba(216, 165, 64, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}></div>

        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          width: "100%",
          position: "relative",
          zIndex: 1
        }}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px"
            }}>
              <span style={{
                display: "inline-block",
                background: "#b85c38",
                color: "white",
                padding: "6px 18px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}>
                🎨 Handicraft Collection
              </span>
            </div>
            
            <h1 style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              color: "#241913",
              margin: "0 0 20px",
              fontFamily: "Georgia, serif",
              lineHeight: "1.05",
              letterSpacing: "-0.02em"
            }}>
              Handmade <br />
              <span style={{ color: "#b85c38" }}>with Love</span>
            </h1>
            
            <p style={{
              fontSize: "1.15rem",
              color: "#4c4039",
              maxWidth: "480px",
              margin: "0 0 32px",
              lineHeight: "1.8"
            }}>
              Discover unique, handcrafted pieces made by skilled artisans. 
              Each product tells a story of tradition, patience, and passion.
            </p>
            
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button 
                className="primary-button" 
                onClick={handleExploreStore}
                style={{
                  padding: "14px 36px",
                  fontSize: "1.05rem",
                  boxShadow: "0 8px 30px rgba(184, 92, 56, 0.35)",
                  cursor: "pointer"
                }}
              >
                Explore Store →
              </button>
              <button 
                className="secondary-button" 
                onClick={handleLogin}
                style={{
                  padding: "14px 28px",
                  fontSize: "1.05rem",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
            </div>

            <div style={{
              display: "flex",
              gap: "30px",
              marginTop: "40px",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>✨</span>
                <span style={{ fontSize: "0.9rem", color: "#4c4039" }}>100% Handmade</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>🌿</span>
                <span style={{ fontSize: "0.9rem", color: "#4c4039" }}>Eco-Friendly</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>💝</span>
                <span style={{ fontSize: "0.9rem", color: "#4c4039" }}>Support Artisans</span>
              </div>
            </div>
          </div>

          <div style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "1/1.1",
              borderRadius: "30px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(36, 25, 19, 0.15)"
            }}>
              <img
                src="https://images.pexels.com/photos/6265333/pexels-photo-6265333.jpeg"
                alt="Handmade craft products"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        padding: "60px 10px",
        background: "white"
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center"
        }}>
          <div>
            <span style={{
              display: "inline-block",
              background: "#f6eadb",
              color: "#b85c38",
              padding: "6px 18px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              About Us
            </span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              color: "#241913",
              margin: "0 0 16px",
              fontFamily: "Georgia, serif",
              lineHeight: "1.1"
            }}>
              Where Tradition <br />Meets <span style={{ color: "#b85c38" }}>Modern Design</span>
            </h2>
            <p style={{
              color: "#4c4039",
              lineHeight: "1.8",
              fontSize: "1rem",
              marginBottom: "20px"
            }}>
              Handicraft Store brings together talented artisans and conscious consumers. 
              We believe in preserving traditional crafts while making them accessible to 
              modern homes.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "20px"
            }}>
              <div style={{
                padding: "16px",
                background: "#f9f6f0",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎯</div>
                <div style={{ fontWeight: "bold", color: "#241913", fontSize: "0.95rem" }}>Mission</div>
                <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Empower artisans</div>
              </div>
              <div style={{
                padding: "16px",
                background: "#f9f6f0",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "24px", marginBottom: "4px" }}>💎</div>
                <div style={{ fontWeight: "bold", color: "#241913", fontSize: "0.95rem" }}>Quality</div>
                <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Premium craftsmanship</div>
              </div>
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f6eadb, #e8d5c4)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>👩‍🎨</div>
              <div style={{ fontWeight: "bold", color: "#241913", fontSize: "1.2rem" }}>50+</div>
              <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Artisans</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #e8f3ef, #d4e6df)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>🌍</div>
              <div style={{ fontWeight: "bold", color: "#241913", fontSize: "1.2rem" }}>100%</div>
              <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Sustainable</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #fff8e7, #fcefd6)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>⭐</div>
              <div style={{ fontWeight: "bold", color: "#241913", fontSize: "1.2rem" }}>4.9★</div>
              <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Customer Rating</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #f3e8ff, #e8d6f5)",
              borderRadius: "16px",
              padding: "24px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "6px" }}>🎁</div>
              <div style={{ fontWeight: "bold", color: "#241913", fontSize: "1.2rem" }}>500+</div>
              <div style={{ fontSize: "0.8rem", color: "#71635b" }}>Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" style={{
        padding: "60px 10px",
        background: "#faf7f2"
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <span style={{
                display: "inline-block",
                background: "#b85c38",
                color: "white",
                padding: "6px 18px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: "bold",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}>
                Collections
              </span>
              <h2 style={{
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                color: "#241913",
                margin: 0,
                fontFamily: "Georgia, serif"
              }}>
                Shop by <span style={{ color: "#b85c38" }}>Craft</span>
              </h2>
            </div>
            <button 
              onClick={handleExploreStore}
              style={{
                padding: "10px 24px",
                background: "white",
                border: "2px solid #b85c38",
                borderRadius: "999px",
                fontWeight: "bold",
                color: "#b85c38",
                cursor: "pointer",
                fontSize: "0.95rem"
              }}
            >
              View All →
            </button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px"
          }}>
            {categories.map((category) => (
              <article key={category.name} style={{
                background: "white",
                borderRadius: "16px",
                padding: "28px 20px",
                border: "1px solid rgba(36, 25, 19, 0.06)",
                cursor: "pointer",
                textAlign: "center"
              }}
              onClick={handleExploreStore}
              >
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#f6eadb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 14px"
                }}>
                  {category.icon}
                </div>
                <h3 style={{
                  margin: "0 0 6px",
                  fontSize: "1.1rem",
                  color: "#241913"
                }}>
                  {category.name}
                </h3>
                <p style={{
                  margin: 0,
                  color: "#71635b",
                  fontSize: "0.9rem",
                  lineHeight: "1.5"
                }}>
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{
        padding: "60px 10px",
        background: "white"
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "40px"
          }}>
            <span style={{
              display: "inline-block",
              background: "#f6eadb",
              color: "#b85c38",
              padding: "6px 18px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Why Choose Us
            </span>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              color: "#241913",
              margin: 0,
              fontFamily: "Georgia, serif"
            }}>
              Quality You Can <span style={{ color: "#b85c38" }}>Trust</span>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px"
          }}>
            {[
              { icon: "🛡️", title: "Authentic Handmade", desc: "Every product is carefully crafted by skilled artisans" },
              { icon: "🌱", title: "Eco-Friendly", desc: "Sustainable materials and ethical production practices" },
              { icon: "🚀", title: "Fast Delivery", desc: "Quick shipping with careful packaging for your items" },
              { icon: "💬", title: "24/7 Support", desc: "Dedicated customer service to help you anytime" }
            ].map((item) => (
              <div key={item.title} style={{
                textAlign: "center",
                padding: "28px 20px",
                background: "#f9f6f0",
                borderRadius: "16px"
              }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>{item.icon}</div>
                <h3 style={{ margin: "0 0 6px", color: "#241913", fontSize: "1.05rem" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "#71635b", lineHeight: "1.6", fontSize: "0.9rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        padding: "60px 10px",
        background: "linear-gradient(135deg, #1a100c 0%, #2d1a12 40%, #3d2a1e 100%)",
        color: "white",
        borderTop: "3px solid #b85c38"
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <span style={{
            display: "inline-block",
            background: "rgba(184, 92, 56, 0.3)",
            color: "#d8a540",
            padding: "6px 18px",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "16px",
            border: "1px solid rgba(184, 92, 56, 0.2)"
          }}>
            Get In Touch
          </span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            margin: "0 0 12px",
            fontFamily: "Georgia, serif",
            color: "#f6eadb"
          }}>
            Have Questions? <br />We'd Love to <span style={{ color: "#d8a540" }}>Hear From You</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            maxWidth: "560px",
            margin: "0 auto 32px",
            fontSize: "1rem",
            lineHeight: "1.8"
          }}>
            Whether you have questions about our products, custom orders, or just want to say hello - we're here for you.
          </p>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              padding: "24px 16px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>📧</div>
              <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#f6eadb", fontSize: "0.95rem" }}>Email</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>hello@handicraftstore.com</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              padding: "24px 16px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>📞</div>
              <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#f6eadb", fontSize: "0.95rem" }}>Phone</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>+977 9810160362</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              padding: "24px 16px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "6px" }}>🎨</div>
              <div style={{ fontWeight: "bold", marginBottom: "4px", color: "#f6eadb", fontSize: "0.95rem" }}>Custom Orders</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>We love custom requests</div>
            </div>
          </div>

          <div style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)"
          }}>
            <p style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.85rem",
              margin: 0
            }}>
              © 2025 Handicraft Store. All rights reserved. Made with ❤️ by Ronish
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;