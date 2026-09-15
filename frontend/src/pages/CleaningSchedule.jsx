import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Search,
  Plus,
  Pencil,
  Trash2,
  UserRound,
  Home,
  RefreshCw,
} from "lucide-react";

import {
  getCleaningTasks,
  createCleaningTask,
  updateCleaningTask,
  deleteCleaningTask,
} from "../services/cleaningTaskService";

const UNIT_LISTINGS_API = "http://127.0.0.1:8000/api/v1/unit-listings";

const statuses = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

const statusStyles = {
  scheduled: "bg-[#f4e4eb] text-[#7a3158]",
  in_progress: "bg-[#fff0d9] text-[#9a641d]",
  completed: "bg-[#dff3e7] text-[#24734a]",
  cancelled: "bg-[#eeeeee] text-[#666666]",
};

const formatStatus = (status) =>
  status
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CleaningSchedule = () => {
  const [tasks, setTasks] = useState([]);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    unit_id: "",
    turnover_start: "",
    turnover_end: "",
    assigned_vendor: "",
    status: "scheduled",
  });

  const loadUnits = async () => {
    try {
      const response = await fetch(UNIT_LISTINGS_API);

      if (!response.ok) {
        throw new Error("Failed to load unit listings.");
      }

      const data = await response.json();

      console.log("Unit listings:", data);

      setUnits(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      console.error("Unit loading error:", err);
      setError(err.message);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCleaningTasks({
        status: statusFilter || undefined,
      });

      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    loadUnits();
  }, [statusFilter]);

  const getUnitById = (unitId) =>
    units.find((unit) => unit.id === unitId);

  const resetForm = () => {
    setForm({
      unit_id: "",
      turnover_start: "",
      turnover_end: "",
      assigned_vendor: "",
      status: "scheduled",
    });

    setEditingTask(null);
  };

  const openCreate = () => {
    resetForm();
    setError("");
    setShowForm(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);

    setForm({
      unit_id: task.unit_id,
      turnover_start: task.turnover_start?.slice(0, 16) || "",
      turnover_end: task.turnover_end?.slice(0, 16) || "",
      assigned_vendor: task.assigned_vendor || "",
      status: task.status,
    });

    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.unit_id ||
      !form.turnover_start ||
      !form.turnover_end
    ) {
      setError("Unit, start time and end time are required.");
      return;
    }

    if (
      new Date(form.turnover_end) <=
      new Date(form.turnover_start)
    ) {
      setError("Turnover end time must be after start time.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        assigned_vendor: form.assigned_vendor || null,
        turnover_start: new Date(
          form.turnover_start
        ).toISOString(),
        turnover_end: new Date(
          form.turnover_end
        ).toISOString(),
      };

      if (editingTask) {
        await updateCleaningTask(
          editingTask.id,
          payload
        );
      } else {
        await createCleaningTask(payload);
      }

      setShowForm(false);
      resetForm();

      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cleaning task?")) {
      return;
    }

    try {
      setError("");

      await deleteCleaningTask(id);

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const unit = getUnitById(task.unit_id);

    const text = [
      unit?.name,
      unit?.location,
      task.unit_id,
      task.assigned_vendor,
      task.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-full bg-[#faf7f8]">

      {/* Hero / Page Header */}
      <section className="relative overflow-hidden border-b border-[#eadfe4] bg-[#fffdfd] px-8 py-7">
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-[12px] text-[#927f89]">
            <span>Home</span>
            <span>›</span>
            <span className="font-medium text-[#54213f]">
              Cleaning Schedule
            </span>
          </div>

          <h1 className="font-serif text-[32px] font-semibold text-[#54213f]">
            Cleaning Schedule
          </h1>

          <p className="mt-2 text-[14px] text-[#806f78]">
            Manage property turnovers, cleaning assignments and task status.
          </p>
        </div>

        <div className="pointer-events-none absolute right-8 top-3 font-serif text-[28px] italic text-[#d9a8b8]/50">
          Beautiful
          <br />
          Places
        </div>
      </section>

      <main className="p-8">

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative w-[280px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8b95]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cleaning tasks..."
                className="h-[42px] w-full rounded-xl border border-[#eadfe4] bg-white pl-11 pr-4 text-[13px] text-[#54213f] outline-none focus:border-[#8b4a6b]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-[42px] rounded-xl border border-[#eadfe4] bg-white px-4 text-[13px] text-[#54213f] outline-none"
            >
              <option value="">All Statuses</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={loadTasks}
              className="flex h-[42px] items-center gap-2 rounded-xl border border-[#eadfe4] bg-white px-4 text-[13px] font-medium text-[#54213f] hover:bg-[#f8f1f4]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>

          </div>

          {/* Add Task */}
          <button
            type="button"
            onClick={openCreate}
            className="flex h-[42px] items-center gap-2 rounded-xl bg-[#74264f] px-5 text-[13px] font-semibold text-white shadow-sm hover:bg-[#642043]"
          >
            <Plus size={17} />
            Add Cleaning Task
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-[#e9c7d2] bg-[#fff1f4] px-4 py-3 text-[13px] text-[#9a3153]">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-[#eadfe4] bg-white p-6 shadow-sm"
          >

            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-[21px] font-semibold text-[#54213f]">
                {editingTask
                  ? "Edit Cleaning Task"
                  : "Add Cleaning Task"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-[13px] text-[#927f89] hover:text-[#54213f]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Unit */}
              <label className="text-[12px] font-medium text-[#6f5d67]">
                Unit

                <select
                  required
                  value={form.unit_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unit_id: e.target.value,
                    })
                  }
                  className="mt-2 h-[42px] w-full rounded-xl border border-[#eadfe4] bg-white px-4 text-[13px] text-[#54213f] outline-none focus:border-[#8b4a6b]"
                >
                  <option value="">
                    Select a unit
                  </option>

                  {units.map((unit) => (
                    <option
                      key={unit.id}
                      value={unit.id}
                    >
                      {unit.name}
                    </option>
                  ))}
                </select>
              </label>

              {/* Assigned Vendor */}
              <label className="text-[12px] font-medium text-[#6f5d67]">
                Assigned Vendor

                <input
                  value={form.assigned_vendor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assigned_vendor: e.target.value,
                    })
                  }
                  placeholder="Cleaning vendor"
                  className="mt-2 h-[42px] w-full rounded-xl border border-[#eadfe4] px-4 text-[13px] text-[#54213f] outline-none focus:border-[#8b4a6b]"
                />
              </label>

              {/* Turnover Start */}
              <label className="text-[12px] font-medium text-[#6f5d67]">
                Turnover Start

                <input
                  required
                  type="datetime-local"
                  value={form.turnover_start}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      turnover_start: e.target.value,
                    })
                  }
                  className="mt-2 h-[42px] w-full rounded-xl border border-[#eadfe4] px-4 text-[13px] text-[#54213f] outline-none focus:border-[#8b4a6b]"
                />
              </label>

              {/* Turnover End */}
              <label className="text-[12px] font-medium text-[#6f5d67]">
                Turnover End

                <input
                  required
                  type="datetime-local"
                  value={form.turnover_end}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      turnover_end: e.target.value,
                    })
                  }
                  className="mt-2 h-[42px] w-full rounded-xl border border-[#eadfe4] px-4 text-[13px] text-[#54213f] outline-none focus:border-[#8b4a6b]"
                />
              </label>

              {/* Status */}
              <label className="text-[12px] font-medium text-[#6f5d67]">
                Status

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="mt-2 h-[42px] w-full rounded-xl border border-[#eadfe4] bg-white px-4 text-[13px] text-[#54213f] outline-none"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </label>

            </div>

            <div className="mt-5 flex justify-end">
              <button
                disabled={saving}
                type="submit"
                className="rounded-xl bg-[#74264f] px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingTask
                    ? "Save Changes"
                    : "Create Task"}
              </button>
            </div>

          </form>
        )}

        {/* Tasks */}
        {loading ? (
          <div className="rounded-2xl border border-[#eadfe4] bg-white p-10 text-center text-[13px] text-[#927f89]">
            Loading cleaning schedule...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-[#eadfe4] bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4e4eb] text-[#74264f]">
              <CalendarDays size={25} />
            </div>

            <h3 className="font-serif text-[21px] font-semibold text-[#54213f]">
              No cleaning tasks
            </h3>

            <p className="mt-2 text-[13px] text-[#927f89]">
              Create a task to start managing property turnovers.
            </p>

            <button
              onClick={openCreate}
              className="mt-5 rounded-xl bg-[#74264f] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Add Cleaning Task
            </button>

          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#eadfe4] bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead className="border-b border-[#eadfe4] bg-[#fcf8fa]">
                  <tr className="text-left text-[11px] uppercase tracking-wide text-[#927f89]">
                    <th className="px-6 py-4">
                      Unit
                    </th>

                    <th className="px-6 py-4">
                      Turnover Window
                    </th>

                    <th className="px-6 py-4">
                      Vendor
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task) => {
                    const unit = getUnitById(
                      task.unit_id
                    );

                    return (
                      <tr
                        key={task.id}
                        className="border-b border-[#f0e7eb] last:border-0 hover:bg-[#fffafb]"
                      >

                        {/* Unit */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e4eb] text-[#74264f]">
                              <Home size={18} />
                            </div>

                            <div>
                              <p className="text-[13px] font-semibold text-[#54213f]">
                                {unit?.name ||
                                  "Unknown Unit"}
                              </p>

                              <p className="mt-1 text-[11px] text-[#927f89]">
                                {unit?.location ||
                                  "Location unavailable"}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Turnover Window */}
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-2">

                            <Clock3
                              size={16}
                              className="mt-0.5 text-[#8b4a6b]"
                            />

                            <div>
                              <p className="text-[12px] font-medium text-[#54213f]">
                                {formatDateTime(
                                  task.turnover_start
                                )}
                              </p>

                              <p className="mt-1 text-[11px] text-[#927f89]">
                                to{" "}
                                {formatDateTime(
                                  task.turnover_end
                                )}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Vendor */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[12px] text-[#6f5d67]">

                            <UserRound size={15} />

                            {task.assigned_vendor ||
                              "Unassigned"}

                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                              statusStyles[task.status]
                            }`}
                          >
                            {formatStatus(
                              task.status
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                openEdit(task)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#74264f] hover:bg-[#f6edf1]"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(task.id)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#a34c63] hover:bg-[#fff0f3]"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CleaningSchedule;