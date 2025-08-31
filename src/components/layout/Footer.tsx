import { RESTAURANT_CONFIG } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-[#EFE7D2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-semibold mb-4">Contact Info</h5>
            <p className="text-gray-300 mb-2">📍 {RESTAURANT_CONFIG.address}</p>
            <p className="text-gray-300 mb-2">📞 {RESTAURANT_CONFIG.phone}</p>
            <p className="text-gray-300">✉️ {RESTAURANT_CONFIG.email}</p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Hours</h5>
            <p className="text-gray-300 mb-2">Monday - Sunday</p>
            <p className="text-gray-300">5:00 PM - 11:00 PM</p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-[#EFE7D2] cursor-pointer transition-colors"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-[#EFE7D2] cursor-pointer transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-[#EFE7D2] cursor-pointer transition-colors"
                aria-label="Twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {RESTAURANT_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}