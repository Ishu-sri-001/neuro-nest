export default function LandingSections() {
  return (
    <div className="space-y-24 py-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center" id="home">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to NeuroNest</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Empowering your digital journey with cutting-edge AI solutions
        </p>
        <div className="h-64 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg shadow-xl"></div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12" id="features">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Feature {i}</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 rounded-lg" id="about">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          NeuroNest is a pioneering AI company dedicated to creating intelligent solutions that transform how businesses
          operate. Our team of experts combines cutting-edge technology with deep industry knowledge to deliver
          exceptional results.
        </p>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12" id='contact'>
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md">
          <p className="text-center mb-6">Have questions? We'd love to hear from you!</p>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-gray-600">contact@neuronest.ai</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-gray-600">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
