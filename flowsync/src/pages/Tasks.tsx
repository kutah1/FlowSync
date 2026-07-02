import { useMemo, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { MdDragIndicator } from "react-icons/md";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import NewIntentModal from "../components/NewIntentModal";
import Card from "../components/ui/Card";
import SectionLabel from "../components/ui/SectionLabel";

type Difficulty = "Hard" | "Medium" | "Easy";
type When = "day" | "week" | "month" | "year";

interface Task {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  deadline?: string;
  when: When;
  done: boolean;
}

const difficultyStyles: Record<Difficulty, string> = {
  Hard: "bg-pink-100 text-pink-600",
  Medium: "bg-amber-100 text-amber-600",
  Easy: "bg-green-100 text-green-600",
};

// Hardcoded sample tasks
const initialTasks: Task[] = [
  { id: 1, title: "Finish Q3 Presentation", difficulty: "Hard", category: "Work", deadline: "Today", when: "day", done: false },
  { id: 2, title: "Review product proposal", difficulty: "Hard", category: "Work", deadline: "Tomorrow", when: "week", done: false },
  { id: 3, title: "Plan next sprint", difficulty: "Medium", category: "Work", when: "week", done: false },
  { id: 4, title: "Reply to emails", difficulty: "Easy", category: "Personal", when: "day", done: false },
  { id: 5, title: "Quarterly OKR review", difficulty: "Medium", category: "Business", deadline: "This month", when: "month", done: false },
  { id: 6, title: "Plan 2027 roadmap", difficulty: "Hard", category: "Business", when: "year", done: false },
  { id: 7, title: "Organize desktop files", difficulty: "Easy", category: "Personal", when: "day", done: true },
];

const priorityFilters: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const timeFilters: { key: When; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<Difficulty | "All">("All");
  const [when, setWhen] = useState<When>("week");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  // Filter (order preserved from master list, which drag-and-drop mutates)
  const visible = useMemo(
    () =>
      tasks.filter((t) => {
        if (priority !== "All" && t.difficulty !== priority) return false;
        // time buckets are cumulative: a "day" task also shows under week/month/year
        const rank: Record<When, number> = { day: 0, week: 1, month: 2, year: 3 };
        if (rank[t.when] > rank[when]) return false;
        if (query && !t.title.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [tasks, priority, when, query]
  );

  const visibleIds = visible.map((t) => t.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  const remaining = visible.filter((t) => !t.done).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Tasks</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Drag to reorder — MiniMe suggests hardest first on a{" "}
            <span className="font-semibold text-brand">High Energy</span> day.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-dark sm:inline-flex"
        >
          <HiOutlinePlus /> Add Task
        </button>
      </div>

      {/* Recommendation banner */}
      <div className="flex items-center gap-3 rounded-2xl bg-brand-soft p-4 text-sm text-brand">
        <HiOutlineSparkles className="shrink-0 text-lg" />
        <p>
          Start with <strong>Finish Q3 Presentation</strong> while your focus is high.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks…"
          className="h-12 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand"
        />
      </div>

      {/* Time filter (segmented) */}
      <div className="flex rounded-full bg-neutral-100 p-1">
        {timeFilters.map((t) => (
          <button
            key={t.key}
            onClick={() => setWhen(t.key)}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              when === t.key
                ? "bg-white text-brand shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Priority filter chips */}
      <div className="flex flex-wrap gap-2">
        {priorityFilters.map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              priority === p
                ? "bg-brand text-white"
                : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        <SectionLabel className="mb-3">
          {remaining} remaining · {visible.length} shown
        </SectionLabel>

        {visible.length === 0 ? (
          <Card className="text-center text-neutral-500">
            No tasks match your filters. Try widening the range or adding a task.
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {visible.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onToggle={() => toggle(task.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Mobile add button */}
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-semibold text-white shadow-brand transition hover:bg-brand-dark sm:hidden"
      >
        <HiOutlinePlus /> Add Task
      </button>

      <NewIntentModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          setTasks((prev) => [
            {
              id: Date.now(),
              title: data.title || "Untitled task",
              difficulty: (data.difficulty as Difficulty) || "Medium",
              category: data.category,
              deadline: data.deadline || undefined,
              when: "day",
              done: false,
            },
            ...prev,
          ]);
          setOpen(false);
        }}
      />
    </div>
  );
}

function SortableTask({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-3xl border bg-white p-4 shadow-sm ${
        isDragging ? "border-brand ring-2 ring-brand/20" : "border-neutral-100"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-neutral-300 hover:text-neutral-500 active:cursor-grabbing"
      >
        <MdDragIndicator size={20} />
      </button>

      <input
        type="checkbox"
        checked={task.done}
        onChange={onToggle}
        aria-label={`Mark ${task.title} done`}
        className="h-5 w-5 shrink-0 accent-brand"
      />

      <div className="min-w-0 flex-1">
        <h3
          className={`truncate font-medium ${
            task.done ? "text-neutral-400 line-through" : "text-neutral-900"
          }`}
        >
          {task.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${difficultyStyles[task.difficulty]}`}
          >
            {task.difficulty}
          </span>
          <span>{task.category}</span>
          {task.deadline && (
            <span className="inline-flex items-center gap-1">
              <HiOutlineClock /> {task.deadline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
