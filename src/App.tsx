import { Routes, Route } from 'react-router-dom';
import { Header, ViewTabs, Footer } from '@/components/layout';
import { Navigator, Pathway, Conflicts, WhatIf, Decoder, LogicDemo, DecisionCanvas } from '@/pages';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        {/* Decision Canvas: Full-screen single-canvas layout */}
        <Route path="/canvas" element={<DecisionCanvas />} />

        {/* Legacy tab-based layout */}
        <Route
          path="/*"
          element={
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
          }
        />
      </Routes>
    </div>
  );
}

export default App;
