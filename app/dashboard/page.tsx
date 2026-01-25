import React from 'react';
import { FaFileInvoice, FaHome, FaPowerOff, FaUsers } from 'react-icons/fa';
import { bebasNeue } from '../ui/font';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ProductionOverview } from '../components/dashboard/ProductionOverview';

const dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className={`${bebasNeue.className} text-3xl font-bold tracking-tight`}>Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Última actualización: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-xl hover:border-slate-300/70 transition-all duration-500 group dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide dark:text-slate-400">
                            Total de Clientes
                        </CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 dark:bg-slate-700 dark:group-hover:bg-slate-600">
                            <FaUsers className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-3xl font-bold text-slate-800 mb-1 dark:text-slate-200">2,847</div>
                        <CardDescription className="text-sm flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-emerald-600 font-medium">+12%</span>
                            <span className="text-slate-500 dark:text-slate-400">vs mes anterior</span>
                        </CardDescription>
                    </CardContent>
                </Card>
                
                <Card className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-xl hover:border-slate-300/70 transition-all duration-500 group dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide dark:text-slate-400">
                            Órdenes Activas
                        </CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 dark:bg-slate-700 dark:group-hover:bg-slate-600">
                            <FaFileInvoice className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-3xl font-bold text-slate-800 mb-1 dark:text-slate-200">156</div>
                        <CardDescription className="text-sm flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                            <span className="text-emerald-600 font-medium">+8%</span>
                            <span className="text-slate-500 dark:text-slate-400">vs mes anterior</span>
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-xl hover:border-slate-300/70 transition-all duration-500 group dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide dark:text-slate-400">
                            Eficiencia General
                        </CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 dark:bg-slate-700 dark:group-hover:bg-slate-600">
                            <FaHome className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-3xl font-bold text-slate-800 mb-1 dark:text-slate-200">87.3%</div>
                        <CardDescription className="text-sm flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-red-600 font-medium">-2.1%</span>
                            <span className="text-slate-500 dark:text-slate-400">vs ayer</span>
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:shadow-xl hover:border-slate-300/70 transition-all duration-500 group dark:from-slate-900 dark:to-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide dark:text-slate-400">
                            Operadores Activos
                        </CardTitle>
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors duration-300 dark:bg-slate-700 dark:group-hover:bg-slate-600">
                            <FaPowerOff className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-3xl font-bold text-slate-800 mb-1 dark:text-slate-200">24</div>
                        <CardDescription className="text-sm flex items-center gap-1">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-blue-600 font-medium">En línea</span>
                            <span className="text-slate-500 dark:text-slate-400">ahora mismo</span>
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Resumen de Producción</CardTitle>
                        <CardDescription>Estado actual de las líneas de producción</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductionOverview />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                        <CardDescription>Últimas actividades en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default dashboard;