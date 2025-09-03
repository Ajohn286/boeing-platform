export default function ProcessBuilder() {
  return (
    <div className="h-screen w-full">
      {/* Header with Boeing Logo */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <img
            src="/media/Boeing_logo.png"
            alt="Boeing"
            className="h-8 w-auto mr-4"
          />
          <h1 className="text-xl font-semibold text-gray-900">Boeing Process Builder</h1>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)]">
        <iframe
          src="https://airbuswatchtower.vercel.app/process-builder"
          className="w-full h-full border-0"
          title="Boeing Control Tower Process Builder"
          allowFullScreen
        />
      </div>
    </div>
  );
}
