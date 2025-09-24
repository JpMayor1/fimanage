import BlurImage from "@/components/custom/BlurImage";
import ShowImage from "@/components/image/ShowImage";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Avatar from "avatox";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiMail, FiMapPin, FiUserCheck } from "react-icons/fi";

const imgAnim = {
  initial: { opacity: 0, scale: 0.93 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.93, transition: { duration: 0.2 } },
  transition: { duration: 0.33, ease: "easeOut" },
};

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.23 } },
  exit: { opacity: 0, transition: { duration: 0.17 } },
};

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  const [showImage, setShowImage] = useState<string | undefined>("");

  if (!authUser) return;
  return (
    <motion.div
      key="complete-profile-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className="w-full flex items-center justify-center p-5"
    >
      <div className="w-full max-w-3xl bg-white border border-primary/10 rounded-2xl shadow-2xl py-8 px-4 md:px-8 relative flex flex-col items-center">
        {/* Profile Section */}
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={imgAnim}
          className="flex flex-col items-center mb-5 w-full"
        >
          {authUser.profilePicture ? (
            <BlurImage
              src={authUser.profilePicture}
              alt="Profile picture"
              className="w-36 h-36 rounded-full border-4 border-primary/80 object-cover shadow-md mb-3 bg-white cursor-pointer"
              draggable={false}
              onClick={() => setShowImage(authUser.profilePicture)}
            />
          ) : (
            <Avatar
              key={authUser._id}
              name={`${authUser.firstName} ${authUser.lastName}`}
              size="xl"
              className="bg-primary p-4 rounded-full h-36 w-36"
            />
          )}

          <h2 className="text-xl font-bold font-heading text-primary mb-1 flex items-center gap-2">
            <FiUserCheck className="text-blue-400" />
            {authUser.firstName}{" "}
            {authUser.middleName ? authUser.middleName + " " : ""}
            {authUser.lastName}
            {authUser.suffix ? " " + authUser.suffix : ""}
          </h2>
          <span className="text-gray-400 font-mono text-sm mb-2">
            @{authUser.username}
          </span>
        </motion.div>

        {/* Contact & Info */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiMail className="text-blue-400" />
              <span className="text-gray-700">{authUser.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiMapPin className="text-blue-400" />
              <span className="text-gray-700">{authUser.address}</span>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showImage && (
          <ShowImage
            image={showImage}
            onClose={() => setShowImage(undefined)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfilePage;
