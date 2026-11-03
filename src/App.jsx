import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './state.jsx'
import Landing from './pages/Landing.jsx'
import { Login, JoinClass, TeacherSignup } from './pages/Auth.jsx'
import StudentShell from './pages/StudentShell.jsx'
import Home from './pages/Home.jsx'
import Region from './pages/Region.jsx'
import Mission from './pages/Mission.jsx'
import Badges from './pages/Badges.jsx'
import AvatarStudio from './pages/AvatarStudio.jsx'
import Journal from './pages/Journal.jsx'
import TeacherShell from './pages/teacher/TeacherShell.jsx'
import Overview from './pages/teacher/Overview.jsx'
import Students from './pages/teacher/Students.jsx'
import StudentDetail from './pages/teacher/StudentDetail.jsx'
import Scenarios from './pages/teacher/Scenarios.jsx'
import ScenarioEditor from './pages/teacher/ScenarioEditor.jsx'
import Assignments from './pages/teacher/Assignments.jsx'
import { Forbidden, NotFound, Loading } from './pages/Misc.jsx'

function Require({ role, children }) {
  const { user, ready } = useAuth()
  const loc = useLocation()
  if (!ready) return <Loading />
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (user.role !== role) return <Forbidden need={role} />
  return children
}

function Home0() {
  const { user, ready } = useAuth()
  if (!ready) return <Loading />
  if (user) return <Navigate to={user.role === 'teacher' ? '/teacher' : '/play'} replace />
  return <Landing />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home0 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<JoinClass />} />
      <Route path="/teacher/signup" element={<TeacherSignup />} />
      <Route path="/play" element={<Require role="student"><StudentShell /></Require>}>
        <Route index element={<Home />} />
        <Route path="region/:id" element={<Region />} />
        <Route path="mission/:id" element={<Mission />} />
        <Route path="badges" element={<Badges />} />
        <Route path="avatar" element={<AvatarStudio />} />
        <Route path="journal" element={<Journal />} />
      </Route>
      <Route path="/teacher" element={<Require role="teacher"><TeacherShell /></Require>}>
        <Route index element={<Overview />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="scenarios" element={<Scenarios />} />
        <Route path="scenarios/new" element={<ScenarioEditor />} />
        <Route path="scenarios/:id" element={<ScenarioEditor />} />
        <Route path="assignments" element={<Assignments />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
