<template>
  <div class="home-page">
    <!-- Navigation Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold text-primary" to="/">
          <h3 class="mb-0">English Vidshup</h3>
        </router-link>
        
        <div class="navbar-nav ms-auto">
          <router-link 
            to="/login" 
            class="btn btn-outline-primary me-2"
          >
            Login
          </router-link>
          <router-link 
            to="/login" 
            class="btn btn-primary"
          >
            Get Started
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-4 fw-bold text-dark mb-4">
                Welcome to 
                <span class="text-primary">English Vidshup</span>
              </h1>
              <p class="lead text-muted mb-4">
                Your comprehensive English learning platform. Master the language with our interactive tools, 
                personalized lessons, and advanced learning techniques.
              </p>
              <div class="hero-buttons">
                <router-link 
                  to="/login" 
                  class="btn btn-primary btn-lg me-3"
                >
                  Start Learning
                </router-link>
                <button class="btn btn-outline-secondary btn-lg" @click="scrollToFeatures">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image">
              <div class="floating-card">
                <div class="card border-0 shadow-lg">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="icon-circle bg-primary text-white me-3">
                        <i class="fas fa-graduation-cap"></i>
                      </div>
                      <div>
                        <h6 class="mb-0">Interactive Learning</h6>
                        <small class="text-muted">Engage with content</small>
                      </div>
                    </div>
                    <div class="progress mb-3" style="height: 8px;">
                      <div class="progress-bar bg-primary" style="width: 75%"></div>
                    </div>
                    <small class="text-muted">75% Complete</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5">
            <h2 class="display-5 fw-bold text-dark mb-3">Why Choose English Vidshup?</h2>
            <p class="lead text-muted">
              Our platform offers cutting-edge tools and methodologies to accelerate your English learning journey.
            </p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon mb-3">
                <i class="fas fa-brain text-primary"></i>
              </div>
              <h5 class="fw-bold">Brain Storm</h5>
              <p class="text-muted">
                Enhance your vocabulary through creative thinking exercises and word association games.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon mb-3">
                <i class="fas fa-language text-primary"></i>
              </div>
              <h5 class="fw-bold">Word Translation</h5>
              <p class="text-muted">
                Master translation skills with our intelligent word-to-word and context-based translation tools.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon mb-3">
                <i class="fas fa-volume-up text-primary"></i>
              </div>
              <h5 class="fw-bold">Audio Training</h5>
              <p class="text-muted">
                Improve your pronunciation and listening skills with our advanced audio training modules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8">
            <h2 class="display-5 fw-bold mb-3">Ready to Start Your English Learning Journey?</h2>
            <p class="lead mb-4">
              Join thousands of learners who have improved their English skills with our comprehensive platform.
            </p>
            <router-link to="/login" class="btn btn-light btn-lg">
              Get Started Now
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer bg-dark text-white py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0">&copy; 2024 English Vidshup. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">Empowering English learners worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Methods
const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
}

.hero-section {
  padding-top: 80px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.hero-content {
  animation: fadeInUp 1s ease-out;
}

.hero-image {
  animation: fadeInRight 1s ease-out;
}

.floating-card {
  animation: float 3s ease-in-out infinite;
}

.feature-card {
  transition: transform 0.3s ease;
  border-radius: 15px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.footer {
  background: #2c3e50 !important;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding-top: 100px;
  }
  
  .display-4 {
    font-size: 2.5rem;
  }
  
  .hero-buttons .btn {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
