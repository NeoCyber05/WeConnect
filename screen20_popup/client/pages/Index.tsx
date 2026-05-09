import { useState } from "react";
import CreateEventModal from "../components/CreateEventModal";

export default function Index() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <CreateEventModal isOpen={modalOpen} onClose={() => setModalOpen(true)} />
    </div>
  );
}
