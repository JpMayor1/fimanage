import { useAuthStore } from "@/stores/auth/useAuthStore";

const HomePage = () => {
  const { logout, logoutLoading } = useAuthStore();
  return (
    <div>
      <button disabled={logoutLoading} onClick={logout}>
        {logoutLoading ? "Loggingout..." : "Logout"}
      </button>
    </div>
  );
};

export default HomePage;
