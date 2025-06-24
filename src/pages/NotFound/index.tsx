import BasePages from '@/components/shared/base-pages';
import { useRouter } from '@/routes/hooks';

// Mock Button component
const Button = ({ onClick, variant = 'default', children, className = '' }) => {
  const baseClasses =
    'px-5 py-2.5 rounded font-medium transition-all duration-200';
  const variantClasses = {
    default: 'bg-green-600 hover:bg-green-700 text-white',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function NotFound() {
  const router = useRouter();

  return (
    <BasePages pageHead="Not Found">
      <section
        className="mt-14 bg-white py-10"
        style={{ fontFamily: '"Arvo", serif' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="mx-auto w-5/6 text-center">
                {/* Background with 404 text */}
                <div
                  className="relative flex h-96 items-start justify-center bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)'
                  }}
                >
                  <h1 className="text-center text-7xl font-bold text-black drop-shadow-2xl md:text-8xl">
                    404
                  </h1>
                </div>

                {/* Content box */}
                <div className="relative z-10 -mt-12">
                  <h3 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">
                    Look like you're lost
                  </h3>
                  <p className="mb-6 text-lg text-gray-600">
                    the page you are looking for not available!
                  </p>

                  <Button
                    onClick={() => router.push('/')}
                    className="my-5 inline-block bg-green-600 px-5 py-2.5 text-white hover:bg-green-700"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BasePages>
  );
}
