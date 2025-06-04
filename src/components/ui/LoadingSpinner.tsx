const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-neutral-300 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-8 h-8 border-2 border-transparent border-t-neutral-900 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm text-neutral-600 animate-pulse">
          Loading 3D Scene...
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner
