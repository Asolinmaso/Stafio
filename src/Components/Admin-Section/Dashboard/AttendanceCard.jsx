import React from "react";
import { Card } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// ✅ Memoized component so it won't re-render unnecessarily
const AttendanceCard = React.memo(function AttendanceCard({ attendanceData }) {
  const data = Array.isArray(attendanceData) ? attendanceData : [];
  const highlighted = data.filter((d) => d.highlight);

  return (
    <Card className="attendance-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Card.Title>Monthly Attendance Overview</Card.Title>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />

            {/* Default Bars */}
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              fill="#19bde8"
              barSize={30}
            ></Bar>

            {/* Highlighted Bar */}
            {highlighted.length > 0 && (
              <Bar
                dataKey="value"
                data={highlighted}
                radius={[4, 4, 0, 0]}
                fill="#19BDE8"
                barSize={30}
              ></Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
});

export default AttendanceCard;
