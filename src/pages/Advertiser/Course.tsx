import { useState } from 'react';
import { usePageTitle } from '@/hooks/use-pagetitle';

type Course = {
  id: number;
  title: string;
  instructor: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  students: number;
  level: string;
  hours: number;
  description: string;
  tags: string[];
  videoUrl: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: 'Affiliate Marketing',
    instructor: 'ABC',
    price: '300$',
    originalPrice: '500$',
    image: '',
    rating: 4.7,
    students: 98000,
    level: 'All Levels',
    hours: 35,
    description:
      'Learn how to build a sustainable online income through affiliate marketing strategies that work in 2024.',
    tags: ['Affiliate Marketing', 'Digital Marketing', 'Passive Income'],
    videoUrl: ''
  },
  {
    id: 2,
    title: 'SEO for Affiliate Marketers: Rank & Bank',
    instructor: 'Nathan Gotch',
    price: '$14.99',
    originalPrice: '$79.99',
    image: '/api/placeholder/480/270',
    rating: 4.6,
    students: 62000,
    level: 'Intermediate',
    hours: 20,
    description:
      'Master SEO techniques tailored for affiliate marketing to increase traffic, conversions, and commissions.',
    tags: ['SEO', 'Affiliate Marketing', 'Traffic Growth'],
    videoUrl: 'https://www.youtube.com/embed/LEXspQmG6RI'
  },
  {
    id: 3,
    title: 'ClickBank Affiliate Marketing for Beginners',
    instructor: 'Diego Davila',
    price: '$13.99',
    originalPrice: '$69.99',
    image: '/api/placeholder/480/270',
    rating: 4.5,
    students: 45000,
    level: 'Beginner',
    hours: 12,
    description:
      'Step-by-step guide on how to start promoting ClickBank products and earn passive income online.',
    tags: ['ClickBank', 'Affiliate Marketing', 'Online Business'],
    videoUrl: 'https://www.youtube.com/embed/XTPc1I-pJOA'
  },
  {
    id: 4,
    title: 'Advanced Affiliate Funnels With Email Marketing',
    instructor: 'Franklin Hatchett',
    price: '$16.99',
    originalPrice: '$89.99',
    image: '/api/placeholder/480/270',
    rating: 4.8,
    students: 70000,
    level: 'Advanced',
    hours: 30,
    description:
      'Build high-converting funnels and email sequences to automate and scale your affiliate business.',
    tags: ['Funnels', 'Email Marketing', 'Affiliate Marketing'],
    videoUrl: 'https://www.youtube.com/embed/2u_yb0i63cg'
  },
  {
    id: 5,
    title: 'Affiliate Ads Mastery: Google, Facebook & Native',
    instructor: 'Robby Blanchard',
    price: '$18.99',
    originalPrice: '$94.99',
    image: '/api/placeholder/480/270',
    rating: 4.7,
    students: 88000,
    level: 'Intermediate',
    hours: 28,
    description:
      'Learn to run profitable affiliate ads on platforms like Google, Facebook and Taboola with real case studies.',
    tags: ['Paid Ads', 'Affiliate Marketing', 'Traffic'],
    videoUrl: 'https://www.youtube.com/embed/M9Qi9FNUWsc'
  },
  {
    id: 6,
    title: 'Amazon Associates Success Blueprint 2024',
    instructor: 'Jessica Stansberry',
    price: '$15.99',
    originalPrice: '$79.99',
    image: '/api/placeholder/480/270',
    rating: 4.6,
    students: 53000,
    level: 'Beginner',
    hours: 18,
    description:
      'Unlock the power of Amazon’s affiliate program and learn how to earn consistent monthly income.',
    tags: ['Amazon', 'Affiliate Marketing', 'E-commerce'],
    videoUrl: 'https://www.youtube.com/embed/gm5nD3xwNOS'
  }
];

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      <div className="mr-1 flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400'
                : star - 0.5 <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-yellow-400 text-sm font-bold">{rating}</span>
    </div>
  );
};

