import heroLogo from '../../pictures/hero_logo.png';

const HeroLogo = () => {
  return (
    <div className='w-34 h-15 bg-blue-100 flex items-center justify-center'>
      <img
        src={heroLogo}
        alt='Acxor Logo'
        className='w-34 h-18 border border-blue-400 rounded-3xl'
      />
    </div>
  );
};

export default HeroLogo;
