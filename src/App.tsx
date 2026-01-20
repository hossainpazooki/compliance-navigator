import { Routes, Route } from 'react-router-dom';
import { Header, ViewTabs, Footer } from '@/components/layout';
import { Navigator, Pathway, Conflicts, WhatIf, Decoder, LogicDemo } from '@/pages';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl p-6">
        <Header />
        <ViewTabs />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Navigator />} />
            <Route path="/pathway" element={<Pathway />} />
            <Route path="/conflicts" element={<Conflicts />} />
            <Route path="/whatif" element={<WhatIf />} />
            <Route path="/decoder" element={<Decoder />} />
            <Route path="/logic" element={<LogicDemo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
