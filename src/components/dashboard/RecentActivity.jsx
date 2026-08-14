import React from 'react';

export default function RecentActivity({ activities = [] }) {
  const formatTimestamp = (timestampStr) => {
    try {
      const date = new Date(timestampStr);
      return date.toLocaleString();
    } catch (e) {
      return timestampStr;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px] overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h1>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity.</p>
      ) : (
        <div className="relative border-l border-gray-200 ml-3 mt-2 space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id || index} className="relative pl-6">
              {/* Timeline Dot */}
              <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-white"></span>
              
              {/* Content */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">{activity.description}</span>
                <span className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
