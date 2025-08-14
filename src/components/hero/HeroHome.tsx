import { HeroBase } from './HeroBase';

export function HeroHome() {
  return (
    <HeroBase
      title='Advance Your Knowledge with Fermi'
      description='Explore expert-led courses in Quantum Computing, Machine Learning, Software Engineering, and Computer Science designed to accelerate your learning and career.'
      actions={[
        { text: 'Explore Courses', variant: 'primary' },
        { text: 'About us', href: '/about', variant: 'secondary' },
      ]}
      variant='minimal'
      background='subtle'
      className='mb-6'
    />
  );
}
