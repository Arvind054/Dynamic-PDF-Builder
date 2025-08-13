// Home page
import { Link } from 'react-router-dom'
import { FiEdit, FiUpload, FiShare2, FiDownload, FiCode, FiLayers } from 'react-icons/fi'
import { FaQrcode } from 'react-icons/fa'
import Navbar from './Editor/components/Navbar'
import FeatureCard from './Editor/components/FeatureCard'
const Home = () => {
  const features = [
            {
              icon: <FiUpload className="h-8 w-8 text-blue-600" />,
              title: "Upload Backgrounds",
              description: "Add your own images as PDF backgrounds for custom designs"
            },
            {
              icon: <FiEdit className="h-8 w-8 text-blue-600" />,
              title: "Drag & Drop Fields",
              description: "Easily position text, images, and form fields with precision"
            },
            {
              icon: <FiLayers className="h-8 w-8 text-blue-600" />,
              title: "Multi-page Documents",
              description: "Create documents with multiple pages and reorder them as needed"
            },
            {
              icon: <FiCode className="h-8 w-8 text-blue-600" />,
              title: "JSON Data Binding",
              description: "Automatically populate fields from JSON data sources"
            },
            {
              icon: <FaQrcode className="h-8 w-8 text-blue-600" />,
              title: "QR Code Generator",
              description: "Generate QR Codes to add to the PDF"
            },
            {
              icon: <FiDownload className="h-8 w-8 text-blue-600" />,
              title: "Print-ready PDFs",
              description: "Export high-quality PDFs with selectable text and vectors"
            }
          ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/*NavBar */}
       <Navbar></Navbar>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Create <span className="text-blue-600">Dynamic PDFs</span> with Ease
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600">
          Drag, drop, and design professional PDF documents with our intuitive builder.
        </p>
        <div className="mt-10">
          <Link
            to="/editor"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Powerful Features</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Everything you need to create perfect PDF documents
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="pt-6">
               <FeatureCard feature={feature}/>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to create your perfect PDF?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Start building professional documents in minutes with our intuitive editor.
          </p>
          <Link
            to="/editor"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Launch Editor Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <FiEdit className="h-8 w-8 text-white" />
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} PDF Builder. All rights reserved. 
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home