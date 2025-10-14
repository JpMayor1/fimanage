import LoadingBig from "@/components/custom/loading/LoadingBig";
import AddSaving from "@/components/savings/main/AddSaving";
import DeleteSaving from "@/components/savings/main/DeleteSaving";
import UpdateSaving from "@/components/savings/main/UpdateSaving";
import { useSavingStore } from "@/stores/saving/useSavingStore";
import type { SavingType } from "@/types/saving/saving.type";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { TbPigMoney } from "react-icons/tb";

const SavingPage = () => {
  const { getSavings, getLoading, savings } = useSavingStore();

  const [addSaving, setAddSaving] = useState(false);
  const [updateSaving, seUpdateSaving] = useState<SavingType | null>(null);
  const [deleteSaving, seDeleteSaving] = useState<SavingType | null>(null);

  useEffect(() => {
    const fetchsavings = async () => await getSavings();
    fetchsavings();
  }, [getSavings]);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-xl font-bold">Savings</h1>
          <p className="text-white/70 text-sm hidden md:block">
            Track & manage your saving sources
          </p>
        </div>

        <button
          className="bg-yellow/90 hover:bg-yellow flex flex-row gap-2 items-center text-black rounded-md py-2 px-4 cursor-pointer text-xs md:text-base"
          onClick={() => setAddSaving(true)}
        >
          <FaPlus className="text-xs" />
          Saving
        </button>
      </div>

      {/* Saving List */}
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        {getLoading ? (
          <LoadingBig />
        ) : (
          <div className="space-y-2">
            {savings.length === 0 ? (
              <div className="w-full rounded-md bg-primary shadow-lg p-6 text-center">
                <p className="text-white/70 text-sm">
                  No saving records found.
                </p>
              </div>
            ) : (
              savings
                .slice()
                .reverse()
                .map((saving, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full rounded-md bg-primary shadow-lg p-4 flex justify-between ${
                        saving.annualRate || saving.frequency
                          ? "items-start"
                          : "items-center"
                      }`}
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-3">
                        <div className="w-13.5 h-13.5 flex items-center justify-center rounded-md border border-white/20 bg-black text-yellow">
                          <TbPigMoney className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-yellow text-xs">
                            {saving.category}
                          </p>
                          <p className="text-white text-sm max-w-[120px] truncate sm:max-w-none sm:whitespace-normal">
                            {saving.description}
                          </p>
                          <p className="text-white/30 text-xxs sm:text-sm">
                            {saving.dt}
                          </p>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="space-y-2">
                        <p className="text-yellow text-xs text-end">
                          {saving.annualRate && `${saving.annualRate}%`}{" "}
                          {saving.frequency}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-green">
                            ₱{saving.amount.toLocaleString()}
                          </p>
                          <button
                            className="text-white bg-green/80 hover:bg-green rounded-md p-2 cursor-pointer"
                            onClick={() => seUpdateSaving(saving)}
                          >
                            <MdEdit />
                          </button>
                          <button
                            className="text-white bg-red/80 hover:bg-red rounded-md p-2 cursor-pointer"
                            onClick={() => seDeleteSaving(saving)}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {addSaving && <AddSaving onClose={() => setAddSaving(false)} />}
        {updateSaving && (
          <UpdateSaving
            saving={updateSaving}
            onClose={() => seUpdateSaving(null)}
          />
        )}
        {deleteSaving && (
          <DeleteSaving
            saving={deleteSaving}
            onClose={() => seDeleteSaving(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavingPage;
