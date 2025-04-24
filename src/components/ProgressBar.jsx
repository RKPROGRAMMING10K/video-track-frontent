function ProgressBar({ percent }) {
    return (
      <div className="w-full h-3 bg-gray-300 rounded overflow-hidden mt-2">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }
  
  export default ProgressBar;
  