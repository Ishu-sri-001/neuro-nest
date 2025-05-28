export default function LandingSections() {

  const features = [
  {
    id: 1,
    title: "Intelligent Emotional Analysis",
    description: "NeuroNest uses advanced natural language processing to understand the nuances of your emotional state through conversation. Our AI analyzes tone, context, and patterns in your messages to provide personalized therapeutic responses that adapt to your unique mental health needs in real-time."
  },
  {
    id: 2,
    title: "Safe & Confidential Space",
    description: "Your privacy is our priority. NeuroNest creates a judgment-free environment where you can express yourself openly without fear of stigma. All conversations are encrypted and secure, providing you with a safe digital sanctuary to explore your thoughts and feelings whenever you need support."
  },
  {
    id: 3,
    title: "24/7 Personalized Support",
    description: "Unlike traditional therapy with scheduled appointments, NeuroNest is available whenever you need it. Our AI learns from your interactions to provide increasingly personalized guidance, coping strategies, and emotional support that grows more effective over time, ensuring you&apos;re never alone in your mental health journey."
  }
];

  return (
    <div className="space-y-32 py-24 bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center relative" id="home">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-3xl transform -rotate-1 scale-105"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Welcome to NeuroNest
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Where Technology Meets Empathy – Redefining Mental Wellness for the Digital Age
          </p>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/pic/neuro-bot.png" 
              alt="NeuroNest AI Therapy Interface" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 relative" id="features">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-20 animate-pulse"></div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`p-8 bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden ${
                index === 0 ? 'hover:border-purple-300' : 
                index === 1 ? 'hover:border-blue-300' : 
                'hover:border-teal-300'
              }`}
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${
                index === 0 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 
                index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                'bg-gradient-to-r from-teal-500 to-teal-600'
              }`}></div>
              
              <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                index === 0 ? 'bg-gradient-to-br from-purple-100 to-purple-200' : 
                index === 1 ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 
                'bg-gradient-to-br from-teal-100 to-teal-200'
              }`}>
                <div className={`w-6 h-6 rounded-lg ${
                  index === 0 ? 'bg-purple-500' : 
                  index === 1 ? 'bg-blue-500' : 
                  'bg-teal-500'
                }`}></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 relative" id="about">
        <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              About Us
            </h2>
            <div className="text-lg md:text-xl text-gray-700 text-center max-w-4xl mx-auto space-y-6 leading-relaxed">
              <p className="text-xl font-medium">At NeuroNest, we believe mental health support shouldn&apos;t be limited by appointments, waiting lists, or location. We&apos;ve created more than just a chatbot – we&apos;ve built a digital companion that truly listens, learns, and cares.</p>
              <p>Our mission is to make quality mental health support accessible to everyone, everywhere, at any time. Emotional struggles don&apos;t follow a 9-to-5 schedule, and neither should your support. That&apos;s why we&apos;ve developed an AI therapist that combines advanced natural language processing with evidence-based therapeutic techniques.</p>
              <p>NeuroNest provides a judgment-free space where you can explore your thoughts, process emotions, and find your path to wellness. We&apos;re here to listen when you need to talk, guide when you feel lost, and support your journey toward better mental health.</p>
              <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Your wellbeing matters. At NeuroNest, you&apos;re never alone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-16" id='contact'>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <div className="max-w-lg mx-auto bg-white p-10 border-2 border-gray-100 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"></div>
          
          <p className="text-center mb-8 text-xl text-gray-700 font-medium">Have questions? We&apos;d love to hear from you!</p>
          <div className="space-y-6">
            <div className="flex items-center justify-center bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-gray-700 text-lg font-medium">contact@neuronest.ai</span>
            </div>
            <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-gray-700 text-lg font-medium">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}