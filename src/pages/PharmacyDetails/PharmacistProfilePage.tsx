import { useAuth } from "../../contexts/AuthContext";

const PharmacistProfilePage = () => {
  const { user } = useAuth();
  const recentActivities = [
    {
      id: 1,
      type: "LOGIN",
      timestamp: "2025-07-12 11:23 AM",
      ip: "102.120.85.12",
      location: "Addis Ababa, Ethiopia",
    },
    {
      id: 2,
      type: "PROFILE_UPDATE",
      timestamp: "2025-07-10 8:45 PM",
      ip: "102.120.85.12",
      location: "Addis Ababa, Ethiopia",
      changes: [
        { field: "First Name", oldValue: "Amina", newValue: user?.first_name },
        {
          field: "Email",
          oldValue: "amina.bekele@oldmail.com",
          newValue: user?.email,
        },
      ],
    },
    {
      id: 3,
      type: "LOGOUT",
      timestamp: "2025-07-10 9:15 PM",
      ip: "102.120.85.12",
      location: "Addis Ababa, Ethiopia",
    },
  ];
  if (!user) return null;
  return (
    <div className="w-full flex items-center justify-center dark:bg-gray-900 px-4">
      <div className="w-full  dark:bg-gray-800 p-6 transition-colors duration-300">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-600 dark:text-white text-4xl font-semibold">
            {user?.first_name[0]}
            {user?.last_name[0]}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
            {user?.first_name} &nbsp;
            {user?.last_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b-[1px] text-sm text-gray-600 dark:text-gray-300">
              <span>First Name:</span>
              <span>{user?.first_name}</span>
            </div>
            <div className="flex justify-between border-b-[1px] text-sm text-gray-600 dark:text-gray-300">
              <span>Last Name:</span>
              <span>{user.last_name}</span>
            </div>
            <div className="flex justify-between border-b-[1px] text-sm text-gray-600 dark:text-gray-300">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <div className="my-12">
          <div className="w-full mx-auto py-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {activity.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    IP: {activity.ip} — {activity.location}
                  </p>

                  {activity.changes && (
                    <ul className="mt-3 pl-4 text-sm text-gray-500 dark:text-gray-400 list-disc">
                      {activity.changes.map((change, index) => (
                        <li key={index}>
                          <strong>{change.field}:</strong>{" "}
                          <span className="line-through text-red-400">
                            {change.oldValue}
                          </span>{" "}
                          →{" "}
                          <span className="text-green-500">
                            {change.newValue}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistProfilePage;
