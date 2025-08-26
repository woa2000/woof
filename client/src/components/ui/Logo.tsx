interface LogoProps {
  sizeClass?: string; // permite customizar tamanho
  white?: boolean;    // força versão branca via filtro
}

const Logo: React.FC<LogoProps> = ({ sizeClass = 'h-8', white = true }) => {
  return (
    <div className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.svg"
        alt="Woof Digital"
        className={`${sizeClass} w-auto ${white ? 'brightness-0 invert' : ''}`}
        style={{ maxWidth: '140px' }}
      />
    </div>
  );
};

export default Logo;
