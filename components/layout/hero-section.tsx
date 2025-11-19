interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  children?: React.ReactNode;
}

export function HeroSection({ title, subtitle, description, children }: HeroSectionProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {title}
        {subtitle && (
          <span className="block text-2xl text-blue-600 font-normal mt-2">{subtitle}</span>
        )}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">{description}</p>
      {children && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          {children}
        </div>
      )}
    </div>
  );
}
