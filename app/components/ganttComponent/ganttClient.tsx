"use client";

import dynamic from "next/dynamic";
export type Task = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  percent?: number; 
  dependencies?: string[];
  subtasks?: Task[]; 
};

export type TaskGroup = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tasks: Task[];
};
const GanttChart = dynamic(() => import("react-modern-gantt"), { ssr: false });

export default function GanttClient({ groups }: { groups: TaskGroup[] }) {
  return (
    <div style={{ height: 650 }}>
      <GanttChart tasks={groups} />
    </div>
  );
}
