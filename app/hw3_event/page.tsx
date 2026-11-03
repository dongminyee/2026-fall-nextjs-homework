import TimeTableOTL from "./components/time_table_otl";
import ResizablePanel from "./components/resizable_panel";
import SortableLectureList from "./components/sortable_lecture_list";

export default function Homework3Page() {
  return (
    <main className="min-h-screen bg-[#f9f0f0] p-6 md:p-8 flex items-center justify-center">
      <section className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg">
        <header className="border-b border-pink-100 bg-[#fffafa] p-4">
          <h1 className="text-2xl font-semibold text-gray-800">Homework 3</h1>
          <p className="text-sm text-gray-600">Next.js Seminar · Event handling</p>
        </header>
        <div className="h-[680px]">
          <ResizablePanel
            leftPanel={<TimeTableOTL />}
            rightPanel={<SortableLectureList />}
            initialWidth={600}
            minWidth={320}
            maxWidth={850}
          />
        </div>
        <footer className="border-t border-pink-100 bg-[#fffafa] p-4 text-center text-sm text-gray-500">
          © 2026 SPARCS @benny
        </footer>
      </section>
    </main>
  );
}
