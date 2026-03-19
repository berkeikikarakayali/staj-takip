import React from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts';

export function Stats() {
  const { applications } = useStore();

  const statusCount = [
    { name: 'Kabul', value: applications.filter(a => a.status === 'Kabul').length, color: '#10b981' },
    { name: 'Red', value: applications.filter(a => a.status === 'Red').length, color: '#ef4444' },
    { name: 'Devam Ediyor', value: applications.filter(a => !['Kabul', 'Red', 'İptal'].includes(a.status)).length, color: '#3b82f6' },
  ].filter(i => i.value > 0);

  const priorityCount = [
    { name: 'Kritik', value: applications.filter(a => a.priority === 'Kritik').length, color: '#ef4444' },
    { name: 'Yüksek', value: applications.filter(a => a.priority === 'Yüksek').length, color: '#f97316' },
    { name: 'Orta', value: applications.filter(a => a.priority === 'Orta').length, color: '#3b82f6' },
    { name: 'Düşük', value: applications.filter(a => a.priority === 'Düşük').length, color: '#10b981' },
  ].filter(i => i.value > 0);

  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const currentYear = new Date().getFullYear();
  
  const monthlyData = months.map((month, index) => {
    const appsInMonth = applications.filter(a => {
      const d = new Date(a.appliedDate);
      return d.getMonth() === index && d.getFullYear() === currentYear;
    });
    return {
      name: month,
      Sayi: appsInMonth.length
    };
  });

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
         <h3 className="text-xl font-bold">Veri Yok</h3>
         <p className="text-muted-foreground mt-2">İstatistikleri görebilmek için en az bir başvuru eklemelisiniz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">İstatistikler</h1>
      <p className="text-muted-foreground">Başvurularınızın özet analizleri ve başarı grafikleri.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm">
           <h3 className="text-lg font-semibold mb-6 text-center">Durum Dağılımı</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusCount} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {statusCount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
           <h3 className="text-lg font-semibold mb-6 text-center">Öncelik Dağılımı</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityCount} cx="50%" cy="50%" innerRadius={0} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {priorityCount.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm md:col-span-2">
           <h3 className="text-lg font-semibold mb-6 text-center">{currentYear} Yılı Başvuru Trendi</h3>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                 <RechartsTooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{borderRadius: '8px', border: '1px solid hsl(var(--border))'}} />
                 <Bar dataKey="Sayi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
