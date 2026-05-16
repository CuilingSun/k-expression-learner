import { Navigate, Route, Routes } from 'react-router-dom';
import { StatsProvider } from './context/StatsContext';
import WebShell from './components/WebShell';
import HomeScreen from './pages/HomeScreen';
import LibraryScreen from './pages/LibraryScreen';
import DetailScreen from './pages/DetailScreen';
import PracticeScreen from './pages/PracticeScreen';
import PathScreen from './pages/PathScreen';
import ReviewScreen from './pages/ReviewScreen';
import ProfileScreen from './pages/ProfileScreen';
import WeeklyScreen from './pages/WeeklyScreen';
import CompareScreen from './pages/CompareScreen';

export default function App() {
  return (
    <StatsProvider>
      <Routes>
        <Route element={<WebShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/learn" element={<DetailScreen />} />
          <Route path="/learn/:id" element={<DetailScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/practice" element={<PracticeScreen />} />
          <Route path="/practice/:id" element={<PracticeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/path" element={<PathScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/weekly" element={<WeeklyScreen />} />
          <Route path="/compare/:id1/:id2" element={<CompareScreen />} />
          <Route path="/expressions" element={<Navigate to="/library" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </StatsProvider>
  );
}
