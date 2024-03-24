import logo from './logo.svg';
import './App.css';
import Layout from './layout/layout';
import Routing from './routing/routing';
import AvailableCourses from './pages/admin/availableCourses/availableCourses';

function App() {
  return (
    <div>
      {/* <AvailableCourses> */}
      <Layout/>
      <Routing/>
      {/* </AvailableCourses> */}
    </div>
  );
}

export default App;
