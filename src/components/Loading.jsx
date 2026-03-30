const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Coffee A Đông</h1>

      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

      <p className="mt-4 text-gray-500">Đang tải hệ thống...</p>
    </div>
  );
};

export default Loading;
