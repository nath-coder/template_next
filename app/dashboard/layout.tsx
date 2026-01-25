import React, { FC, PropsWithChildren } from 'react';
import TopNavigation from '../components/layout/TopNavigation';
import SideNavigation from '../components/layout/SideNavigation';

const DashboardLayout:FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex h-screen flex-col">
            <TopNavigation />
            <div className="flex flex-1 overflow-hidden">
                <SideNavigation />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;