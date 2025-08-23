export function FeaturesSection() {
  const features = [
    {
      icon: '👨‍🍳',
      title: 'Master Chefs',
      description: 'Award-winning chefs with decades of culinary expertise'
    },
    {
      icon: '🥘',
      title: 'Fresh Ingredients',
      description: 'Locally sourced, premium ingredients delivered daily'
    },
    {
      icon: '🍷',
      title: 'Fine Wine Selection',
      description: 'Curated wine collection from around the world'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Bella Vista?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}