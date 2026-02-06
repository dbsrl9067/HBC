import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LabProvider } from './context/LabContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Members } from './pages/Members';
import { Research } from './pages/Research';
import { Publications } from './pages/Publications';
import { Contact } from './pages/Contact';

function App() {
  return (
    <LabProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="members" element={<Members />} />
            <Route path="research" element={<Research />} />
            <Route path="publications" element={<Publications />} />
            <Route path="contact" element={<Contact />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </LabProvider>
  );
}

export default App;