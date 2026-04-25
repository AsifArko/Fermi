'use client';

export function ScientificHero() {
  return (
    <section className='relative py-8 sm:py-12 lg:py-8 overflow-hidden'>
      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Left Column - Content */}
          <div className='space-y-6 lg:space-y-8'>
            {/* Main Title */}
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
              Welcome to{' '}
              <span className='text-gray-700 dark:text-gray-300'>Fermi</span>
            </h1>

            {/* Description */}
            <p className='text-xs leading-relaxed text-muted-foreground/80 sm:text-sm max-w-lg font-light tracking-wide'>
              We offer courses in Quantum Computing, Machine Learning,
              Artificial Intelligence, Software Engineering, and more.
            </p>

            {/* Call to Action */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={() => (window.location.href = '/courses')}
                className='inline-flex items-center justify-center px-6 h-10 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-800 rounded-sm transition-all duration-200'
              >
                Explore Courses
              </button>

              <button
                onClick={() => (window.location.href = '/about')}
                className='inline-flex items-center justify-center px-6 h-10 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-all duration-200'
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Animation */}
          <div className='flex justify-center lg:justify-end'>
            <div className='relative w-full max-w-md h-64'>
              {/* Animated Quantum Particles */}
              <div className='absolute inset-0 bg-gradient-to-br from-gray-400/10 via-gray-500/10 to-gray-600/10 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-sm'>
                {/* Central Orbital System */}
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  {/* Central Core */}
                  <div className='w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full animate-pulse shadow-lg shadow-gray-500/25'></div>

                  {/* Orbiting Particles */}
                  {[...Array(6)].map((_unused, index) => (
                    <div
                      key={`orbital-${8 + index * 2}-${0.5 + index * 0.5}`}
                      className='absolute w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-spin'
                      style={{
                        top: '-50px',
                        left: '-6px',
                        transformOrigin: '6px 50px',
                        animationDuration: `${8 + index * 2}s`,
                        animationDelay: `${index * 0.5}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Floating Quantum Dots */}
                {[...Array(8)].map((_unused, index) => (
                  <div
                    key={`dot-${20 + index * 8}-${15 + (index % 3) * 20}-${2 + index * 0.3}`}
                    className='absolute w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-bounce'
                    style={{
                      left: `${20 + index * 8}%`,
                      top: `${15 + (index % 3) * 20}%`,
                      animationDuration: `${2 + index * 0.3}s`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  />
                ))}

                {/* Wave Patterns */}
                <div className='absolute inset-0 opacity-30'>
                  <div
                    className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent animate-pulse'
                    style={{ animationDuration: '4s' }}
                  ></div>
                  <div
                    className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-500/20 to-transparent animate-pulse'
                    style={{ animationDuration: '6s', animationDelay: '1s' }}
                  ></div>
                </div>

                {/* Connection Lines */}
                <svg
                  className='absolute inset-0 w-full h-full'
                  viewBox='0 0 100 100'
                  preserveAspectRatio='none'
                >
                  {[...Array(5)].map((_unused, index) => (
                    <line
                      key={`line-${20 + index * 15}-${30 + index * 15}-${3 + index}`}
                      x1={`${20 + index * 15}`}
                      y1='20'
                      x2={`${30 + index * 15}`}
                      y2='80'
                      stroke='url(#gradient)'
                      strokeWidth='0.5'
                      opacity='0.3'
                      className='animate-pulse'
                      style={{ animationDuration: `${3 + index}s` }}
                    />
                  ))}
                  <defs>
                    <linearGradient
                      id='gradient'
                      x1='0%'
                      y1='0%'
                      x2='100%'
                      y2='100%'
                    >
                      <stop offset='0%' stopColor='#9CA3AF' stopOpacity='0.5' />
                      <stop
                        offset='100%'
                        stopColor='#6B7280'
                        stopOpacity='0.5'
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
