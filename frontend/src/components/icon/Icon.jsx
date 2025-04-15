import BeatzIcon from "@/assets/BeatzLogo2.svg";
import FacebookIcon from "@/assets/FacebookLogo.svg";
import GoogleIcon from "@/assets/GoogleLogo.png";
import AppleIcon from "@/assets/AppleLogo.svg";

const icons = {
  beatz: BeatzIcon,
  facebook: FacebookIcon,
  google: GoogleIcon,
  apple: AppleIcon,
};

const Icon = ({ name, alt, className }) => {
  const IconSrc = icons[name];
  return <img src={IconSrc} alt={alt} className={`icon ${className || ""}`} />;
};

export default Icon;