// Badge component
const Badge = ({ text }: { text: string }) => {
  return (
    <span className="bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-xs font-medium">
      {text}
    </span>
  );
};

type CourseDetailProps = {
  course: Course;
  onClose: () => void;
};

const CourseDetail = ({ course, onClose }: CourseDetailProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 px-3 py-1 text-3xl font-bold text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={course.image}
          alt={course.title}
          className="h-56 w-full rounded-t-lg object-cover md:h-72"
        />
        <div className="p-6">
          <h2 className="mb-2 text-3xl font-bold">{course.title}</h2>
          <p className="mb-1 font-semibold text-gray-700">
            Instructor: {course.instructor}
          </p>
          <div className="mb-3 flex items-center">
            <StarRating rating={course.rating} />
            <span className="ml-2 text-sm text-gray-500">
              ({course.students.toLocaleString()} students)
            </span>
          </div>
          <p className="mb-3 text-lg font-bold text-gray-900">{course.price}</p>
          <p className="mb-4 text-gray-600">{course.description}</p>
          <div className="mb-6">
            <h3 className="mb-2 text-xl font-semibold">Course Video Preview</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={course.videoUrl}
                title={course.title}
                allowFullScreen
                className="h-64 w-full rounded-md md:h-96"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge text={course.level} />
            <Badge text={`${course.hours} hours`} />
            {course.tags.map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
          <button
            onClick={() => alert(`Added "${course.title}" to cart!`)}
            className="rounded bg-purple-700 px-6 py-2 font-medium text-white transition hover:bg-purple-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const UdemyBody = () => {
  usePageTitle('Khóa học | Click Flow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const categories = [
    'Affiliate Marketing',
    'CPA Marketing',
    'SEO',
    'Email Marketing',
    'Social Media',
    'Traffic Generation'
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? course.tags.includes(selectedCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Banner */}
      <div className="mt-5 bg-gradient-to-r from-purple-900 to-indigo-800 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Expand your skills with our top courses
          </h1>
          <p className="mb-6 max-w-lg text-white/90">
            Choose from over 210,000 online video courses with new additions
            published every month
          </p>
          <div className="hidden md:block">
            <div className="rounded bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold">
                Learn web development from the best instructors
              </h2>
              <p className="mb-4 text-gray-600">
                Master in-demand skills with our most popular courses at special
                prices!
              </p>
              <button className="rounded bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <input
          type="text"
          placeholder="Search by course title or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl border-b border-gray-200 px-6 py-6">
        <h2 className="mb-4 text-xl font-bold">Top Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              selectedCategory === null
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Top courses for you</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <select className="rounded border border-gray-300 bg-white px-2 py-1 text-sm">
              <option>Most Popular</option>
              <option>Highest Rated</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-shadow duration-300 hover:shadow-lg"
              onClick={() => setSelectedCourse(course)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedCourse(course);
                }
              }}
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <button className="pointer-events-none rounded bg-white px-4 py-2 font-medium text-gray-800 shadow-md hover:bg-gray-100">
                    Preview Course
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-2 text-lg font-bold">
                  {course.title}
                </h3>
                <p className="mb-1 text-sm text-gray-600">
                  {course.instructor}
                </p>

                <div className="mb-1 flex items-center">
                  <StarRating rating={course.rating} />
                  <span className="ml-2 text-xs text-gray-500">
                    ({course.students.toLocaleString()})
                  </span>
                </div>

                <div className="mb-2 flex gap-2">
                  <Badge text={course.level} />
                  <Badge text={`${course.hours} hours`} />
                </div>

                <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                  {course.description}
                </p>

                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {course.price}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {course.originalPrice}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <button
                    className="w-full cursor-default rounded bg-purple-700 px-4 py-2 text-sm font-medium text-white hover:bg-purple-800"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                  >
                    Add to cart
                  </button>
                  <button
                    className="ml-2 rounded border border-gray-300 p-2 hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                  >
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default UdemyBody;
