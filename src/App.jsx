import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppShell from './components/layout/AppShell';
import DashboardHome from './pages/DashboardHome';
import PlaceholderPage from './pages/PlaceholderPage';
import JobScannerPage from './pages/JobScanner';
import AnalysisResultsPage from './pages/AnalysisResults';
import HistoryPage from './pages/History';
import TestChecklist from './pages/TestChecklist';
import ShipPage from './pages/ShipPage';
import ProofPage from './pages/ProofPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Test & Ship Utility Routes */}
        <Route path="/prp/07-test" element={<TestChecklist />} />
        <Route path="/prp/08-ship" element={<ShipPage />} />
        <Route path="/prp/proof" element={<ProofPage />} />

        <Route path="/dashboard" element={<AppShell />}>
          <Route index element={<DashboardHome />} />
          <Route path="scanner" element={<JobScannerPage />} />
          <Route path="results/:id?" element={<AnalysisResultsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="practice" element={<PlaceholderPage title="Practice Arena" />} />
          <Route path="assessments" element={<PlaceholderPage title="Assessments" />} />
          <Route path="resources" element={<PlaceholderPage title="Learning Resources" />} />
          <Route path="profile" element={<PlaceholderPage title="User Profile" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
