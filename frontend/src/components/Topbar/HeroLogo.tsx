import heroLogo from '../../pictures/hero_logo.png';

const HeroLogo = () => {
  return (
    <div className='w-35 h-15 bg-blue-100'>
      <img src={heroLogo} alt='Acxor Logo' className='w-12 h-12 mx-auto' />
    </div>
  );
};

export default HeroLogo;
