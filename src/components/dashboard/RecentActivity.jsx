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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h1 className="text-xl font-bold text-gray-900 mb-4 shrink-0">Recent Activity</h1>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity.</p>
      ) : (
        <div className="relative border-l border-gray-200 ml-3 mt-2 space-y-6 flex-1">
          {activities.slice(0, 4).map((activity, index) => (
            <div key={activity.id || index} className="relative pl-6">
              {/* Timeline Dot (Radio Button Style) */}
              <span className="absolute -left-[9px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E8F6F6] ring-4 ring-white">
                <span className="h-2 w-2 rounded-full bg-[#1A9F9A]"></span>
              </span>
              
              {/* Content */}
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-[#0D1933]">{activity.description}</span>
                <span className="text-[14px] text-[#46505F] mt-1">{formatTimestamp(activity.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
