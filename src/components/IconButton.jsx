import React from 'react';

const getHoverBg = (color) => {
  // Trả về màu nền hover nhạt dựa trên màu chính
  switch (color) {
    case '#1976d2': // blue
      return 'rgba(25, 118, 210, 0.08)';
    case '#ff9800': // orange
      return 'rgba(255, 152, 0, 0.12)';
    case '#d32f2f': // red
      return 'rgba(211, 47, 47, 0.12)';
    case '#43a047': // green
      return 'rgba(67, 160, 71, 0.12)';
    default:
      return 'rgba(0,0,0,0.06)';
  }
};

const IconButton = ({
  icon: Icon,
  color = '#1976d2',
  size = 18,
  title = '',
  onClick,
  style = {},
  disabled = false,
  ...rest
}) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: hover ? getHoverBg(color) : 'transparent',
        color: color,
        border: 'none',
        borderRadius: '50%',
        padding: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size,
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.18s',
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {Icon && <Icon size={size} />}
    </button>
  );
};

export default IconButton; 