import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import Avatar from "avatox";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import BlurImage from "../custom/BlurImage";
import ProfileCard from "../custom/ProfileCard";

const Header = () => {
  const { authUser } = useAuthStore();
  const { setOpen } = useSideBar();

  const [openProfile, setOpenProfile] = useState(false);

  if (!authUser) return;
  return (
    <div className="h-full w-full flex items-center justify-between md:justify-end px-3">
      <RxHamburgerMenu
        className="md:hidden text-black text-2xl"
        onClick={() => setOpen(true)}
      />
      <div>
        {authUser.profilePicture ? (
          <BlurImage
            src={authUser.profilePicture}
            alt="Profile picture"
            className="h-14 w-14 rounded-full object-cover cursor-pointer border border-primary"
            draggable={false}
            onClick={() => setOpenProfile(!openProfile)}
          />
        ) : (
          <Avatar
            key={authUser._id}
            name={`${authUser.firstName} ${authUser.lastName}`}
            size="lg"
            className="bg-primary p-4 rounded-full h-14 w-14 cursor-pointer"
            onClick={() => setOpenProfile(!openProfile)}
          />
        )}

        <AnimatePresence>
          {openProfile && <ProfileCard onClose={() => setOpenProfile(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
