import { useAuthStore } from "@/stores/auth/useAuthStore";
import Avatar from "avatox";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type FC } from "react";
import { FiMail, FiUser, FiX } from "react-icons/fi";
import BlurImage from "../custom/BlurImage";
import ShowImage from "../image/ShowImage";

interface ProfileCardI {
  onClose: () => void;
}

const ProfileCard: FC<ProfileCardI> = ({ onClose }) => {
  const { authUser, logout } = useAuthStore();

  const [showImage, setShowImage] = useState<string | undefined>("");

  const overlayAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.23 } },
    exit: { opacity: 0, transition: { duration: 0.17 } },
  };
  const imgAnim = {
    initial: { opacity: 0, scale: 0.93 },
    animate: {
      opacity: 1,
      scale: 1,
    },
    exit: { opacity: 0, scale: 0.93, transition: { duration: 0.2 } },
    transition: { duration: 0.33, ease: "easeOut" },
  };

  if (!authUser) return;
  return (
    <>
      <motion.div
        key="profile-modal"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={overlayAnim}
        className="absolute top-16 right-10 z-20 w-75 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-2xl bg-white/95 backdrop-blur-2xl border border-primary/20 px-6 py-7 flex flex-col items-center animate-fade-in"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-red/10 transition cursor-pointer"
          aria-label="Close profile"
        >
          <FiX className="text-xl text-red" />
        </button>
        {/* Profile picture */}
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={imgAnim}
          className="flex items-center justify-center h-full"
        >
          {authUser.profilePicture ? (
            <BlurImage
              src={authUser.profilePicture}
              alt="Profile picture"
              className="w-20 h-20 rounded-full border-2 border-primary object-cover shadow mb-3 bg-white cursor-pointer"
              draggable={false}
              onClick={() => setShowImage(authUser.profilePicture)}
            />
          ) : (
            <Avatar
              key={authUser._id}
              name={`${authUser.firstName} ${authUser.lastName}`}
              size="lg"
              className="bg-primary p-4 rounded-full h-13 w-13"
            />
          )}
        </motion.div>

        {/* Name */}
        <div className="text-xl font-heading font-bold text-primary text-center mb-1 flex items-center gap-1">
          <FiUser className="text-gray" />
          {authUser.firstName} {authUser.lastName}
        </div>
        {/* Username */}
        <div className="text-sm text-gray font-mono mb-2">
          @{authUser.username}
        </div>
        {/* Email */}
        <div className="flex items-center gap-2 text-gray mb-4">
          <FiMail className="text-primary" />
          <span className="truncate">{authUser.email}</span>
        </div>
        {/* Divider */}
        <div className="w-full border-t border-primary/10 mb-5" />
        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full py-2 rounded-xl bg-primary/90 text-white font-semibold shadow hover:bg-primary transition cursor-pointer"
        >
          Sign out
        </button>
      </motion.div>
      <AnimatePresence>
        {showImage && (
          <ShowImage
            image={showImage}
            onClose={() => setShowImage(undefined)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;
