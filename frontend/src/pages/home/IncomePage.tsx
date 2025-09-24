import { MdDelete, MdEdit } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";

const IncomePage = () => {
  return (
    <div className="h-full w-full">
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-black text-xl font-bold">Income</h1>
          <p className="text-black/70 text-xs md:text-sm">
            Track & manage your income sources
          </p>
        </div>

        <button className="bg-yellow/90 hover:bg-yellow rounded-md py-2 px-4 cursor-pointer">
          + Income
        </button>
      </div>

      <div className="w-full">
        <p className="text-black text-md font-bold mb-2">All Income</p>

        <div className="space-y-2">
          <div className="w-full rounded-md bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green/40 p-4 rounded-md">
                <TbMoneybag className="text-white text-lg" />
              </div>
              <div>
                <p className="text-white text-sm">Monthly salary</p>
                <p className="text-white/50 text-xs">Salary</p>
                <p className="text-white/30 text-xs">January 1, 2025</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <p className="text-green">+₱5,000</p>
              <button className="text-white bg-green/50 rounded-md p-2">
                <MdEdit />
              </button>
              <button className="text-white bg-red/50 rounded-md p-2">
                <MdDelete />
              </button>
            </div>
          </div>

          <div className="w-full rounded-md bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green/40 p-4 rounded-md">
                <TbMoneybag className="text-white text-lg" />
              </div>
              <div>
                <p className="text-white text-sm">Monthly salary</p>
                <p className="text-white/50 text-xs">Salary</p>
                <p className="text-white/30 text-xs">January 1, 2025</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <p className="text-green">+₱5,000</p>
              <button className="text-white bg-green/50 rounded-md p-2">
                <MdEdit />
              </button>
              <button className="text-white bg-red/50 rounded-md p-2">
                <MdDelete />
              </button>
            </div>
          </div>

          <div className="w-full rounded-md bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green/40 p-4 rounded-md">
                <TbMoneybag className="text-white text-lg" />
              </div>
              <div>
                <p className="text-white text-sm">Monthly salary</p>
                <p className="text-white/50 text-xs">Salary</p>
                <p className="text-white/30 text-xs">January 1, 2025</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <p className="text-green">+₱5,000</p>
              <button className="text-white bg-green/50 rounded-md p-2">
                <MdEdit />
              </button>
              <button className="text-white bg-red/50 rounded-md p-2">
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
