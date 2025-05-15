import BeatzIcon from "@/assets/logo/BeatzLogo2.svg";
import FacebookIcon from "@/assets/logo/FacebookLogo.svg";
import GoogleIcon from "@/assets/logo/GoogleLogo.png";
import AppleIcon from "@/assets/logo/AppleLogo.svg";
import AddIcon from "@/assets/sidebar/Add.svg";
import HomeIcon from "@/assets/sidebar/Home.png";
import SearchIcon from "@/assets/sidebar/Search.png";

const icons = {
  beatz: BeatzIcon,
  facebook: FacebookIcon,
  google: GoogleIcon,
  apple: AppleIcon,
  addIcon: AddIcon,
  homeIcon: HomeIcon,
  searchIcon: SearchIcon,
};

const Icon = ({ name, alt, className }) => {
  const IconSrc = icons[name];
  return <img src={IconSrc} alt={alt} className={`icon ${className || ""}`} />;
};

export default Icon;
