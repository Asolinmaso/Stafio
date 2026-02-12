import React, { useState } from "react";
import { Card, Dropdown } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  // LabelList,
} from "recharts";

import { FaSlidersH } from "react-icons/fa";

// ✅ Memoized component so it won't re-render unnecessarily
const AttendanceCard = ({ dataSets }) => {
  // const [view, setView] = useState("monthly");
  // const highlighted = data.filter((d) => d.highlight);
  const [view, setView] = useState("months");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = dataSets[view];

  return (
    <Card className="attendance-card p-3" style={{ borderRadius: "16px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Monthly Attendance</h6>

        <Dropdown>
          <Dropdown.Toggle variant="light" size="sm">
            <FaSlidersH />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setView("months")}>
              Months
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setView("weeks")}>
              Weeks
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setView("days")}>
              days
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Chart */}                                         {/* modified height */}
       <ResponsiveContainer width="100%" height={190}>    
        <BarChart data={data}>
          <XAxis
            dataKey="label"
            
            interval={0}   // ✅ prevents text breaking
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip cursor={false} formatter={(v) => `${v}%`} />

          <Bar dataKey="value" radius={[6, 6, 0, 0]}
          onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={hoveredIndex === index ? "#00B5E2" : "#E6EEF3"}
                onMouseEnter={() => setHoveredIndex(index)}
                style={{ transition: "fill 0.1s ease" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttendanceCard;