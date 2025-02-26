const TaskCardLoadingSkeleton = () => {
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 xl3:grid-cols-5 gap-6">
      {skeletonItems.map((item) => (
        <div
          key={item}
          className="overflow-hidden border border-border rounded-lg p-5 flex flex-col relative animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="h-4 bg-gray-200 rounded w-1/3 flex items-center">
              <div className="h-4 w-4 bg-gray-300 rounded mr-2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskCardLoadingSkeleton;