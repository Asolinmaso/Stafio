import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Table,
  Alert,
  Row,
  Col,
  ProgressBar,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  FaUsers,
  FaTasks,
  FaProjectDiagram,
  FaStar,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

const API_BASE = "http://127.0.0.1:5001";

const MonthlyPerformanceReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const [performanceRes, summaryRes] = await Promise.all([
        axios.get(`${API_BASE}/api/performance`),
        axios.get(`${API_BASE}/api/performance/summary`),
      ]);

      // Map API data to expected format
      const mappedData = performanceRes.data.map((item, index) => ({
        id: item.id || index + 1,
        name: item.employee_name || "Unknown",
        tasksCompleted: item.tasks_completed || 0,
        projectsCompleted: item.projects_completed || 0,
        feedbackScore: item.feedback_score || 0,
      }));

      setReportData(mappedData);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      // Set fallback data if API fails
      setReportData([]);
      setSummary({
        total_employees: 0,
        total_tasks_this_month: 0,
        completed_tasks_this_month: 0,
        average_feedback_score: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard metrics
  const totalEmployees = summary?.total_employees || reportData.length || 0;
  const totalTasks =
    summary?.total_tasks_this_month ||
    reportData.reduce((acc, e) => acc + e.tasksCompleted, 0);
  const totalProjects = reportData.reduce(
    (acc, e) => acc + e.projectsCompleted,
    0,
  );
  const avgFeedbackScore =
    summary?.average_feedback_score?.toFixed(1) ||
    (reportData.length > 0
      ? (
          reportData.reduce((acc, e) => acc + e.feedbackScore, 0) /
          reportData.length
        ).toFixed(1)
      : "0.0");

  // Sort data to find top performers
  const sortedByTasks = [...reportData].sort(
    (a, b) => b.tasksCompleted - a.tasksCompleted,
  );
  const topTaskPerformer = sortedByTasks[0] || {
    name: "N/A",
    tasksCompleted: 0,
  };

  const sortedByFeedback = [...reportData].sort(
    (a, b) => b.feedbackScore - a.feedbackScore,
  );
  const topFeedbackPerformer = sortedByFeedback[0] || {
    name: "N/A",
    feedbackScore: 0,
  };

  // Calculate productivity percentage
  const productivityPercent =
    summary?.total_tasks_this_month > 0
      ? Math.round(
          (summary.completed_tasks_this_month /
            summary.total_tasks_this_month) *
            100,
        )
      : 0;

  if (loading) {
    return (
      <div>
        <AdminSidebar />
        <Container className="my-5 p-4 bg-light rounded shadow-lg text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <Container className="my-5 p-4 bg-light rounded shadow-lg">
        {/* --- KPI Cards Section --- */}
        <Row className="g-4 mb-5">
          <Col md={6} lg={3}>
            <Card className="h-100 border-primary shadow-sm">
              <Card.Body className="text-center">
                <FaUsers size={40} className="text-primary mb-3" />
                <h6>Total Employees</h6>
                <h2 className="display-4 fw-bold">{totalEmployees}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 border-success shadow-sm">
              <Card.Body className="text-center">
                <FaTasks size={40} className="text-success mb-3" />
                <h6>Tasks Completed</h6>
                <h2 className="display-4 fw-bold">
                  {summary?.completed_tasks_this_month || totalTasks}
                </h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 border-info shadow-sm">
              <Card.Body className="text-center">
                <FaProjectDiagram size={40} className="text-info mb-3" />
                <h6>Projects Completed</h6>
                <h2 className="display-4 fw-bold">{totalProjects}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="h-100 border-warning shadow-sm">
              <Card.Body className="text-center">
                <FaStar size={40} className="text-warning mb-3" />
                <h6>Avg Feedback Score</h6>
                <h2 className="display-4 fw-bold">{avgFeedbackScore}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- Top Performers and Overall Progress --- */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h5" className="bg-light">
                <FaTrophy className="me-2 text-warning" />
                Top Performers
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Top Task Performer
                    <div>
                      <Badge bg="success" className="me-2">
                        {topTaskPerformer.tasksCompleted} Tasks
                      </Badge>
                      <span className="fw-bold">{topTaskPerformer.name}</span>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    Highest Feedback Score
                    <div>
                      <Badge bg="info" className="me-2">
                        {topFeedbackPerformer.feedbackScore} ⭐
                      </Badge>
                      <span className="fw-bold">
                        {topFeedbackPerformer.name}
                      </span>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header as="h5" className="bg-light">
                <FaChartLine className="me-2 text-secondary" />
                Overall Progress
              </Card.Header>
              <Card.Body>
                <h6 className="mt-3">Team Productivity</h6>
                <ProgressBar
                  now={productivityPercent}
                  label={`${productivityPercent}%`}
                  variant="success"
                  className="mb-3"
                />
                <h6 className="mt-3">Project Delivery Rate</h6>
                <ProgressBar
                  now={90}
                  label={`${90}%`}
                  variant="primary"
                  className="mb-3"
                />
                <h6 className="mt-3">Average Feedback Rating</h6>
                <ProgressBar
                  now={avgFeedbackScore * 20}
                  label={`${avgFeedbackScore}⭐`}
                  variant="warning"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- Full Performance Report Table --- */}
        <Card className="shadow-sm">
          <Card.Header as="h5" className="bg-light">
            Employee Performance Breakdown
          </Card.Header>
          <Card.Body>
            {reportData.length > 0 ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Tasks Completed</th>
                    <th>Projects Completed</th>
                    <th>Feedback Score</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((employee, index) => (
                    <tr key={employee.id}>
                      <td>{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>
                        <Badge bg="primary">{employee.tasksCompleted}</Badge>
                      </td>
                      <td>
                        <Badge bg="info">{employee.projectsCompleted}</Badge>
                      </td>
                      <td>
                        <Badge bg="warning" text="dark">
                          {employee.feedbackScore} ⭐
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info" className="text-center">
                No performance data available for this month.
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MonthlyPerformanceReport;
