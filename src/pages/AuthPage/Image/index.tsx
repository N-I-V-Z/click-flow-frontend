const ImageLeft = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded">
      <video
        src="/assets/vid.webm"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="h-full w-full object-cover"
        onError={(e) => {
          console.error('Video loading error:', e);
        }}
        onLoadStart={() => {}}
        onCanPlay={() => {}}
      >
        <img
          src="https://images.unsplash.com/photo-1555077292-22a4489e5897?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
          alt="Fallback illustration"
          className="h-full w-full object-cover"
        />
      </video>
    </div>
  );
};

export default ImageLeft;
