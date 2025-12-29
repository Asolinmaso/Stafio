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
} from "recharts";
import { FaSlidersH } from "react-icons/fa";
import "./AttendanceCard.css";

const AttendanceCard = ({ dataSets }) => {
  const [view, setView] = useState("months");
  const [activeIndex, setActiveIndex] = useState(null);

  const data = dataSets[view];

  return (
    <Card className="attendance-card">
      <Card.Body>
        {/* Header */}
        <div className="attendance-header1">
          <h5>Monthly Attendance</h5>

          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="settings-btn">
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
                Days
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="label" />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(v) => `${v}%`}
            />

            <Bar
              dataKey="value"
              barSize={28}
              radius={[8, 8, 0, 0]}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === activeIndex ? "#19BDE8" : "#E6EEF3"}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default AttendanceCard;
