// frontend/src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../App.css";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Login flow - store token and redirect
        const response = await authService.login(formData.email, formData.password);
        console.log("📡 Login response:", response);
        
        if (response && response.token) {
          const user = response.user;
          
          // Store auth data
          authService.storeAuthData(response.token, user);
          
          // Check if admin
          if (user?.role === "admin") {
            localStorage.setItem("adminToken", "admin_authenticated");
            navigate("/admin");
          } else {
            navigate("/shop");
          }
        } else {
          setError("Login failed: No token received");
        }
      } else {
        // SIGNUP FLOW - Don't auto-login, just redirect to login page
        const userData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          address: formData.address,
        };
        
        console.log("📝 Registering user:", userData.email);
        const response = await authService.register(userData);
        console.log("📡 Register response:", response);
        
        if (response && response.token) {
          // Clear any existing tokens (don't auto-login)
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
          // Show success message
          setSuccessMessage("✅ Account created successfully! Please login.");
          
          // Clear form
          setFormData({
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            phone: "",
            gender: "",
            date_of_birth: "",
            address: "",
          });
          
          // Switch to login mode after 2 seconds
          setTimeout(() => {
            setMode("login");
            setSuccessMessage("");
          }, 2000);
        }
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
      setError(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f6eadb 0%, #e8d5c4 50%, #faf7f2 100%)",
      padding: "20px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background elements */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "50%",
        height: "60%",
        background: "radial-gradient(circle, rgba(184, 92, 56, 0.06) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "50%",
        height: "60%",
        background: "radial-gradient(circle, rgba(216, 165, 64, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }}></div>

      <div style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(20px)",
        borderRadius: "30px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 30px 80px rgba(36, 25, 19, 0.12)",
        position: "relative",
        zIndex: 1,
        border: "1px solid rgba(255,255,255,0.5)"
      }}>
        {/* Logo/Brand */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #b85c38, #8d3f25)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px",
            boxShadow: "0 8px 30px rgba(184, 92, 56, 0.3)"
          }}>
            🏺
          </div>
          <h1 style={{
            margin: 0,
            color: "#241913",
            fontSize: "1.8rem",
            fontFamily: "Georgia, serif"
          }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{
            margin: "6px 0 0",
            color: "#71635b",
            fontSize: "0.95rem"
          }}>
            {mode === "login" 
              ? "Sign in to continue shopping" 
              : "Join our artisan community"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            padding: "12px 16px",
            background: "#e8f3ef",
            borderRadius: "12px",
            color: "#2f5140",
            marginBottom: "20px",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>✅</span>
            {successMessage}
          </div>
        )}

        {/* Mode Toggle */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "28px",
          padding: "6px",
          background: "#f5f0eb",
          borderRadius: "16px"
        }}>
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setSuccessMessage("");
            }}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: mode === "login" ? "#b85c38" : "transparent",
              color: mode === "login" ? "white" : "#71635b",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
              setSuccessMessage("");
            }}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "12px",
              background: mode === "signup" ? "#b85c38" : "transparent",
              color: mode === "signup" ? "white" : "#71635b",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            background: "#ffe8df",
            borderRadius: "12px",
            color: "#8d261a",
            marginBottom: "20px",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px"
              }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#4c4039",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e8e0d8",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "white",
                      outline: "none"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#b85c38";
                      e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8e0d8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    color: "#4c4039",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e8e0d8",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "white",
                      outline: "none"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#b85c38";
                      e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8e0d8";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#4c4039",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e8e0d8",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#b85c38";
                    e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e8e0d8";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#4c4039",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e8e0d8",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#b85c38";
                    e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e8e0d8";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#4c4039",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e8e0d8",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#b85c38";
                    e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e8e0d8";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#4c4039",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e8e0d8",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    background: "white",
                    outline: "none"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#b85c38";
                    e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e8e0d8";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              color: "#4c4039",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e8e0d8",
                borderRadius: "12px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                background: "white",
                outline: "none"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#b85c38";
                e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e8e0d8";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              color: "#4c4039",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Min 6 characters"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e8e0d8",
                borderRadius: "12px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                background: "white",
                outline: "none"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#b85c38";
                e.target.style.boxShadow = "0 0 0 4px rgba(184, 92, 56, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e8e0d8";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #b85c38, #8d3f25)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.05rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
              boxShadow: "0 8px 30px rgba(184, 92, 56, 0.3)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 40px rgba(184, 92, 56, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 30px rgba(184, 92, 56, 0.3)";
              }
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></span>
                Processing...
              </span>
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div style={{
          marginTop: "20px",
          textAlign: "center"
        }}>
          <p style={{
            margin: 0,
            color: "#71635b",
            fontSize: "0.95rem"
          }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setSuccessMessage("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b85c38",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "4px 8px",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f6eadb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMessage("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b85c38",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: "4px 8px",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#f6eadb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

        <div style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid #f0ece6",
          textAlign: "center"
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#71635b",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              padding: "6px 12px",
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#b85c38";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#71635b";
            }}
          >
            ← Back to Home
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Auth;