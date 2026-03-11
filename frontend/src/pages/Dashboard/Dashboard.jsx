import React, { useEffect, useState } from "react";
import progressService from "../../services/progressService";
import Spinner from '../../components/common/Spinner';

const Dashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();

        console.log("Dashboard data:", data);

        setDashboard(data.data);
        setLoading(false);

      } catch (err) {

        console.error("Error fetching dashboard data:", err);
        setLoading(false);

      }
    };

    fetchDashboardData();

  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboard || !dashboard.overview) {
    return (
      <div className="min-h-screen bg-linear-to-r from-slate-50 via-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            No Dashboard Data Available.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboard.overview.totalDocuments
    },
    {
      label: "Total Flashcards",
      value: dashboard.overview.totalFlashcards
    },
    {
      label: "Total Quizzes",
      value: dashboard.overview.totalQuizzes
    }
  ];

  return (
    <div>
      Dashboard

      {stats.map((stat, index) => (
        <div key={index}>
          <h3>{stat.label}</h3>
          <p>{stat.value}</p>
        </div>
      ))}
      
    </div>
  );
};

export default Dashboard;