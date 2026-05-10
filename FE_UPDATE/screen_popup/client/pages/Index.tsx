import { useState } from "react";
import EditEventModal from "../components/EditEventModal";

interface Event {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  maxAttendees: number;
  registered: number;
  status: "active" | "closed" | "cancelled";
  coverImage: string;
  description: string;
}

const DEFAULT_EVENT: Event = {
  id: 1,
  name: "Hội thảo Công nghệ Blockchain 2024",
  category: "Công nghệ",
  date: "24/05/2024, 08:30 AM",
  location: "Trung tâm Hội nghị Quốc gia",
  maxAttendees: 200,
  registered: 156,
  status: "active",
  coverImage: "https://api.builder.io/api/v1/image/assets/TEMP/aece6927bc5f80fe28ed9c9383395a5207764768?width=125",
  description: "",
};

export default function Index() {
  const [event, setEvent] = useState<Event>(DEFAULT_EVENT);

  const handleSave = (updated: Event) => {
    setEvent(updated);
  };

  const handleCancelEvent = (id: number) => {
    setEvent((prev) => ({ ...prev, status: "cancelled" as const }));
  };

  const handleCloseRegistration = (id: number) => {
    setEvent((prev) => ({ ...prev, status: "closed" as const }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <EditEventModal
        event={event}
        onClose={() => {}}
        onSave={handleSave}
        onCancelEvent={handleCancelEvent}
        onCloseRegistration={handleCloseRegistration}
      />
    </div>
  );
}
