import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BDIX from './pages/BDIX';
import Packages from './pages/Packages';
import Tools from './pages/Tools';
import IPCheck from './pages/IPCheck';
import Bandwidth from './pages/Bandwidth';
import DNS from './pages/DNS';
import Rankings from './pages/Rankings';
import Outages from './pages/Outages';
import Coverage from './pages/Coverage';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="bdix" element={<BDIX />} />
          <Route path="packages" element={<Packages />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/ip-check" element={<IPCheck />} />
          <Route path="tools/bandwidth" element={<Bandwidth />} />
          <Route path="tools/dns" element={<DNS />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="outages" element={<Outages />} />
          <Route path="coverage" element={<Coverage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
