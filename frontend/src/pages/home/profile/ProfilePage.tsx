import BlurImage from "@/components/custom/BlurImage";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import ShowImage from "@/components/image/ShowImage";
import { imgAnim } from "@/constants/image.animation.constant";
import { overlayAnim } from "@/constants/overlay.animation.constant";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { AccountType } from "@/types/auth/auth.type";
import { getFullName } from "@/utils/fullName/getFullName";
import Avatar from "avatox";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiAtSign,
  FiEdit2,
  FiImage,
  FiMail,
  FiMapPin,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const ProfilePage = () => {
  const { setOpen } = useSideBar();
  const { authUser, updateProfile, loading } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showImage, setShowImage] = useState<string | undefined>("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<AccountType>(authUser as AccountType);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    authUser?.profilePicture || null
  );

  useEffect(() => {
    setForm(authUser as AccountType);
  }, [authUser]);

  if (!authUser) return;

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, newProfilePicture: file }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleSave = async () => {
    const success = await updateProfile(form);
    if (success) {
      fileInputRef.current = null;
      setForm((prev) => ({ ...prev, newProfilePicture: null }));
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      key="complete-profile-modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={overlayAnim}
      className={`w-full h-full flex justify-center p-5 ${
        isEditing
          ? "items-start md:items-center overflow-y-scroll no-scrollbar"
          : "items-center"
      }`}
    >
      <RxHamburgerMenu
        className="md:hidden text-white text-2xl absolute top-3.5 left-3 z-10"
        onClick={() => setOpen(true)}
      />
      <div className="w-full max-w-3xl border border-primary/10 bg-primary/90 rounded-2xl shadow-2xl py-8 px-4 md:px-8 relative flex flex-col items-center">
        {/* Edit Button */}
        <button
          onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
          className="absolute top-5 right-3 md:right-5 bg-yellow text-black px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-yellow/80 transition cursor-pointer"
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <FiEdit2 /> Edit
            </>
          )}
        </button>

        {/* Profile Section */}
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={imgAnim}
          className="flex flex-col items-center mb-5 w-full"
        >
          {isEditing ? (
            <div className="flex flex-col items-center mb-3">
              <div onClick={() => fileInputRef.current?.click()}>
                <div className="h-36 w-36 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center overflow-hidden shadow cursor-pointer hover:ring-2 hover:ring-yellow-400 transition">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage className="text-4xl text-yellow-400" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {authUser.profilePicture ? (
                <BlurImage
                  src={authUser.profilePicture}
                  alt="Profile picture"
                  className="w-36 h-36 rounded-full border-2 border-yellow/80 object-cover shadow-md mb-3 bg-white cursor-pointer"
                  draggable={false}
                  onClick={() => setShowImage(authUser.profilePicture)}
                />
              ) : (
                <Avatar
                  key={authUser._id}
                  name={`${authUser.firstName} ${authUser.lastName}`}
                  size="xl"
                  className="bg-primary p-4 rounded-full h-36 w-36 border-2 border-yellow/80"
                />
              )}
            </>
          )}

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <TextField
                name="firstName"
                placeholder="First Name *"
                value={form.firstName}
                onChange={handleChange}
                required
                icon={<FiUser />}
              />
              <TextField
                name="middleName"
                placeholder="Middle Name"
                value={form.middleName}
                onChange={handleChange}
                icon={<FiUser />}
              />
              <TextField
                name="lastName"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={handleChange}
                required
                icon={<FiUser />}
              />
              <TextField
                name="suffix"
                placeholder="Suffix"
                value={form.suffix}
                onChange={handleChange}
                icon={<FiUser />}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1">
              <FiUserCheck className="text-yellow" />
              <h2 className="text-xl font-bold font-heading text-white">
                {getFullName(authUser)}
              </h2>
            </div>
          )}

          {isEditing ? (
            <TextField
              name="username"
              placeholder="Username *"
              value={form.username}
              onChange={handleChange}
              required
              icon={<FiAtSign />}
            />
          ) : (
            <span className="text-yellow font-mono text-sm mb-2">
              @{authUser.username}
            </span>
          )}
        </motion.div>

        {/* Contact & Info */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
          <div className="space-y-2">
            {isEditing ? (
              <TextField
                type="email"
                name="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
                icon={<FiMail />}
              />
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <FiMail className="text-yellow" />
                <span className="text-white">{authUser.email}</span>
              </div>
            )}

            {isEditing ? (
              <TextField
                type="address"
                name="address"
                placeholder="Address *"
                value={form.address}
                onChange={handleChange}
                required
                icon={<IoLocationOutline />}
              />
            ) : (
              <div className="flex items-center gap-2">
                <FiMapPin className="text-yellow" />
                <span className="text-white">{authUser.address}</span>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <button
            disabled={loading}
            onClick={handleSave}
            className={`${
              loading
                ? "cursor-not-allowed opacity-80"
                : "cursor-pointer hover:scale-101 hover:shadow-xl transition-all"
            } w-full py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-500 text-white font-bold text-lg shadow-md`}
          >
            {loading ? <LoadingSmall /> : "Update"}
          </button>
        )}
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
