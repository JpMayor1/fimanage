import { useAuthStore } from "@/stores/auth/useAuthStore";
import Avatar from "avatox";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import BlurImage from "../custom/BlurImage";
import ProfileCard from "../custom/ProfileCard";

const Header = () => {
  const { authUser } = useAuthStore();
  const [openProfile, setOpenProfile] = useState(false);

  if (!authUser) return;
  return (
    <div className="h-full w-full flex items-center justify-end px-3">
      <div>
        {authUser.profilePicture ? (
          <BlurImage
            src={authUser.profilePicture}
            alt="Profile picture"
            className="h-14 w-14 rounded-full object-cover cursor-pointer border border-yellow"
            draggable={false}
            onClick={() => setOpenProfile(!openProfile)}
          />
        ) : (
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="cursor-pointer"
          >
            <Avatar
              key={authUser._id}
              name={`${authUser.firstName} ${authUser.lastName}`}
              size="lg"
              className="bg-yellow p-4 rounded-full h-14 w-14"
            />
          </div>
        )}

        <AnimatePresence>
          {openProfile && <ProfileCard onClose={() => setOpenProfile(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
