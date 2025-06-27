import React, { useState, useEffect } from "react";
import Sidebar from "@components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import CheckinModal from "@components/modals/CheckInModal";
import AssinaturaModal from "../components/modals/AssinaturaModal";
import AtualizarEstadoModal from "@components/modals/AtualizarEstadoModal"

export default function Layout() {
  const [showCheckin, setShowCheckin] = useState(false);
  const [showRenewSignature, setShowRenewSignature] = useState(false);
  const [showUpdateState, setShowUpdateState] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize('mobile');
        setSidebarCollapsed(false); // Reset collapse on mobile
      } else if (width <= 1024) {
        setScreenSize('tablet');
        setSidebarCollapsed(true); // Default collapsed on tablet
      } else {
        setScreenSize('desktop');
        setSidebarCollapsed(false); // Default expanded on desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout-container">
      <div className={`layout-wrapper ${screenSize}`}>
        {/* Sidebar - All screen sizes */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          screenSize={screenSize}
        />

        {/* Main Content */}
        <main className={`main-content ${screenSize} ${sidebarCollapsed && screenSize === 'tablet' ? 'sidebar-collapsed' : ''}`}>
          <div className="content-wrapper">
            <Outlet context={{
              onCheckinClick: () => setShowCheckin(true),
              onRenewSignatureClick: () => setShowRenewSignature(true),
              onUpdateStateClick: () => setShowUpdateState(true),
            }} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <CheckinModal
        show={showCheckin}
        onClose={() => setShowCheckin(false)}
        onSaved={() => {
          setShowCheckin(false);
          window.dispatchEvent(new Event('checkin'));
        }}
      />
      <AssinaturaModal
        show={showRenewSignature}
        onClose={() => setShowRenewSignature(false)}
        onSaved={() => setShowRenewSignature(false)}
      />
      <AtualizarEstadoModal
        show={showUpdateState}
        onClose={() => setShowUpdateState(false)}
        onSaved={() => setShowUpdateState(false)}
      />
    </div>
  );
}