// Feature Card for the Home page
import React from 'react'
function FeatureCard({feature}) {
  return (
     <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                <div className="-mt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white shadow-md mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 text-center">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-base text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
  )
}

export default FeatureCard;