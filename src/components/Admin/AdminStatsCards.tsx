import React from 'react';
import { Users, FolderKanban, Briefcase, CheckCircle } from 'lucide-react';
import { AdminStats } from '../../types/admin';

interface AdminStatsCardsProps {
  stats: AdminStats;
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats.users.total,
      icon: Users,
      color: 'bg-blue-500',
      details: Object.entries(stats.users.byRole).map(([role, count]) => (
        `${role}: ${count}`
      )).join(' · ')
    },
    {
      title: 'Active Projects',
      value: stats.projects.active,
      total: stats.projects.total,
      icon: FolderKanban,
      color: 'bg-green-500',
      details: `${stats.projects.pending} pending approval`
    },
    {
      title: 'Open Positions',
      value: stats.postes.open,
      total: stats.postes.total,
      icon: Briefcase,
      color: 'bg-purple-500',
      details: 'Across all projects'
    },
    {
      title: 'Applications',
      value: stats.candidatures.accepted,
      total: stats.candidatures.total,
      icon: CheckCircle,
      color: 'bg-yellow-500',
      details: `${stats.candidatures.pending} pending review`
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {card.value}
                    </div>
                    {card.total && (
                      <div className="ml-2 text-sm text-gray-500">
                        of {card.total}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                {card.details}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;