export default function Header() {
    return (
      <div className="text-center p-5 relative z-10">
        <div 
          className="text-3xl font-bold mb-1"
          style={{
            background: 'linear-gradient(to right, #ff9900, #ff00ff, #00ffff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 10px rgba(255, 105, 180, 0.7)'
          }}
        >
          karaokeGoGo
        </div>
        <div 
          className="text-lg text-gray-200"
          style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.6)' }}
        >
          Pour your soul. Remix your world.
        </div>
      </div>
    )
  }