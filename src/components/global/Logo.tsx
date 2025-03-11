import { IMAGES } from "@/data/const";

const Logo = () => {
  return (
    <div className="border-2 flex mx-auto justify-center items-center w-fit px-4 py-1.5 gap-x-3 rounded-xl ">
      <img src={IMAGES.OLLYO_LOGO_COLOR} alt="Logo" className="size-6" />
      <h4>ta.</h4>
    </div>
  );
};

export default Logo;
