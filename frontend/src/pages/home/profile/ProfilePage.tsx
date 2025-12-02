import BlurImage from "@/components/custom/BlurImage";
import LoadingSmall from "@/components/custom/loading/LoadingSmall";
import TextField from "@/components/custom/TextField";
import ShowImage from "@/components/image/ShowImage";
import { useAccountStore } from "@/stores/account/account.store";
import { useSideBar } from "@/stores/sidebar/useSideBar";
import type { AccountType } from "@/types/account/account.type";
import { getFullName } from "@/utils/fullName/getFullName";
import Avatar from "avatox";
import { AnimatePresence } from "framer-motion";
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
  const { account, updateProfile, loading } = useAccountStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showImage, setShowImage] = useState<string | undefined>("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<AccountType>(account as AccountType);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    (account?.profilePicture as string) || null
  );

  useEffect(() => {
    setForm(account as AccountType);
  }, [account]);

  if (!account) return;

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
    <div className="h-[100dvh] w-full p-2 md:p-4 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-black overflow-y-scroll no-scrollbar">
      <RxHamburgerMenu
        className="md:hidden text-white/90 text-2xl cursor-pointer hover:text-yellow transition-colors mb-4"
        onClick={() => setOpen(true)}
      />
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Profile
            </h1>
            <p className="text-white/60 text-xs md:text-sm mt-0.5 hidden md:block">
              Manage your account information and preferences.
            </p>
          </div>
          <button
            onClick={() =>
              isEditing ? setIsEditing(false) : setIsEditing(true)
            }
            className="inline-flex items-center gap-2 rounded-full bg-yellow/90 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-black shadow-lg shadow-yellow/20 hover:bg-yellow hover:shadow-yellow/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70 transition-all cursor-pointer"
          >
            <FiEdit2 className="text-xs md:text-sm" />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
        </div>

        <div className="w-full space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-6">
            {isEditing ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-yellow/20 to-yellow/10 border-2 border-yellow/40 flex items-center justify-center overflow-hidden transition-all hover:scale-105">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage className="text-3xl md:text-4xl text-yellow/60" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiEdit2 className="text-yellow text-xl" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>
            ) : (
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  account.profilePicture &&
                  setShowImage(account.profilePicture as string)
                }
              >
                {account.profilePicture ? (
                  <BlurImage
                    src={account.profilePicture as string}
                    alt="Profile picture"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-yellow/60 object-cover transition-all hover:scale-105"
                    draggable={false}
                  />
                ) : (
                  <Avatar
                    key={account._id}
                    name={`${account.firstName} ${account.lastName}`}
                    size="xl"
                    className="bg-gradient-to-br from-yellow/20 to-yellow/10 p-4 rounded-full h-32 w-32 md:h-40 md:w-40 border-2 border-yellow/60"
                  />
                )}
                {account.profilePicture && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                    <FiImage className="text-yellow text-xl" />
                  </div>
                )}
              </div>
            )}

            {/* Name and Username */}
            {isEditing ? (
              <div className="w-full space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <TextField
                  name="username"
                  placeholder="Username *"
                  value={form.username}
                  onChange={handleChange}
                  required
                  icon={<FiAtSign />}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <FiUserCheck className="text-yellow text-lg" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {getFullName(account)}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow/10 border border-yellow/30">
                  <FiAtSign className="text-yellow text-sm" />
                  <span className="text-yellow font-mono text-sm font-medium">
                    {account.username}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contact & Info */}
          <div className="w-full space-y-4">
            <h3 className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <TextField
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={form.email}
                    onChange={handleChange}
                    required
                    icon={<FiMail />}
                  />
                  <TextField
                    type="address"
                    name="address"
                    placeholder="Address *"
                    value={form.address}
                    onChange={handleChange}
                    required
                    icon={<IoLocationOutline />}
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="p-2 rounded-lg bg-yellow/10">
                      <FiMail className="text-yellow text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-xs mb-0.5">Email</p>
                      <p className="text-white text-sm font-medium truncate">
                        {account.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="p-2 rounded-lg bg-yellow/10">
                      <FiMapPin className="text-yellow text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/60 text-xs mb-0.5">Address</p>
                      <p className="text-white text-sm font-medium break-words">
                        {account.address}
                      </p>
                    </div>
                  </div>
                </>
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
                  : "cursor-pointer hover:scale-[1.02] hover:shadow-yellow/30 transition-all"
              } w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-sm md:text-base shadow-lg shadow-yellow/20 flex items-center justify-center gap-2`}
            >
              {loading ? <LoadingSmall /> : "Update Profile"}
            </button>
          )}
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
    </div>
  );
};

export default ProfilePage;
