import { useSideBar } from "@/stores/sidebar/useSideBar";

const SideBar = () => {
  const { open } = useSideBar();
  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } h-full w-full md:min-w-60 md:w-60 bg-primary absolute top-0 left-0 z-10 md:block`}
    >
      SideBar
    </div>
  );
};

export default SideBar;
